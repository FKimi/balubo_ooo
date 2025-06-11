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
      const { data: { user }, error: userError } = await supabase.auth.getUser(token)
      
      if (userError || !user) {
        return NextResponse.json(
          { error: '認証に失敗しました' },
          { status: 401 }
        )
      }

      // 軽量化：基本的なプロフィール情報のみ取得
      const profile = await DatabaseClient.getProfile(user.id)

      return NextResponse.json({ profile: profile || null })

    } catch (authError) {
      console.log('認証処理エラー:', authError)
      return NextResponse.json(
        { error: '認証処理でエラーが発生しました' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('プロフィール取得エラー:', error)
    // エラー時は空のプロフィールを返却（アプリを壊さない）
    return NextResponse.json({ profile: null })
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