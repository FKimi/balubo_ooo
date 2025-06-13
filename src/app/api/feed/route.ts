import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 動的レンダリングを強制
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// レスポンスキャッシュを追加
export const revalidate = 30 // 30秒間キャッシュに短縮

interface Profile {
  user_id: string
  display_name: string
  avatar_image_url?: string
  portfolio_visibility: string
}

interface FeedUser {
  id: string
  display_name: string
  avatar_image_url?: string
}

interface FeedItem {
  id: string
  type: 'work' | 'input'
  title: string
  created_at: string
  user: FeedUser
  likes_count: number
  comments_count: number
  user_has_liked: boolean
  // work specific
  description?: string
  external_url?: string
  tags?: string[]
  roles?: string[]
  banner_image_url?: string
  // input specific
  author_creator?: string
  rating?: number
  cover_image_url?: string
}

interface Work {
  id: string
  user_id: string
  title: string
  description?: string
  external_url?: string
  tags?: string[]
  roles?: string[]
  banner_image_url?: string
  created_at: string
}

interface Input {
  id: string
  user_id: string
  title: string
  author_creator?: string
  rating?: number
  tags?: string[]
  cover_image_url?: string
  created_at: string
}

export async function GET(request: NextRequest) {
  console.log('=== Feed API: フィードデータ取得開始 ===')
  
  // リクエストタイムアウトを20秒に延長
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('リクエストタイムアウト')), 20000)
  })

  try {
    return await Promise.race([
      timeoutPromise,
      processFeedRequest(request)
    ]) as NextResponse
  } catch (error) {
    console.error('Feed API: タイムアウトまたはエラー:', error)
    
    // エラー時は空の配列を返却（デモデータの代わりに）
    return NextResponse.json({
      items: [],
      stats: { total: 0, works: 0, inputs: 0, unique_users: 0 },
      total: 0,
      debug: { 
        message: 'エラーが発生しました', 
        error: true, 
        errorMessage: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }
    })
  }
}

