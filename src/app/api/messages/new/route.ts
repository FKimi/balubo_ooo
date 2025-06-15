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

// 新しい会話を作成
export async function POST(request: NextRequest) {
  try {
    const { participantId, initialMessage } = await request.json()

    if (!participantId) {
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

    // 自分自身との会話は作成できない
    if (user.id === participantId) {
      return NextResponse.json({ error: '自分自身との会話は作成できません' }, { status: 400 })
    }

    // 相手のユーザーが存在するかチェック
    const { data: participant, error: participantError } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .eq('user_id', participantId)
      .single()

    if (participantError || !participant) {
      return NextResponse.json({ error: '指定されたユーザーが見つかりません' }, { status: 404 })
    }

    // 既存の会話があるかチェック
    const { data: existingConversation, error: existingError } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${participantId}),and(participant_1_id.eq.${participantId},participant_2_id.eq.${user.id})`)
      .single()

    if (existingConversation) {
      // 既存の会話がある場合はそのIDを返す
      return NextResponse.json({
        conversationId: existingConversation.id,
        isNew: false,
        message: '既存の会話があります'
      })
    }

    // 新しい会話を作成
    const { data: newConversation, error: conversationError } = await supabase
      .from('conversations')
      .insert([
        {
          participant_1_id: user.id,
          participant_2_id: participantId,
          last_message_at: new Date().toISOString(),
          last_message_content: initialMessage || null,
          last_message_sender_id: initialMessage ? user.id : null
        }
      ])
      .select('id')
      .single()

    if (conversationError) {
      console.error('会話作成エラー:', conversationError)
      return NextResponse.json({ error: '会話の作成に失敗しました' }, { status: 500 })
    }

    // 初期メッセージがある場合は送信
    if (initialMessage && initialMessage.trim()) {
      const { error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: newConversation.id,
            sender_id: user.id,
            content: initialMessage.trim(),
            message_type: 'text'
          }
        ])

      if (messageError) {
        console.error('初期メッセージ送信エラー:', messageError)
        // 会話は作成されているので、エラーログのみ出力
      }
    }

    return NextResponse.json({
      conversationId: newConversation.id,
      isNew: true,
      message: '新しい会話が作成されました'
    })

  } catch (error) {
    console.error('新しい会話作成エラー:', error)
    return NextResponse.json({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// フォロー中のユーザー一覧を取得（新しいメッセージの相手選択用）
export async function GET(request: NextRequest) {
  try {
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

    // フォロー中のユーザーIDを取得（テーブルが存在しない場合は空配列を返す）
    const { data: following, error: followingError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id)

    if (followingError) {
      console.error('フォロー中ユーザー取得エラー:', followingError)
      console.error('エラーの詳細:', {
        message: followingError.message,
        details: followingError.details,
        hint: followingError.hint,
        code: followingError.code
      })
      
      // テーブルが存在しない場合は全ユーザーを返す（開発用）
      if (followingError.code === 'PGRST116' || followingError.message?.includes('does not exist')) {
        console.log('followsテーブルが存在しないため、全ユーザーを返します')
        
        // 全ユーザーのプロフィール情報を取得（自分以外）
        const { data: allProfiles, error: allProfilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_image_url, professions')
          .neq('user_id', user.id)
          .limit(50) // 最大50人まで

        if (allProfilesError) {
          console.error('全ユーザー取得エラー:', allProfilesError)
          return NextResponse.json([])
        }

        const allUsers = allProfiles?.map(profile => ({
          id: profile.user_id,
          display_name: profile.display_name,
          avatar_image_url: profile.avatar_image_url,
          professions: profile.professions || []
        })) || []

        return NextResponse.json(allUsers)
      }
      
      return NextResponse.json({ 
        error: 'フォロー中のユーザー取得に失敗しました',
        details: followingError.message 
      }, { status: 500 })
    }

    if (!following || following.length === 0) {
      return NextResponse.json([])
    }

    // フォロー中のユーザーのプロフィール情報を取得
    const followedUserIds = following.map(f => f.following_id)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_image_url, professions')
      .in('user_id', followedUserIds)

    if (profileError) {
      console.error('プロフィール取得エラー:', profileError)
      return NextResponse.json({ error: 'プロフィール情報の取得に失敗しました' }, { status: 500 })
    }

    // データを整形
    const users = profiles?.map(profile => ({
      id: profile.user_id,
      display_name: profile.display_name,
      avatar_image_url: profile.avatar_image_url,
      professions: profile.professions || []
    })) || []

    return NextResponse.json(users)

  } catch (error) {
    console.error('フォロー中ユーザー取得エラー:', error)
    return NextResponse.json({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 