import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// PUT: 代表作情報を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { is_featured, featured_order } = body

    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    // Supabaseクライアントを作成（認証トークン付き）
    const token = authHeader.replace('Bearer ', '')
    const supabaseWithAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    // 代表作情報を更新
    const { data: work, error } = await supabaseWithAuth
      .from('works')
      .update({
        is_featured: is_featured,
        featured_order: featured_order
      })
      .eq('id', id)
      .eq('user_id', user.id)  // ユーザーIDでフィルタリング
      .select()
      .single()

    if (error || !work) {
      console.error('代表作更新エラー:', error)
      return NextResponse.json(
        { 
          error: '代表作情報の更新に失敗しました',
          details: error?.message || 'Unknown error',
          code: error?.code
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      work,
      message: '代表作情報を更新しました'
    })

  } catch (error) {
    console.error('代表作更新処理エラー:', error)
    return NextResponse.json(
      { 
        error: '代表作情報の更新に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 