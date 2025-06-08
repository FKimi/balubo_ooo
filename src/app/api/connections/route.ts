import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// フォロー作成
export async function POST(request: NextRequest) {
  try {
    const { targetUserId } = await request.json()
    
    // 認証確認
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { 'Authorization': `Bearer ${token}` } }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 })
    }

    // 自分自身へのフォローは不可
    if (user.id === targetUserId) {
      return NextResponse.json({ error: '自分自身をフォローすることはできません' }, { status: 400 })
    }

    // Service roleクライアントでfollowsテーブルにアクセス
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    )

    // 既存のフォロー関係をチェック
    const { data: existingFollow } = await serviceSupabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single()

    if (existingFollow) {
      return NextResponse.json({ 
        error: '既にフォローしています',
        isFollowing: true 
      }, { status: 400 })
    }

    // 新しいフォロー関係を作成
    const { data: newFollow, error: insertError } = await serviceSupabase
      .from('follows')
      .insert([
        {
          follower_id: user.id,
          following_id: targetUserId
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('フォロー作成エラー:', insertError)
      return NextResponse.json({ error: 'フォローに失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      follow: newFollow,
      message: 'フォローしました' 
    })

  } catch (error) {
    console.error('フォロー作成エラー:', error)
    return NextResponse.json({ error: 'フォローに失敗しました' }, { status: 500 })
  }
}

// フォロー状態の確認
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('targetUserId')
    
    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserIdが必要です' }, { status: 400 })
    }

    // 認証確認
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ isFollowing: false, canFollow: false })
    }

    const token = authHeader.split(' ')[1]
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { 'Authorization': `Bearer ${token}` } }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ isFollowing: false, canFollow: false })
    }

    // Service roleクライアントでフォロー状態をチェック
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    )

    const { data: follow } = await serviceSupabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single()

    if (!follow) {
      return NextResponse.json({ 
        isFollowing: false,
        canFollow: user.id !== targetUserId 
      })
    }
    
    return NextResponse.json({
      isFollowing: true,
      canFollow: false,
      followId: follow.id
    })

  } catch (error) {
    console.error('フォロー状態確認エラー:', error)
    return NextResponse.json({ error: 'フォロー状態の確認に失敗しました' }, { status: 500 })
  }
}

// フォロー関係の解除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const followId = searchParams.get('followId')
    
    if (!followId) {
      return NextResponse.json({ error: 'followIdが必要です' }, { status: 400 })
    }

    // 認証確認
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { 'Authorization': `Bearer ${token}` } }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 })
    }

    // Service roleクライアントで操作
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    )

    // 該当のフォロー関係を確認（自分がフォロワーであるもののみ削除可能）
    const { data: follow, error: fetchError } = await serviceSupabase
      .from('follows')
      .select('*')
      .eq('id', followId)
      .eq('follower_id', user.id)
      .single()

    if (fetchError || !follow) {
      return NextResponse.json({ error: '有効なフォロー関係が見つかりません' }, { status: 404 })
    }

    // フォロー関係を削除
    const { error: deleteError } = await serviceSupabase
      .from('follows')
      .delete()
      .eq('id', followId)

    if (deleteError) {
      console.error('フォロー削除エラー:', deleteError)
      return NextResponse.json({ error: 'フォロー解除に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'フォローを解除しました'
    })

  } catch (error) {
    console.error('フォロー解除エラー:', error)
    return NextResponse.json({ error: 'フォロー解除に失敗しました' }, { status: 500 })
  }
} 