import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// introductionフィールドのテスト用エンドポイント
export async function GET() {
  try {
    // profilesテーブルの構造を確認
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, bio, introduction')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        message: 'introductionフィールドがまだ追加されていません。マイグレーションを実行してください。'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'introductionフィールドが正常に追加されています',
      sample_data: data
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'データベース接続エラーまたはフィールドが存在しません'
    })
  }
}

// introductionフィールドの更新テスト
export async function POST(request: NextRequest) {
  try {
    const { userId, introduction } = await request.json()

    if (!userId || !introduction) {
      return NextResponse.json({
        success: false,
        error: 'userIdとintroductionが必要です'
      }, { status: 400 })
    }

    // 認証ヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: '認証が必要です'
      }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user || user.id !== userId) {
      return NextResponse.json({
        success: false,
        error: '認証に失敗しました'
      }, { status: 401 })
    }

    // introductionフィールドの更新テスト
    const { data, error } = await supabase
      .from('profiles')
      .update({ introduction: introduction })
      .eq('user_id', userId)
      .select('id, display_name, bio, introduction')
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        message: 'introduction フィールドの更新に失敗しました'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'introduction フィールドが正常に更新されました',
      updated_profile: data
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 