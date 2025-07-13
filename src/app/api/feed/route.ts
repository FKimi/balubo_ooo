import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 動的レンダリングを強制
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// レスポンスキャッシュを追加
export const revalidate = 60 // 60秒間キャッシュに延長

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
  
  // フィード用にService roleクライアントを作成（全ユーザーのパブリックデータにアクセス）
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
  // 認証されたユーザーの取得（簡素化）
  const authHeader = request.headers.get('authorization')
  let currentUserId = null
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const userSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await userSupabase.auth.getUser(token)
      if (user) {
        currentUserId = user.id
      }
    } catch (authError) {
      console.log('Feed API: 認証処理エラー（続行）:', authError)
    }
  }

  console.log('Feed API: Step 1 - 軽量データ取得開始')
  
  // 最新の作品とインプットを直接取得（軽量化）
  const worksPromise = supabase
    .from('works')
    .select('id, user_id, title, description, external_url, tags, roles, banner_image_url, created_at')
    .order('created_at', { ascending: false })
    .limit(50) // パフォーマンス重視でデータ量を制限

  const inputsPromise = supabase
    .from('inputs')
    .select('id, user_id, title, author_creator, rating, tags, cover_image_url, created_at')
    .order('created_at', { ascending: false })
    .limit(50) // パフォーマンス重視でデータ量を制限

  const dataTimeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('データ取得タイムアウト')), 15000) // 15秒に延長
  })

  try {
    const [worksResult, inputsResult] = await Promise.race([
      Promise.all([worksPromise, inputsPromise]),
      dataTimeout
    ]) as any

    const works = worksResult.data || []
    const inputs = inputsResult.data || []

    console.log('Feed API: Step 2 - データ取得結果:', {
      works: works.length,
      inputs: inputs.length
    })

    // ユーザーIDを収集
    const userIds = [...new Set([
      ...works.map((w: Work) => w.user_id),
      ...inputs.map((i: Input) => i.user_id)
    ])]

    // 作品・インプットIDリスト
    const workIds = works.map((w: Work) => w.id)
    const inputIds = inputs.map((i: Input) => i.id)
    const allIds = [...workIds, ...inputIds]

    // likes一括取得（全件取得＋JS集計）
    let likesCountMap = new Map<string, number>()
    let userLikesSet = new Set<string>()
    try {
      const { data: likesRaw } = await supabase
        .from('likes')
        .select('target_id, target_type, user_id')
        .in('target_id', allIds.length > 0 ? allIds : ['dummy'])
        .in('target_type', ['work', 'input'])
      ;(likesRaw || []).forEach((like: any) => {
        const key = `${like.target_type}_${like.target_id}`
        likesCountMap.set(key, (likesCountMap.get(key) || 0) + 1)
        if (currentUserId && like.user_id === currentUserId) {
          userLikesSet.add(key)
        }
      })
    } catch (e) {
      // 失敗してもfeedItemsは生成
      likesCountMap = new Map()
      userLikesSet = new Set()
    }

    // comments一括取得（全件取得＋JS集計）
    let commentsCountMap = new Map<string, number>()
    try {
      const { data: commentsRaw } = await supabase
        .from('comments')
        .select('target_id, target_type')
        .in('target_id', allIds.length > 0 ? allIds : ['dummy'])
        .in('target_type', ['work', 'input'])
      ;(commentsRaw || []).forEach((c: any) => {
        const key = `${c.target_type}_${c.target_id}`
        commentsCountMap.set(key, (commentsCountMap.get(key) || 0) + 1)
      })
    } catch (e) {
      commentsCountMap = new Map()
    }

    // プロフィール情報を一括取得（軽量化）
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .in('user_id', userIds)

    const profileMap = new Map<string, FeedUser>(
      (profiles || []).map((p: any) => [p.user_id, {
        id: p.user_id,
        display_name: p.display_name || 'ユーザー',
        avatar_image_url: '' // 空文字で初期化
      }])
    )

    // フィードアイテムを統合
    const feedItems: FeedItem[] = []

    // 作品を処理
    for (const work of works) {
      const userProfile = profileMap.get(work.user_id)
      if (userProfile) {
        const key = `work_${work.id}`
        feedItems.push({
          id: work.id,
          type: 'work' as const,
          title: work.title,
          description: work.description ? work.description.substring(0, 200) : undefined,
          external_url: work.external_url,
          tags: work.tags?.slice(0, 5) || [],
          roles: work.roles?.slice(0, 3) || [],
          banner_image_url: work.banner_image_url,
          created_at: work.created_at,
          user: userProfile,
          likes_count: likesCountMap.get(key) || 0,
          comments_count: commentsCountMap.get(key) || 0,
          user_has_liked: userLikesSet.has(key)
        })
      }
    }

    // インプットを処理
    for (const input of inputs) {
      const userProfile = profileMap.get(input.user_id)
      if (userProfile) {
        const key = `input_${input.id}`
        feedItems.push({
          id: input.id,
          type: 'input' as const,
          title: input.title,
          author_creator: input.author_creator,
          rating: input.rating,
          tags: input.tags?.slice(0, 3) || [],
          cover_image_url: input.cover_image_url,
          created_at: input.created_at,
          user: userProfile,
          likes_count: likesCountMap.get(key) || 0,
          comments_count: commentsCountMap.get(key) || 0,
          user_has_liked: userLikesSet.has(key)
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

    console.log('=== Feed API: 軽量フィードデータ取得成功 ===', {
      total: feedItems.length,
      stats,
      processingTime: `${processingTime}ms`
    })

    console.log('Feed API: works件数', works.length)
    console.log('Feed API: inputs件数', inputs.length)
    console.log('Feed API: likesCountMap', Array.from(likesCountMap.entries()))
    console.log('Feed API: commentsCountMap', Array.from(commentsCountMap.entries()))

    return NextResponse.json({
      items: feedItems,
      stats,
      total: feedItems.length,
      debug: { 
        message: '軽量フィード取得成功', 
        currentUserId: currentUserId ? 'あり' : 'なし',
        worksCount: works.length,
        inputsCount: inputs.length,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      }
    })

  } catch (dataError) {
    console.error('Feed API: 重大なエラー', dataError)
    return NextResponse.json({
      items: [],
      stats: { total: 0, works: 0, inputs: 0, unique_users: 0 },
      total: 0,
      debug: { 
        message: '重大なエラーが発生しました', 
        error: true,
        errorMessage: dataError instanceof Error ? dataError.message : String(dataError),
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

