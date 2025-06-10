import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

// 動的レンダリングを強制
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Service Role Keyでクライアント作成
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    
    // Authorization ヘッダーから認証ユーザーを取得（任意）
    let currentUserId: string | null = null
    const authHeader = request.headers.get('Authorization')
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1]
        if (token) {
          const decoded = jwt.decode(token) as any
          currentUserId = decoded?.sub
        }
      } catch (error) {
        console.log('トークン解析エラー（続行）:', error)
      }
    }

    // 公開プロフィール設定のユーザーから、最近アクティブなユーザーを取得
    let query = supabaseAdmin
      .from('profiles')
      .select(`
        user_id,
        display_name,
        bio,
        avatar_image_url,
        professions,
        created_at
      `)
      .eq('portfolio_visibility', 'public')
      .not('display_name', 'is', null)
      .not('display_name', 'eq', '')

    // 現在のユーザーは除外
    if (currentUserId) {
      query = query.neq('user_id', currentUserId)
    }

    const { data: profiles, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit * 3) // 多めに取得してランダムに選択

    if (error) {
      console.error('プロフィール取得エラー:', error)
      return NextResponse.json({ error: 'おすすめユーザーの取得に失敗しました' }, { status: 500 })
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ users: [] })
    }

    let followedUserIds: string[] = []
    
    // 現在のユーザーがフォロー中のユーザーIDを取得
    if (currentUserId) {
      const { data: follows } = await supabaseAdmin
        .from('follows')
        .select('following_id')
        .eq('follower_id', currentUserId)

      if (follows) {
        followedUserIds = follows.map(follow => follow.following_id)
      }
    }

    // フィルタリング: display_nameが有効で、フォロー済みでないユーザーのみ
    const validProfiles = profiles.filter(profile => 
      profile.display_name && 
      profile.display_name.trim() !== '' && 
      profile.display_name !== 'ユーザー' &&
      !followedUserIds.includes(profile.user_id)
    )

    // ランダムにシャッフルして制限数まで返す
    const shuffled = validProfiles.sort(() => Math.random() - 0.5)
    const recommended = shuffled.slice(0, limit)

    // レスポンス用のデータ形式に変換
    const users = recommended.map(profile => ({
      id: profile.user_id,
      display_name: profile.display_name,
      bio: profile.bio || '',
      avatar_image_url: profile.avatar_image_url,
      professions: profile.professions || []
    }))

    return NextResponse.json({ users })

  } catch (error) {
    console.error('おすすめユーザー取得エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
} 