import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PUT(
  request: NextRequest,
  context: any
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
    if (!token) {
      console.log('認証トークンが見つかりません')
      return NextResponse.json(
        { error: '認証トークンが無効です' },
        { status: 401 }
      )
    }
    
    const workId = context.params.id
    
    // 認証されたSupabaseクライアントを作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('Supabase環境変数が設定されていません')
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      )
    }
    
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