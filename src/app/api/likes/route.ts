import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

// 動的レンダリングを強制
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

// いいね追加
export async function POST(request: NextRequest) {
  try {
    console.log('いいねAPI POST: リクエスト開始')
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('いいねAPI POST: 認証ヘッダーなし')
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      console.log('いいねAPI POST: トークンが見つかりません')
      return NextResponse.json({ error: '認証トークンが無効です' }, { status: 401 })
    }
    
    const decoded = jwt.decode(token) as any
    console.log('いいねAPI POST: トークンデコード結果:', { 
      hasToken: !!token, 
      hasDecodedSub: !!decoded?.sub,
      decodedKeys: Object.keys(decoded || {})
    })
    
    if (!decoded?.sub) {
      console.log('いいねAPI POST: 無効なトークン')
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    const userId = decoded.sub
    const { workId, targetType } = await request.json()

    if (!workId) {
      return NextResponse.json({ error: 'workIdが必要です' }, { status: 400 })
    }

    // target_typeを決定（デフォルトは'work'）
    const finalTargetType = targetType || 'work'

    // 既にいいねしているかチェック
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', finalTargetType)
      .eq('target_id', workId)
      .single()

    if (existingLike) {
      return NextResponse.json({ error: '既にいいねしています' }, { status: 409 })
    }

    console.log('いいね追加処理:', { userId, workId, targetType: finalTargetType })

    // いいね追加
    const { data: newLike, error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        target_type: finalTargetType,
        target_id: workId
      })
      .select()
      .single()

    if (error) {
      console.error('いいね追加エラー:', {
        error,
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error.details,
        userId,
        workId
      })
      return NextResponse.json({ 
        error: 'いいねの追加に失敗しました',
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    return NextResponse.json({ like: newLike }, { status: 201 })
  } catch (error) {
    console.error('いいねAPI POST エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

// いいね削除
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: '認証トークンが無効です' }, { status: 401 })
    }
    
    const decoded = jwt.decode(token) as any
    if (!decoded?.sub) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    const userId = decoded.sub
    const url = new URL(request.url)
    const workId = url.searchParams.get('workId')

    if (!workId) {
      return NextResponse.json({ error: 'workIdが必要です' }, { status: 400 })
    }

    // いいね削除
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('target_type', 'work')
      .eq('target_id', workId)

    if (error) {
      console.error('いいね削除エラー:', error)
      return NextResponse.json({ error: 'いいねの削除に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ message: 'いいねを削除しました' })
  } catch (error) {
    console.error('いいねAPI DELETE エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

// いいね状態とカウント取得
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const workId = url.searchParams.get('workId')
    const authHeader = request.headers.get('authorization')
    
    if (!workId) {
      return NextResponse.json({ error: 'workIdが必要です' }, { status: 400 })
    }

    let userId = null
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      if (token) {
        const decoded = jwt.decode(token) as any
        userId = decoded?.sub
      }
    }

    // いいね数取得
    const { count, error: countError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('target_type', 'work')
      .eq('target_id', workId)

    if (countError) {
      console.error('いいね数取得エラー:', countError)
      return NextResponse.json({ error: 'いいね数の取得に失敗しました' }, { status: 500 })
    }

    // ユーザーのいいね状態取得（ログイン時のみ）
    let isLiked = false
    if (userId) {
      const { data: userLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('target_type', 'work')
        .eq('target_id', workId)
        .single()

      isLiked = !!userLike
    }

    return NextResponse.json({
      count: count || 0,
      isLiked
    })
  } catch (error) {
    console.error('いいねAPI GET エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
} 