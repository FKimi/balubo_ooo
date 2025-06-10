import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 動的レンダリングを強制
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Profile {
  user_id: string
  display_name: string
  avatar_image_url?: string
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
  try {
    console.log('Feed API: フィードデータ取得開始')

    // Service roleクライアントを作成（RLS制限を回避）
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Feed API: 必要な環境変数が設定されていません')
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      )
    }
    
    // サービスロールキーを使用してRLS制限を回避
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('Feed API: Service roleクライアント作成完了')

    // 認証されたユーザーの取得（オプション）
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
        const { data: { user } } = await userSupabase.auth.getUser(token)
        if (user) {
          currentUserId = user.id
          console.log('Feed API: 認証ユーザー:', user.id)
        }
      } catch (authError) {
        console.log('Feed API: 認証処理エラー（続行）:', authError)
      }
    }

    // 全てのプロフィールを取得（RLS制限なし）
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_image_url, portfolio_visibility')
      .limit(200)

    console.log('Feed API: プロフィール取得結果:', {
      count: allProfiles?.length || 0,
      error: allProfilesError,
      sample: allProfiles?.slice(0, 3)
    })

    if (allProfilesError) {
      console.error('Feed API: プロフィール取得エラー:', allProfilesError)
      return NextResponse.json(
        { error: 'プロフィールデータの取得に失敗しました' },
        { status: 500 }
      )
    }

    if (!allProfiles || allProfiles.length === 0) {
      console.log('Feed API: プロフィールがありません')
      return NextResponse.json({ 
        items: [],
        stats: {
          total: 0,
          works: 0,
          inputs: 0,
          unique_users: 0
        },
        total: 0,
        debug: {
          message: 'プロフィールが見つかりません',
          allProfilesCount: 0,
          currentUser: currentUserId || 'anonymous',
          includeOwnPosts: true
        }
      })
    }

    // 全てのプロフィールを対象（Xのホーム画面のように自分の投稿も含む）
    const profiles = allProfiles

    const userIds = profiles.map((profile: Profile) => profile.user_id)
    const profileMap = new Map(
      profiles.map((profile: Profile) => [
        profile.user_id, 
        {
          id: profile.user_id,
          display_name: profile.display_name || 'ユーザー',
          avatar_image_url: profile.avatar_image_url
        }
      ])
    )

    console.log('Feed API: フィード対象ユーザー数:', userIds.length, '（自分の投稿も含む）')

    // 作品データを取得（いいね・コメント情報含む）
    const { data: works, error: worksError } = await supabase
      .from('works')
      .select(`
        id,
        user_id,
        title,
        description,
        external_url,
        tags,
        roles,
        banner_image_url,
        created_at
      `)
      .in('user_id', userIds)
      .order('created_at', { ascending: false })
      .limit(100)

    console.log('Feed API: 作品データ取得結果:', {
      count: works?.length || 0,
      error: worksError,
      sample: works?.slice(0, 2)
    })

    // インプットデータを取得（RLS制限なし）
    const { data: inputs, error: inputsError } = await supabase
      .from('inputs')
      .select(`
        id,
        user_id,
        title,
        author_creator,
        rating,
        tags,
        cover_image_url,
        created_at
      `)
      .in('user_id', userIds)
      .order('created_at', { ascending: false })
      .limit(100)

    console.log('Feed API: インプットデータ取得結果:', {
      count: inputs?.length || 0,
      error: inputsError,
      sample: inputs?.slice(0, 2)
    })

    // いいね数とコメント数を取得
    const allItemIds = [
      ...(works || []).map((w: Work) => w.id),
      ...(inputs || []).map((i: Input) => i.id)
    ]

    // 各作品・インプットのいいね数を一括取得
    const { data: likeCounts } = await supabase
      .from('likes')
      .select('target_id')
      .eq('target_type', 'work')
      .in('target_id', allItemIds)

    // 各作品・インプットのコメント数を一括取得
    const { data: commentCounts } = await supabase
      .from('comments')
      .select('target_id')
      .eq('target_type', 'work')
      .in('target_id', allItemIds)

    // 現在のユーザーのいいね状態を取得（ログイン時のみ）
    let userLikes: any[] = []
    if (currentUserId && allItemIds.length > 0) {
      const { data } = await supabase
        .from('likes')
        .select('target_id')
        .eq('user_id', currentUserId)
        .eq('target_type', 'work')
        .in('target_id', allItemIds)
      userLikes = data || []
    }

    // いいね・コメント数のマップを作成
    const likeCountMap = new Map()
    const commentCountMap = new Map()
    const userLikeMap = new Set(userLikes.map(like => like.target_id))

    // カウントを集計
    if (likeCounts) {
      likeCounts.forEach((like: any) => {
        likeCountMap.set(like.target_id, (likeCountMap.get(like.target_id) || 0) + 1)
      })
    }

    if (commentCounts) {
      commentCounts.forEach((comment: any) => {
        commentCountMap.set(comment.target_id, (commentCountMap.get(comment.target_id) || 0) + 1)
      })
    }

    // データが取得できない場合のデモデータ生成
    if ((!works || works.length === 0) && (!inputs || inputs.length === 0)) {
      console.log('Feed API: 実データなし - デモデータを生成')
      
      const demoItems = [
        {
          id: 'demo-work-1',
          type: 'work' as const,
          title: '🎨 Webサイトデザインプロジェクト',
          description: 'モダンで使いやすいECサイトのデザインを制作しました。ユーザビリティを重視したクリーンなデザインが特徴です。',
          tags: ['Webデザイン', 'UI/UX', 'Figma'],
          roles: ['UIデザイナー', 'UXデザイナー'],
          banner_image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'demo-user-1',
            display_name: '田中デザイナー',
            avatar_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
          },
          likes_count: 12,
          comments_count: 3,
          user_has_liked: false
        },
        {
          id: 'demo-input-1',
          type: 'input' as const,
          title: '📚 デザイン思考の教科書',
          description: 'ユーザー中心のデザインプロセスについて詳しく学べる一冊。実践的な内容で非常に参考になりました。',
          author_creator: 'Tim Brown',
          rating: 5,
          tags: ['デザイン思考', 'UX', '読書'],
          cover_image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'demo-user-2',
            display_name: '佐藤読書家',
            avatar_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80'
          },
          likes_count: 8,
          comments_count: 2,
          user_has_liked: true
        },
        {
          id: 'demo-work-2',
          type: 'work' as const,
          title: '📱 モバイルアプリ開発',
          description: 'React Nativeを使用したクロスプラットフォームアプリの開発を行いました。パフォーマンスとUXの両立を重視。',
          tags: ['React Native', 'モバイル開発', 'JavaScript'],
          roles: ['フロントエンド開発者'],
          banner_image_url: 'https://images.unsplash.com/photo-1512941937669-0a1dd7228f2d?w=800&q=80',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'demo-user-3',
            display_name: '山田エンジニア',
            avatar_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
          },
          likes_count: 15,
          comments_count: 5,
          user_has_liked: false
        },
        {
          id: 'demo-input-2',
          type: 'input' as const,
          title: '🎬 映画「ブレードランナー 2049」',
          description: '視覚的に圧倒される傑作SF映画。デザインとストーリーテリングの素晴らしい融合。',
          author_creator: 'ドゥニ・ヴィルヌーヴ',
          rating: 4,
          tags: ['映画', 'SF', 'ビジュアル'],
          cover_image_url: 'https://images.unsplash.com/photo-1489599578195-e7fa53d1fa96?w=400&q=80',
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'demo-user-4',
            display_name: '鈴木映画愛好家',
            avatar_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
          },
          likes_count: 6,
          comments_count: 1,
          user_has_liked: false
        },
        {
          id: 'demo-work-3',
          type: 'work' as const,
          title: '🏢 スタートアップのブランディング',
          description: 'テック系スタートアップのブランドアイデンティティを一から構築。ロゴからガイドラインまで包括的にデザイン。',
          tags: ['ブランディング', 'ロゴデザイン', 'グラフィック'],
          roles: ['ブランドデザイナー', 'グラフィックデザイナー'],
          banner_image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'demo-user-5',
            display_name: '高橋ブランダー',
            avatar_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'
          },
          likes_count: 20,
          comments_count: 7,
          user_has_liked: true
        }
      ]

      const stats = {
        total: demoItems.length,
        works: demoItems.filter(item => item.type === 'work').length,
        inputs: demoItems.filter(item => item.type === 'input').length,
        unique_users: new Set(demoItems.map(item => item.user.id)).size
      }

      return NextResponse.json({ 
        items: demoItems,
        stats,
        total: demoItems.length,
        debug: {
          message: 'デモデータを使用（実データなし）',
          profilesCount: profiles.length,
          worksCount: 0,
          inputsCount: 0,
          currentUser: currentUserId || 'anonymous',
          includeOwnPosts: true,
          isDemoData: true
        }
      })
    }

    console.log('Feed API: 最終データ統計:', {
      works: works?.length || 0,
      inputs: inputs?.length || 0,
      total: (works?.length || 0) + (inputs?.length || 0)
    })

    // フィードアイテムを統合してソート（いいね・コメント情報を含む）
    const feedItems = [
      ...(works || []).map((work: Work) => ({
        id: work.id,
        type: 'work' as const,
        title: work.title,
        description: work.description,
        external_url: work.external_url,
        tags: work.tags,
        roles: work.roles,
        banner_image_url: work.banner_image_url,
        created_at: work.created_at,
        user: profileMap.get(work.user_id)!,
        likes_count: likeCountMap.get(work.id) || 0,
        comments_count: commentCountMap.get(work.id) || 0,
        user_has_liked: userLikeMap.has(work.id)
      })),
      ...(inputs || []).map((input: Input) => ({
        id: input.id,
        type: 'input' as const,
        title: input.title,
        author_creator: input.author_creator,
        rating: input.rating,
        tags: input.tags,
        cover_image_url: input.cover_image_url,
        created_at: input.created_at,
        user: profileMap.get(input.user_id)!,
        likes_count: likeCountMap.get(input.id) || 0,
        comments_count: commentCountMap.get(input.id) || 0,
        user_has_liked: userLikeMap.has(input.id)
      }))
    ].filter(item => item.user) // ユーザー情報がないアイテムを除外

    // 作成日時でソート（最新順）
    feedItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // 最大100件に制限
    const limitedFeedItems = feedItems.slice(0, 100)

    console.log('Feed API: フィード統合完了:', limitedFeedItems.length, '件')

    // 統計情報も追加
    const stats = {
      total: limitedFeedItems.length,
      works: limitedFeedItems.filter(item => item.type === 'work').length,
      inputs: limitedFeedItems.filter(item => item.type === 'input').length,
      unique_users: new Set(limitedFeedItems.map(item => item.user.id)).size
    }

    return NextResponse.json({ 
      items: limitedFeedItems,
      stats,
      total: limitedFeedItems.length,
      debug: {
        profilesCount: profiles.length,
        worksCount: works?.length || 0,
        inputsCount: inputs?.length || 0,
        currentUser: currentUserId || 'anonymous',
        authMethod: currentUserId ? 'authenticated' : 'anonymous',
        includeOwnPosts: true,
        isDemoData: false
      }
    })

  } catch (error) {
    console.error('Feed API: 予期しないエラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
} 