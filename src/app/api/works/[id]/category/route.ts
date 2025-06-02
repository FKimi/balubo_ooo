import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('作品カテゴリ更新APIが呼び出されました')
    
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('認証ヘッダーがありません')
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const workId = params.id
    
    // 認証されたSupabaseクライアントを作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kdrnxnorxquxvxutkwnq.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkcm54bm9yeHF1eHZ4dXRrd25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxODU5MzEsImV4cCI6MjA2Mzc2MTkzMX0.tIwl9XnZ9D4gkQP8-8m2QZiVuMGP7E9M1dNJvkQHdZE'
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    })
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.log('認証エラー:', userError)
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      )
    }

    const { categories } = await request.json()

    // 作品のカテゴリを更新
    const { data: updatedWork, error: updateError } = await supabase
      .from('works')
      .update({ 
        categories: categories || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', workId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('カテゴリ更新エラー:', updateError)
      return NextResponse.json(
        { error: 'カテゴリの更新に失敗しました' },
        { status: 500 }
      )
    }

    console.log('カテゴリ更新成功:', workId, '→', categories)

    return NextResponse.json({
      work: updatedWork,
      message: 'カテゴリを更新しました'
    })

  } catch (error) {
    console.error('カテゴリ更新エラー:', error)
    return NextResponse.json(
      { error: 'カテゴリ更新に失敗しました' },
      { status: 500 }
    )
  }
} 