import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

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
    const type = searchParams.get('type') // 'following', 'followers'
    
    if (!type || !['following', 'followers'].includes(type)) {
      return NextResponse.json({ error: '無効なタイプです（following, followers）' }, { status: 400 })
    }

    // 認証確認
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'トークンが必要です' }, { status: 401 })
    }
    let currentUserId: string

    try {
      const decoded = jwt.decode(token) as any
      currentUserId = decoded?.sub
      if (!currentUserId) {
        return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
      }
    } catch (error) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    let query = supabaseAdmin
      .from('follows')
      .select(`
        id,
        follower_id,
        following_id,
        created_at,
        follower:profiles!follower_id(
          user_id,
          display_name,
          bio,
          professions,
          location,
          avatar_image_url
        ),
        following:profiles!following_id(
          user_id,
          display_name,
          bio,
          professions,
          location,
          avatar_image_url
        )
      `)

    switch (type) {
      case 'following':
        // 自分がフォローしているユーザー
        query = query.eq('follower_id', currentUserId)
        break
      case 'followers':
        // 自分をフォローしているユーザー
        query = query.eq('following_id', currentUserId)
        break
    }

    const { data: follows, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('フォロー一覧取得エラー:', error)
      return NextResponse.json({ error: 'フォロー一覧の取得に失敗しました' }, { status: 500 })
    }

    // レスポンス用のデータ形式に変換
    const formattedFollows = follows?.map(follow => {
      const isFollowing = type === 'following'
      const otherUser = isFollowing ? follow.following : follow.follower
      
      // otherUserが配列の場合は最初の要素を取得、オブジェクトの場合はそのまま使用
      const userProfile = Array.isArray(otherUser) ? otherUser[0] : otherUser
      
      return {
        id: follow.id,
        userId: userProfile?.user_id,
        displayName: userProfile?.display_name || 'Unknown User',
        bio: userProfile?.bio || '',
        professions: userProfile?.professions || [],
        location: userProfile?.location || '',
        avatarUrl: userProfile?.avatar_image_url,
        createdAt: follow.created_at,
        type: isFollowing ? 'following' : 'follower'
      }
    }) || []

    return NextResponse.json({ follows: formattedFollows })

  } catch (error) {
    console.error('フォロー一覧取得エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
} 