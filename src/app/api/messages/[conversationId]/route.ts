import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 動的レンダリングを強制
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 環境変数を事前に取得・検証
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required')
}

// メッセージ一覧取得
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { conversationId } = context.params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // 認証確認
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const supabase = createClient(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        global: { headers: { 'Authorization': `Bearer ${token}` } }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 })
    }

    // 会話の参加権限をチェック
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('participant_1_id, participant_2_id')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      return NextResponse.json({ error: '会話が見つかりません' }, { status: 404 })
    }

    if (conversation.participant_1_id !== user.id && conversation.participant_2_id !== user.id) {
      return NextResponse.json({ error: 'この会話にアクセスする権限がありません' }, { status: 403 })
    }

    // メッセージ一覧を取得
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        message_type,
        is_read,
        read_at,
        created_at,
        sender_id
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('メッセージ取得エラー:', error)
      return NextResponse.json({ error: 'メッセージの取得に失敗しました' }, { status: 500 })
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        messages: [],
        pagination: {
          page,
          limit,
          hasMore: false
        }
      })
    }

    // 送信者のプロフィール情報を取得
    const senderIds = [...new Set(messages.map(msg => msg.sender_id))]
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_image_url')
      .in('user_id', senderIds)

    if (profileError) {
      console.error('プロフィール取得エラー:', profileError)
      return NextResponse.json({ error: 'プロフィール情報の取得に失敗しました' }, { status: 500 })
    }

    // データを整形
    const formattedMessages = messages.map(msg => {
      const senderProfile = profiles?.find(p => p.user_id === msg.sender_id)
      return {
        id: msg.id,
        content: msg.content,
        messageType: msg.message_type,
        isRead: msg.is_read,
        readAt: msg.read_at,
        createdAt: msg.created_at,
        isEdited: false, // 一時的にfalse
        editedAt: null,
        originalContent: null,
        sender: {
          id: msg.sender_id,
          display_name: senderProfile?.display_name || 'ユーザー',
          avatar_image_url: senderProfile?.avatar_image_url
        },
        isFromMe: msg.sender_id === user.id
      }
    }).reverse() // 古い順に並び替え

    // 未読メッセージを既読にマーク
    const unreadMessageIds = messages
      ?.filter(msg => !msg.is_read && msg.sender_id !== user.id)
      ?.map(msg => msg.id) || []

    if (unreadMessageIds.length > 0) {
      await supabase
        .from('messages')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .in('id', unreadMessageIds)
    }

    return NextResponse.json({
      messages: formattedMessages,
      pagination: {
        page,
        limit,
        hasMore: messages?.length === limit
      }
    })

  } catch (error) {
    console.error('メッセージ取得エラー:', error)
    console.error('エラーの詳細:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// メッセージ送信
export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    const { conversationId } = context.params
    const { content, messageType = 'text' } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'メッセージ内容が必要です' }, { status: 400 })
    }

    // 認証確認
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const supabase = createClient(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        global: { headers: { 'Authorization': `Bearer ${token}` } }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 })
    }

    // 会話の参加権限をチェック
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('participant_1_id, participant_2_id')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      return NextResponse.json({ error: '会話が見つかりません' }, { status: 404 })
    }

    if (conversation.participant_1_id !== user.id && conversation.participant_2_id !== user.id) {
      return NextResponse.json({ error: 'この会話にメッセージを送信する権限がありません' }, { status: 403 })
    }

    // メッセージを送信
    const { data: newMessage, error: insertError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          message_type: messageType
        }
      ])
      .select(`
        id,
        content,
        message_type,
        is_read,
        read_at,
        created_at,
        sender_id
      `)
      .single()

    if (insertError) {
      console.error('メッセージ送信エラー:', insertError)
      return NextResponse.json({ error: 'メッセージの送信に失敗しました' }, { status: 500 })
    }

    // 送信者のプロフィール情報を取得
    const { data: senderProfile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_image_url')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('プロフィール取得エラー:', profileError)
    }

    // 会話の最終メッセージ情報を更新
    await supabase
      .from('conversations')
      .update({
        last_message_at: newMessage.created_at,
        last_message_content: newMessage.content,
        last_message_sender_id: user.id
      })
      .eq('id', conversationId)

    // レスポンス用にデータを整形
    const formattedMessage = {
      id: newMessage.id,
      content: newMessage.content,
      messageType: newMessage.message_type,
      isRead: newMessage.is_read,
      readAt: newMessage.read_at,
      createdAt: newMessage.created_at,
      sender: {
        id: user.id,
        display_name: senderProfile?.display_name || 'ユーザー',
        avatar_image_url: senderProfile?.avatar_image_url
      },
      isFromMe: true
    }

    return NextResponse.json({
      message: formattedMessage,
      success: true
    })

  } catch (error) {
    console.error('メッセージ送信エラー:', error)
    console.error('エラーの詳細:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// メッセージ編集
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const { conversationId } = context.params
    const { messageId, content } = await request.json()

    if (!messageId || !content || content.trim().length === 0) {
      return NextResponse.json({ error: 'メッセージIDと内容が必要です' }, { status: 400 })
    }

    // 認証確認
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const supabase = createClient(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        global: { headers: { 'Authorization': `Bearer ${token}` } }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 })
    }

    // メッセージの存在確認と権限チェック
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('id, content, sender_id, conversation_id, is_deleted')
      .eq('id', messageId)
      .eq('conversation_id', conversationId)
      .single()

    if (messageError || !message) {
      return NextResponse.json({ error: 'メッセージが見つかりません' }, { status: 404 })
    }

    if (message.sender_id !== user.id) {
      return NextResponse.json({ error: 'このメッセージを編集する権限がありません' }, { status: 403 })
    }

    if (message.is_deleted) {
      return NextResponse.json({ error: '削除されたメッセージは編集できません' }, { status: 400 })
    }

    // 編集履歴を保存
    await supabase
      .from('message_edit_history')
      .insert([
        {
          message_id: messageId,
          previous_content: message.content
        }
      ])

    // メッセージを更新
    const { data: updatedMessage, error: updateError } = await supabase
      .from('messages')
      .update({
        content: content.trim(),
        is_edited: true,
        edited_at: new Date().toISOString(),
        original_content: message.content // 初回編集時のみ元の内容を保存
      })
      .eq('id', messageId)
      .select(`
        id,
        content,
        message_type,
        is_read,
        read_at,
        created_at,
        sender_id,
        is_edited,
        edited_at,
        original_content
      `)
      .single()

    if (updateError) {
      console.error('メッセージ更新エラー:', updateError)
      return NextResponse.json({ error: 'メッセージの更新に失敗しました' }, { status: 500 })
    }

    // 送信者のプロフィール情報を取得
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_image_url')
      .eq('user_id', user.id)
      .single()

    // レスポンス用にデータを整形
    const formattedMessage = {
      id: updatedMessage.id,
      content: updatedMessage.content,
      messageType: updatedMessage.message_type,
      isRead: updatedMessage.is_read,
      readAt: updatedMessage.read_at,
      createdAt: updatedMessage.created_at,
      isEdited: updatedMessage.is_edited,
      editedAt: updatedMessage.edited_at,
      originalContent: updatedMessage.original_content,
      sender: {
        id: user.id,
        display_name: senderProfile?.display_name || 'ユーザー',
        avatar_image_url: senderProfile?.avatar_image_url
      },
      isFromMe: true
    }

    return NextResponse.json({
      message: formattedMessage,
      success: true
    })

  } catch (error) {
    console.error('メッセージ編集エラー:', error)
    return NextResponse.json({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// メッセージ削除
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    const { conversationId } = context.params
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')

    if (!messageId) {
      return NextResponse.json({ error: 'メッセージIDが必要です' }, { status: 400 })
    }

    // 認証確認
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const supabase = createClient(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        global: { headers: { 'Authorization': `Bearer ${token}` } }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 })
    }

    // メッセージの存在確認と権限チェック
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('id, sender_id, conversation_id, is_deleted')
      .eq('id', messageId)
      .eq('conversation_id', conversationId)
      .single()

    if (messageError || !message) {
      return NextResponse.json({ error: 'メッセージが見つかりません' }, { status: 404 })
    }

    if (message.sender_id !== user.id) {
      return NextResponse.json({ error: 'このメッセージを削除する権限がありません' }, { status: 403 })
    }

    if (message.is_deleted) {
      return NextResponse.json({ error: 'このメッセージは既に削除されています' }, { status: 400 })
    }

    // メッセージを論理削除
    const { error: deleteError } = await supabase
      .from('messages')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', messageId)

    if (deleteError) {
      console.error('メッセージ削除エラー:', deleteError)
      return NextResponse.json({ error: 'メッセージの削除に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'メッセージが削除されました'
    })

  } catch (error) {
    console.error('メッセージ削除エラー:', error)
    return NextResponse.json({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 