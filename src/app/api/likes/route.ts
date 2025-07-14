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
    console.log('いいねAPI POST: ユーザーID:', userId)
    const { workId, targetType } = await request.json()
    console.log('いいねAPI POST: 受信データ:', { workId, targetType })

    if (!workId) {
      console.log('いいねAPI POST: workIdが不足しています')
      return NextResponse.json({ error: 'workIdが必要です' }, { status: 400 })
    }

    // target_typeを決定（デフォルトは'work'）
    const finalTargetType = targetType || 'work'
    console.log('いいねAPI POST: 最終的なtargetType:', finalTargetType)

    // 既にいいねしているかチェック
    const { data: existingLike, error: existingLikeError } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', finalTargetType)
      .eq('target_id', workId)
      .single()

    if (existingLikeError && existingLikeError.code !== 'PGRST116') { // PGRST116はデータが見つからないエラー
      console.error('いいねAPI POST: 既存いいねチェックエラー:', existingLikeError)
      return NextResponse.json({ error: '既存のいいねチェックに失敗しました' }, { status: 500 })
    }

    if (existingLike) {
      console.log('いいねAPI POST: 既にいいね済みです')
      return NextResponse.json({ error: '既にいいねしています' }, { status: 409 })
    }

    console.log('いいね追加処理を開始:', { userId, workId, targetType: finalTargetType })

    // 作品/インプット情報を取得（通知用）
    let item = null;
    let itemError = null;
    if (finalTargetType === 'work') {
      const { data, error } = await supabase
        .from('works')
        .select('title, user_id')
        .eq('id', workId)
        .single();
      item = data;
      itemError = error;
    } else if (finalTargetType === 'input') {
      const { data, error } = await supabase
        .from('inputs')
        .select('title, user_id')
        .eq('id', workId)
        .single();
      item = data;
      itemError = error;
    }

    if (itemError) {
      console.error('いいねAPI POST: 作品/インプット情報取得エラー:', itemError)
      // エラーを返すが、いいね自体は続行可能かもしれないので、ここでは致命的としない
    }
    console.log('いいねAPI POST: 取得した作品/インプット情報:', item)


    // いいね追加
    const { data: newLike, error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        target_type: finalTargetType,
        target_id: workId
      })
      .select()
      .single();

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

    // 通知を作成（所有者が自分でない場合のみ）
    if (item && item.user_id !== userId) {
      try {
        // いいねしたユーザーのプロフィール情報を取得
        const { data: likerProfile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', userId)
          .single();

        const likerName = likerProfile?.display_name || 'ユーザー';
        
        // Service Roleを使用して通知を作成
        const { data: notificationData, error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: item.user_id,
            type: 'new_like',
            message: `${likerName}さんが「${item.title}」にいいねしました`,
            related_entity_id: workId,
            related_entity_type: 'work'
          })
          .select('id')
          .single();

        if (notificationError) {
          console.error('❌ 通知作成エラー:', notificationError);
        } else {
          console.log('✅ いいね通知が正常に作成されました:', notificationData.id);
        }
      } catch (notifyError) {
        console.error('❌ 通知作成エラー:', notifyError);
      }
    } else {
      console.log('通知作成をスキップ:', item ? '自分の投稿' : '対象が見つからない');
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