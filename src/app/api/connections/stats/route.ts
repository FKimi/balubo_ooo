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
    const targetUserId = searchParams.get('userId')

    if (!targetUserId) {
      return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 })
    }

    // フォロワー数（他のユーザーから自分へのフォロー）
    const { count: followerCount, error: followerError } = await supabaseAdmin
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', targetUserId)

    if (followerError) {
      console.error('フォロワー数取得エラー:', followerError)
      return NextResponse.json({ error: 'フォロワー数の取得に失敗しました' }, { status: 500 })
    }

    // フォロー中数（自分から他のユーザーへのフォロー）
    const { count: followingCount, error: followingError } = await supabaseAdmin
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', targetUserId)

    if (followingError) {
      console.error('フォロー中数取得エラー:', followingError)
      return NextResponse.json({ error: 'フォロー中数の取得に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({
      followerCount: followerCount || 0,
      followingCount: followingCount || 0
    })

  } catch (error) {
    console.error('フォロー統計取得エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
} 