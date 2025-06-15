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

// 会話一覧取得
export async function GET(request: NextRequest) {
  try {
    console.log('会話一覧取得API開始')
    console.log('環境変数確認:', {
      supabaseUrl: supabaseUrl ? '設定済み' : '未設定',
      supabaseAnonKey: supabaseAnonKey ? '設定済み' : '未設定'
    })

    // 認証確認
    const authHeader = request.headers.get('authorization')
    console.log('認証ヘッダー:', authHeader ? 'あり' : 'なし')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('認証ヘッダーが無効')
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    console.log('トークン長:', token?.length || 0)
    
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

    // 会話一覧を取得
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        id,
        participant_1_id,
        participant_2_id,
        last_message_at,
        last_message_content,
        last_message_sender_id,
        created_at
      `)
      .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
      .order('last_message_at', { ascending: false })

    if (error) {
      console.error('会話一覧取得エラー:', error)
      return NextResponse.json({ error: '会話一覧の取得に失敗しました' }, { status: 500 })
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json([])
    }

    // 相手のユーザーIDを取得
    const otherUserIds = conversations.map(conv => 
      conv.participant_1_id === user.id ? conv.participant_2_id : conv.participant_1_id
    )

    // 相手のプロフィール情報を取得
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_image_url, professions')
      .in('user_id', otherUserIds)

    if (profileError) {
      console.error('プロフィール取得エラー:', profileError)
      return NextResponse.json({ error: 'プロフィール情報の取得に失敗しました' }, { status: 500 })
    }

    // データを整形
    const formattedConversations = conversations.map(conv => {
      const otherUserId = conv.participant_1_id === user.id ? conv.participant_2_id : conv.participant_1_id
      const otherProfile = profiles?.find(p => p.user_id === otherUserId)
      
      return {
        id: conv.id,
        otherParticipant: {
          id: otherUserId,
          display_name: otherProfile?.display_name || 'ユーザー',
          avatar_image_url: otherProfile?.avatar_image_url,
          professions: otherProfile?.professions || []
        },
        lastMessage: {
          content: conv.last_message_content,
          senderId: conv.last_message_sender_id,
          timestamp: conv.last_message_at,
          isFromMe: conv.last_message_sender_id === user.id
        },
        createdAt: conv.created_at
      }
    })

    return NextResponse.json(formattedConversations)

  } catch (error) {
    console.error('会話一覧取得エラー:', error)
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

// 新しい会話作成
export async function POST(request: NextRequest) {
  try {
    const { otherUserId } = await request.json()
    
    if (!otherUserId) {
      return NextResponse.json({ error: '相手のユーザーIDが必要です' }, { status: 400 })
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

    // 自分自身との会話は不可
    if (user.id === otherUserId) {
      return NextResponse.json({ error: '自分自身との会話はできません' }, { status: 400 })
    }

    // 既存の会話をチェック（双方向）
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${otherUserId}),and(participant_1_id.eq.${otherUserId},participant_2_id.eq.${user.id})`)
      .single()

    if (existingConversation) {
      return NextResponse.json({ 
        conversationId: existingConversation.id,
        message: '既存の会話が見つかりました'
      })
    }

    // 相手のプライバシー設定をチェック
    const { data: otherUserProfile } = await supabase
      .from('profiles')
      .select('privacy_settings')
      .eq('user_id', otherUserId)
      .single()

    if (otherUserProfile?.privacy_settings?.allowDirectMessages === false) {
      return NextResponse.json({ 
        error: 'このユーザーはダイレクトメッセージを受け取らない設定になっています' 
      }, { status: 403 })
    }

    // 新しい会話を作成（participant_1_idを常に小さいIDにして一意性を保つ）
    const participant1Id = user.id < otherUserId ? user.id : otherUserId
    const participant2Id = user.id < otherUserId ? otherUserId : user.id

    const { data: newConversation, error: insertError } = await supabase
      .from('conversations')
      .insert([
        {
          participant_1_id: participant1Id,
          participant_2_id: participant2Id
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('会話作成エラー:', insertError)
      return NextResponse.json({ error: '会話の作成に失敗しました' }, { status: 500 })
    }

    // 参加者レコードを作成
    const participantRecords = [
      {
        conversation_id: newConversation.id,
        user_id: user.id
      },
      {
        conversation_id: newConversation.id,
        user_id: otherUserId
      }
    ]

    const { error: participantError } = await supabase
      .from('message_participants')
      .insert(participantRecords)

    if (participantError) {
      console.error('参加者レコード作成エラー:', participantError)
      // 会話は作成されているので、エラーログのみ出力
    }

    return NextResponse.json({ 
      conversationId: newConversation.id,
      message: '新しい会話が作成されました'
    })

  } catch (error) {
    console.error('会話作成エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
} 