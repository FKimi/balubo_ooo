import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { DatabaseClient } from '@/lib/database'

// インプット一覧取得 (GET)
export async function GET(request: NextRequest) {
  try {
    console.log('インプット一覧取得APIが呼び出されました')
    
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

      // DatabaseClientを使用してインプットデータを取得
      console.log('DatabaseClientでインプットを取得中...')
      const inputs = await DatabaseClient.getInputs(userId, token)

      console.log('インプット取得結果:', inputs.length, '件')

      return NextResponse.json({ 
        inputs,
        total: inputs.length 
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
    console.error('インプット一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'インプットデータの取得に失敗しました' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// インプット保存 (POST)
export async function POST(request: NextRequest) {
  try {
    console.log('インプット保存APIが呼び出されました')
    
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

      // リクエストボディを取得
      const inputData = await request.json()
      console.log('受信したインプットデータ:', Object.keys(inputData))

      // DatabaseClientを使用してインプットデータを保存
      console.log('DatabaseClientでインプットを保存中...')
      const result = await DatabaseClient.saveInput(userId, inputData, token)

      console.log('インプット保存成功:', result.id)

      return NextResponse.json({
        success: true,
        input: result,
        message: 'インプットを保存しました'
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

    } catch (authError) {
      console.log('認証処理エラー:', authError)
      return NextResponse.json(
        { 
          error: '認証処理でエラーが発生しました',
          details: authError instanceof Error ? authError.message : 'Unknown error'
        },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

  } catch (error) {
    console.error('インプット保存エラー:', error)
    return NextResponse.json(
      { 
        error: `インプットの保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        details: error instanceof Error ? error.message : null
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
} 