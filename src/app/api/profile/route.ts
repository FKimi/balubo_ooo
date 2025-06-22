import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { DatabaseClient } from '@/lib/database'

// レスポンスキャッシュを追加
export const revalidate = 30 // 30秒間キャッシュ

// プロフィール取得 (GET)
export async function GET(request: NextRequest) {
  try {
    // 認証ヘッダーからユーザー情報を取得
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    try {
      // 認証にタイムアウトを設定
      const authPromise = supabase.auth.getUser(token)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('認証タイムアウト')), 8000) // 8秒でタイムアウト
      })
      
      const { data: { user }, error: userError } = await Promise.race([authPromise, timeoutPromise]) as any
      
      if (userError || !user) {
        return NextResponse.json(
          { error: '認証に失敗しました' },
          { status: 401 }
        )
      }

      // プロフィール取得にもタイムアウトを設定
      const profilePromise = DatabaseClient.getProfile(user.id, token)
      const profileTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('プロフィール取得タイムアウト')), 5000) // 5秒でタイムアウト
      })
      
      const profile = await Promise.race([profilePromise, profileTimeoutPromise])

      return NextResponse.json({ profile: profile || null })

    } catch (authError) {
      console.log('認証処理エラー:', authError)
      
      if (authError instanceof Error) {
        if (authError.message.includes('タイムアウト')) {
          console.log('認証またはプロフィール取得がタイムアウトしました')
          return NextResponse.json(
            { error: 'サーバーの応答に時間がかかっています', profile: null },
            { status: 408 } // Request Timeout
          )
        }
        
        if (authError.message.includes('Connect Timeout') || authError.message.includes('fetch failed')) {
          console.log('Supabase接続問題が発生しました')
          return NextResponse.json(
            { error: 'データベース接続エラーが発生しました', profile: null },
            { status: 503 } // Service Unavailable
          )
        }
      }
      
      return NextResponse.json(
        { error: '認証処理でエラーが発生しました', profile: null },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('プロフィール取得エラー:', error)
    
    // エラーの種類に応じてより適切なレスポンスを返す
    if (error instanceof Error) {
      if (error.message.includes('Connect Timeout') || error.message.includes('fetch failed')) {
        console.log('Supabase接続問題によるエラー')
        return NextResponse.json(
          { error: 'データベース接続エラー', profile: null },
          { status: 503 }
        )
      }
      
      if (error.message.includes('レート制限')) {
        console.log('レート制限によるエラー')
        return NextResponse.json(
          { error: 'アクセス頻度が高すぎます', profile: null },
          { status: 429 } // Too Many Requests
        )
      }
    }
    
    // その他のエラーは空のプロフィールを返却（アプリを壊さない）
    return NextResponse.json({ 
      error: 'プロフィール取得中にエラーが発生しました', 
      profile: null 
    }, { status: 500 })
  }
}

// プロフィール保存・更新 (POST)
export async function POST(request: NextRequest) {
  try {
    // 認証ヘッダーからユーザー情報を取得
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser(token)
      
      if (userError || !user) {
        return NextResponse.json(
          { error: '認証に失敗しました' },
          { status: 401 }
        )
      }

      // リクエストボディを取得
      const profileData = await request.json()

      // DatabaseClientを使用してプロフィールデータを保存
      const result = await DatabaseClient.saveProfile(user.id, profileData, token)

      return NextResponse.json({
        success: true,
        profile: result,
        message: 'プロフィールを保存しました'
      })

    } catch (authError) {
      // RLSエラーかどうかを判定
      if ((authError as any)?.code === '42501') {
        return NextResponse.json({
          error: 'データベース権限エラーが発生しました',
          details: 'プロフィールテーブルのRLSポリシー設定に問題があります'
        }, { status: 403 })
      }
      
      return NextResponse.json(
        { error: '認証処理でエラーが発生しました' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('プロフィール保存エラー:', error)
    
    // RLSエラーかどうかを判定
    if ((error as any)?.code === '42501') {
      return NextResponse.json({
        error: 'データベース権限エラーが発生しました'
      }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'プロフィールデータの保存に失敗しました' },
      { status: 500 }
    )
  }
}

// プロフィール部分更新 (PUT)
export async function PUT(request: NextRequest) {
  try {
    // 認証ヘッダーからユーザー情報を取得
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser(token)
      
      if (userError || !user) {
        return NextResponse.json(
          { error: '認証に失敗しました' },
          { status: 401 }
        )
      }

      // リクエストボディを取得
      const updateData = await request.json()
      console.log('PUT リクエストデータ:', updateData)

      // 現在のプロフィールデータを取得
      const currentProfile = await DatabaseClient.getProfile(user.id, token)
      
      // 部分更新用のデータを準備
      const updatedProfileData = {
        ...currentProfile,
        ...updateData,
        // userIdは更新対象から除外
        userId: undefined
      }

      // DatabaseClientを使用してプロフィールデータを更新
      const result = await DatabaseClient.saveProfile(user.id, updatedProfileData, token)

      return NextResponse.json({
        success: true,
        profile: result,
        message: 'プロフィールを更新しました'
      })

    } catch (authError) {
      console.error('PUT認証エラー:', authError)
      
      // RLSエラーかどうかを判定
      if ((authError as any)?.code === '42501') {
        return NextResponse.json({
          error: 'データベース権限エラーが発生しました',
          details: 'プロフィールテーブルのRLSポリシー設定に問題があります'
        }, { status: 403 })
      }
      
      return NextResponse.json(
        { error: '認証処理でエラーが発生しました' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('プロフィール更新エラー:', error)
    
    // RLSエラーかどうかを判定
    if ((error as any)?.code === '42501') {
      return NextResponse.json({
        error: 'データベース権限エラーが発生しました'
      }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'プロフィールデータの更新に失敗しました' },
      { status: 500 }
    )
  }
} 