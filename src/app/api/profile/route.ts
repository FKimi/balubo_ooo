import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { DatabaseClient } from '@/lib/database'

// プロフィール取得 (GET)
export async function GET(request: NextRequest) {
  try {
    console.log('プロフィール取得APIが呼び出されました')
    
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

      // DatabaseClientを使用してプロフィールデータを取得
      console.log('DatabaseClientでプロフィールを取得中...')
      const profile = await DatabaseClient.getProfile(userId)

      console.log('プロフィール取得結果:', !!profile)

      return NextResponse.json({ profile: profile || null }, {
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
    console.error('プロフィール取得エラー:', error)
    return NextResponse.json(
      { error: 'プロフィールデータの取得に失敗しました' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// プロフィール保存・更新 (POST)
export async function POST(request: NextRequest) {
  try {
    console.log('プロフィール保存APIが呼び出されました')
    
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
      const profileData = await request.json()
      console.log('受信したプロフィールデータ:', Object.keys(profileData))

      // DatabaseClientを使用してプロフィールデータを保存
      console.log('DatabaseClientでプロフィールを保存中...')
      const result = await DatabaseClient.saveProfile(userId, profileData, token)

      console.log('プロフィール保存成功')
      return NextResponse.json({
        success: true,
        profile: result,
        message: 'プロフィールを保存しました'
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

    } catch (authError) {
      console.log('認証処理エラー:', authError)
      
      // RLSエラーかどうかを判定
      if ((authError as any)?.code === '42501') {
        console.error('RLSポリシー違反:', authError)
        return NextResponse.json({
          error: 'データベース権限エラーが発生しました',
          details: 'プロフィールテーブルのRLSポリシー設定に問題があります',
          debugInfo: {
            errorCode: (authError as any)?.code,
            table: 'profiles',
            hasToken: !!token,
            suggestion: 'Supabaseダッシュボードでprofilesテーブルのポリシー設定を確認してください'
          },
          originalError: (authError as any)?.message
        }, { 
          status: 403,  // RLSエラーは403 Forbiddenが適切
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
      
      return NextResponse.json(
        { 
          error: '認証処理でエラーが発生しました',
          details: (authError as any)?.message || 'Unknown error'
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
    console.error('プロフィール保存エラー:', error)
    
    // RLSエラーかどうかを判定
    if ((error as any)?.code === '42501') {
      console.error('RLSポリシー違反:', error)
      return NextResponse.json({
        error: 'データベース権限エラーが発生しました',
        details: 'プロフィールテーブルのRLSポリシー設定に問題があります',
        debugInfo: {
          errorCode: (error as any)?.code,
          table: 'profiles',
          suggestion: 'Supabaseダッシュボードでprofilesテーブルのポリシー設定を確認してください'
        },
        originalError: (error as any)?.message
      }, { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    return NextResponse.json(
      { 
        error: `プロフィールの保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        details: (error as any)?.debugInfo || null
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