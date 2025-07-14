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

// コメント投稿
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'トークンが必要です' }, { status: 401 })
    }
    const decoded = jwt.decode(token) as any
    if (!decoded?.sub) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    const userId = decoded.sub
    const { workId, content, targetType } = await request.json()

    if (!workId || !content?.trim()) {
      return NextResponse.json({ error: 'workIdとcontentが必要です' }, { status: 400 })
    }

    // target_typeを決定（デフォルトは'work'）
    const finalTargetType = targetType || 'work'

    // 作品情報を取得（通知用）
    const { data: work } = await supabase
      .from('works')
      .select('title, user_id')
      .eq('id', workId)
      .single()

    // コメント追加
    const { data: newComment, error } = await supabase
      .from('comments')
      .insert({
        user_id: userId,
        target_type: finalTargetType,
        target_id: workId,
        content: content.trim()
      })
      .select()
      .single()

    if (error) {
      console.error('コメント投稿エラー:', error)
      return NextResponse.json({ error: 'コメントの投稿に失敗しました' }, { status: 500 })
    }

    // 通知を作成（作品の所有者が自分でない場合のみ）
    console.log('コメント通知作成判定:', { 
      hasWork: !!work, 
      workUserId: work?.user_id, 
      currentUserId: userId, 
      shouldCreateNotification: work && work.user_id !== userId 
    })
    
    if (work && work.user_id !== userId) {
      try {
        // コメントしたユーザーのプロフィール情報を取得
        const { data: commenterProfile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', userId)
          .single()

        const commenterName = commenterProfile?.display_name || 'ユーザー'
        console.log('コメント通知作成直前', { userId, workOwnerId: work.user_id, workId, commenterName, workTitle: work.title })
        
        // Service Roleを使用して通知を作成
        const { data: notificationData, error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: work.user_id,
            type: 'new_comment',
            message: `${commenterName}さんが「${work.title}」にコメントしました`,
            related_entity_id: workId,
            related_entity_type: 'work'
          })
          .select('id')
          .single()

        if (notificationError) {
          console.error('❌ コメント通知作成エラー:', notificationError)
        } else {
          console.log('✅ コメント通知が正常に作成されました:', notificationData.id)
        }
      } catch (notifyError) {
        console.error('❌ コメント通知作成エラー:', notifyError)
      }
    } else {
      console.log('コメント通知作成をスキップ:', work ? '自分の作品' : '作品が見つからない')
    }

    // ユーザー情報を別途取得（profilesテーブルから）
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_image_url')
      .eq('user_id', userId)
      .single()

    // コメントにユーザー情報を追加
    const commentWithUser = {
      ...newComment,
      user: userProfile || {
        id: userId,
        display_name: 'Unknown User',
        avatar_image_url: null
      }
    }

    return NextResponse.json({ comment: commentWithUser }, { status: 201 })
  } catch (error) {
    console.error('コメントAPI POST エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

// コメント一覧取得
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const workId = url.searchParams.get('workId')
    
    if (!workId) {
      return NextResponse.json({ error: 'workIdが必要です' }, { status: 400 })
    }

    // コメント一覧取得（新しい順）
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('target_type', 'work')
      .eq('target_id', workId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('コメント取得エラー:', error)
      return NextResponse.json({ error: 'コメントの取得に失敗しました' }, { status: 500 })
    }

    // 各コメントのユーザー情報を取得
    const commentsWithUsers = await Promise.all(
      (comments || []).map(async (comment) => {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_image_url')
          .eq('user_id', comment.user_id)
          .single()

        return {
          ...comment,
          user: userProfile || {
            id: comment.user_id,
            display_name: 'Unknown User',
            avatar_image_url: null
          }
        }
      })
    )

    // コメント数も取得
    const { count, error: countError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('target_type', 'work')
      .eq('target_id', workId)

    if (countError) {
      console.error('コメント数取得エラー:', countError)
      return NextResponse.json({ error: 'コメント数の取得に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({
      comments: commentsWithUsers || [],
      count: count || 0
    })
  } catch (error) {
    console.error('コメントAPI GET エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
} 