async function processFeedRequest(request: NextRequest) {
  const startTime = Date.now()
  
  // Service roleクライアントを作成
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Feed API: 必要な環境変数が設定されていません')
    return NextResponse.json(
      { error: 'サーバー設定エラー' },
      { status: 500 }
    )
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // 認証されたユーザーの取得（タイムアウト設定を拡張）
  const authHeader = request.headers.get('authorization')
  let currentUserId = null
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const userSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', {
        global: {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      })
      
      // 認証チェックにタイムアウトを設定（5秒に延長）
      const authPromise = userSupabase.auth.getUser(token)
      const authTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('認証タイムアウト')), 5000)
      })
      
      const { data: { user } } = await Promise.race([authPromise, authTimeout]) as any
      if (user) {
        currentUserId = user.id
        console.log('Feed API: 認証ユーザー確認:', user.id)
      }
    } catch (authError) {
      console.log('Feed API: 認証処理エラー（続行）:', authError)
    }
  }

  console.log('Feed API: Step 1 - プロフィール取得開始')
  
  // アクティブなプロフィールを取得（条件を緩和、制限を増加）
  const profilesPromise = supabase
    .from('profiles')
    .select('user_id, display_name, avatar_image_url, portfolio_visibility')
    .or('portfolio_visibility.eq.public,portfolio_visibility.is.null') // nullも含める
    .not('display_name', 'is', null)
    .limit(50) // 制限を増加
  
  const profilesTimeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('プロフィール取得タイムアウト')), 8000) // タイムアウトを延長
  })

  const { data: activeProfiles, error: profilesError } = await Promise.race([
    profilesPromise,
    profilesTimeout
  ]) as any

  console.log('Feed API: Step 2 - プロフィール取得結果:', {
    count: activeProfiles?.length || 0,
    error: profilesError?.message || 'なし'
  })

  if (profilesError || !activeProfiles || activeProfiles.length === 0) {
    console.log('Feed API: アクティブプロフィールなし - 空の結果を返却')
    return NextResponse.json({
      items: [],
      stats: { total: 0, works: 0, inputs: 0, unique_users: 0 },
      total: 0,
      debug: { 
        message: 'アクティブプロフィールなし', 
        profilesError: profilesError?.message,
        profilesCount: 0,
        timestamp: new Date().toISOString()
      }
    })
  }

  const userIds = activeProfiles.map((p: Profile) => p.user_id)
  const profileMap = new Map<string, FeedUser>(
    activeProfiles.map((p: Profile) => [p.user_id, {
      id: p.user_id,
      display_name: p.display_name || 'ユーザー',
      avatar_image_url: p.avatar_image_url
    }])
  )

  console.log('Feed API: Step 3 - データ取得開始（userIds:', userIds.length, '）')

  // 並列でworksとinputsを取得（タイムアウト設定を延長）
  const worksPromise = supabase
    .from('works')
    .select('id, user_id, title, description, external_url, tags, roles, banner_image_url, created_at')
    .in('user_id', userIds)
    .order('created_at', { ascending: false })
    .limit(20) // 制限を増加

  const inputsPromise = supabase
    .from('inputs')
    .select('id, user_id, title, author_creator, rating, tags, cover_image_url, created_at')
    .in('user_id', userIds)
    .order('created_at', { ascending: false })
    .limit(20) // 制限を増加

  const dataTimeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('データ取得タイムアウト')), 10000) // タイムアウトを延長
  })

  try {
    const [worksResult, inputsResult] = await Promise.all([
      Promise.race([worksPromise, dataTimeout]),
      Promise.race([inputsPromise, dataTimeout])
    ]) as any

    const works = worksResult.data || []
    const inputs = inputsResult.data || []

    console.log('Feed API: Step 4 - データ取得結果:', {
      works: works.length,
      inputs: inputs.length
    })

    // **最適化**: 統計情報をバッチ処理で取得
    const allItemIds = [
      ...works.map((w: Work) => ({ id: w.id, type: 'work' })),
      ...inputs.map((i: Input) => ({ id: i.id, type: 'input' }))
    ]

    const itemIds = allItemIds.map(item => item.id)
    
    let likesMap = new Map<string, number>()
    let commentsMap = new Map<string, number>()
    let userLikesSet = new Set<string>()

    if (itemIds.length > 0) {
      console.log('Feed API: Step 5 - 統計情報取得開始')

      // いいね数をバッチ取得
      const { data: likesData } = await supabase
        .from('likes')
        .select('target_id, target_type')
        .in('target_id', itemIds)
        .in('target_type', ['work', 'input'])

      // いいね数を集計
      if (likesData) {
        for (const like of likesData) {
          const key = `${like.target_type}-${like.target_id}`
          likesMap.set(key, (likesMap.get(key) || 0) + 1)
        }
      }

      // コメント数をバッチ取得
      const { data: commentsData } = await supabase
        .from('comments')
        .select('target_id, target_type')
        .in('target_id', itemIds)
        .in('target_type', ['work', 'input'])

      // コメント数を集計
      if (commentsData) {
        for (const comment of commentsData) {
          const key = `${comment.target_type}-${comment.target_id}`
          commentsMap.set(key, (commentsMap.get(key) || 0) + 1)
        }
      }

      // ユーザーのいいね状態をバッチ取得（ログイン時のみ）
      if (currentUserId) {
        const { data: userLikesData } = await supabase
          .from('likes')
          .select('target_id, target_type')
          .eq('user_id', currentUserId)
          .in('target_id', itemIds)
          .in('target_type', ['work', 'input'])

        if (userLikesData) {
          for (const like of userLikesData) {
            userLikesSet.add(`${like.target_type}-${like.target_id}`)
          }
        }
      }

      console.log('Feed API: Step 6 - 統計情報取得完了:', {
        likes: likesMap.size,
        comments: commentsMap.size,
        userLikes: userLikesSet.size
      })
    }

    // フィードアイテムを統合（最適化済み）
    const feedItems: FeedItem[] = []

    // 作品を処理
    for (const work of works) {
      const userProfile = profileMap.get(work.user_id)
      if (userProfile) {
        const likesKey = `work-${work.id}`
        const commentsKey = `work-${work.id}`
        
        feedItems.push({
          id: work.id,
          type: 'work' as const,
          title: work.title,
          description: work.description,
          external_url: work.external_url,
          tags: work.tags,
          roles: work.roles,
          banner_image_url: work.banner_image_url,
          created_at: work.created_at,
          user: userProfile,
          likes_count: likesMap.get(likesKey) || 0,
          comments_count: commentsMap.get(commentsKey) || 0,
          user_has_liked: userLikesSet.has(likesKey)
        })
      }
    }

    // インプットを処理
    for (const input of inputs) {
      const userProfile = profileMap.get(input.user_id)
      if (userProfile) {
        const likesKey = `input-${input.id}`
        const commentsKey = `input-${input.id}`
        
        feedItems.push({
          id: input.id,
          type: 'input' as const,
          title: input.title,
          author_creator: input.author_creator,
          rating: input.rating,
          tags: input.tags,
          cover_image_url: input.cover_image_url,
          created_at: input.created_at,
          user: userProfile,
          likes_count: likesMap.get(likesKey) || 0,
          comments_count: commentsMap.get(commentsKey) || 0,
          user_has_liked: userLikesSet.has(likesKey)
        })
      }
    }

    // 作成日時でソート
    feedItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const stats = {
      total: feedItems.length,
      works: feedItems.filter(item => item.type === 'work').length,
      inputs: feedItems.filter(item => item.type === 'input').length,
      unique_users: new Set(feedItems.map(item => item.user.id)).size
    }

    const processingTime = Date.now() - startTime

    console.log('=== Feed API: フィードデータ取得成功 ===', {
      total: feedItems.length,
      stats,
      processingTime: `${processingTime}ms`
    })

    return NextResponse.json({
      items: feedItems,
      stats,
      total: feedItems.length,
      debug: { 
        message: 'フィード取得成功', 
        currentUserId: currentUserId ? 'あり' : 'なし',
        profilesCount: activeProfiles.length,
        worksCount: works.length,
        inputsCount: inputs.length,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      }
    })

  } catch (dataError) {
    console.error('Feed API: データ取得エラー:', dataError)
    
    // データ取得エラー時は空の配列を返却
    return NextResponse.json({
      items: [],
      stats: { total: 0, works: 0, inputs: 0, unique_users: 0 },
      total: 0,
      debug: { 
        message: 'データ取得エラー', 
        error: true,
        errorMessage: dataError instanceof Error ? dataError.message : String(dataError),
        timestamp: new Date().toISOString()
      }
    })
  }
}

