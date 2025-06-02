import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { DatabaseClient } from '@/lib/database'

// インプット分析取得 (GET)
export async function GET(request: NextRequest) {
  try {
    console.log('インプット分析APIが呼び出されました')
    
    // 認証ヘッダーからユーザー情報を取得
    const authHeader = request.headers.get('authorization')
    console.log('Authorization ヘッダー:', !!authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('認証ヘッダーがありません')
      return NextResponse.json(
        { error: '認証が必要です' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const token = authHeader.split(' ')[1]
    console.log('認証トークンを確認中...')
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser(token)
      
      if (userError || !user) {
        console.log('認証エラー:', userError)
        return NextResponse.json(
          { error: '認証に失敗しました' },
          { 
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }

      const userId = user.id
      console.log('認証成功、ユーザーID:', userId)

      // DatabaseClientを使用してインプット分析を実行
      console.log('DatabaseClientでインプット分析を実行中...')
      const analysis = await DatabaseClient.analyzeInputs(userId, token)

      console.log('インプット分析完了:', analysis.totalInputs, '件のデータを分析')

      return NextResponse.json({ 
        analysis,
        message: 'インプット分析が完了しました'
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

    } catch (authError) {
      console.log('認証処理エラー:', authError)
      return NextResponse.json(
        { error: '認証処理でエラーが発生しました' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

  } catch (error) {
    console.error('インプット分析エラー:', error)
    return NextResponse.json(
      { error: 'インプット分析に失敗しました' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
} 