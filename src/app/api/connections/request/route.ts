import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

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

// つながり申請を送信
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

    const requesterId = decoded.sub
    const { requesteeId } = await request.json()

    if (!requesteeId) {
      return NextResponse.json({ error: 'requesteeIdが必要です' }, { status: 400 })
    }

    // 自分自身への申請は不可
    if (requesterId === requesteeId) {
      return NextResponse.json({ error: '自分自身に申請することはできません' }, { status: 400 })
    }

    // 既存の申請をチェック
    const { data: existingConnection } = await supabase
      .from('connections')
      .select('*')
      .or(`and(requester_id.eq.${requesterId},requestee_id.eq.${requesteeId}),and(requester_id.eq.${requesteeId},requestee_id.eq.${requesterId})`)
      .single()

    if (existingConnection) {
      if (existingConnection.status === 'pending') {
        return NextResponse.json({ 
          error: '既に申請中です',
          status: 'pending'
        }, { status: 400 })
      } else if (existingConnection.status === 'approved') {
        return NextResponse.json({ 
          error: '既につながっています',
          status: 'approved'
        }, { status: 400 })
      }
    }

    // 申請者のプロフィール情報を取得
    const { data: requesterProfile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', requesterId)
      .single()

    const requesterName = requesterProfile?.display_name || 'ユーザー'

    // 新しい申請を作成
    const { data: newConnection, error } = await supabase
      .from('connections')
      .insert({
        requester_id: requesterId,
        requestee_id: requesteeId,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('つながり申請作成エラー:', error)
      return NextResponse.json({ error: '申請の作成に失敗しました' }, { status: 500 })
    }

    // 通知を作成
    try {
      console.log('つながり申請通知作成直前', { requesterId, requesteeId, requesterName })
      
      // Service Roleを使用して通知を作成
      const { data: notificationData, error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: requesteeId,
          type: 'connection_request',
          message: `${requesterName}さんからつながり申請が届きました`,
          related_entity_id: requesterId,
          related_entity_type: 'user'
        })
        .select('id')
        .single()

      if (notificationError) {
        console.error('つながり申請通知作成エラー:', notificationError)
      } else {
        console.log('つながり申請通知作成成功:', notificationData.id)
      }
    } catch (notifyError) {
      console.error('つながり申請通知作成エラー:', notifyError)
    }

    return NextResponse.json({ 
      success: true, 
      connection: newConnection,
      message: 'つながり申請を送信しました'
    })

  } catch (error) {
    console.error('つながり申請エラー:', error)
    return NextResponse.json({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// つながり申請を承認/拒否
export async function PATCH(request: NextRequest) {
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

    const requesteeId = decoded.sub
    const { connectionId, action } = await request.json()

    if (!connectionId || !action) {
      return NextResponse.json({ error: 'connectionIdとactionが必要です' }, { status: 400 })
    }

    if (!['approve', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'actionはapproveまたはdeclineである必要があります' }, { status: 400 })
    }

    // 申請を取得
    const { data: connection, error: fetchError } = await supabase
      .from('connections')
      .select('*')
      .eq('id', connectionId)
      .eq('requestee_id', requesteeId)
      .eq('status', 'pending')
      .single()

    if (fetchError || !connection) {
      return NextResponse.json({ error: '有効な申請が見つかりません' }, { status: 404 })
    }

    const newStatus = action === 'approve' ? 'approved' : 'declined'

    // 申請を更新
    const { data: updatedConnection, error: updateError } = await supabase
      .from('connections')
      .update({ status: newStatus })
      .eq('id', connectionId)
      .select()
      .single()

    if (updateError) {
      console.error('つながり申請更新エラー:', updateError)
      return NextResponse.json({ error: '申請の更新に失敗しました' }, { status: 500 })
    }

    // 申請者のプロフィール情報を取得
    const { data: requesteeProfile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', requesteeId)
      .single()

    const requesteeName = requesteeProfile?.display_name || 'ユーザー'

    // 通知を作成
    try {
      if (action === 'approve') {
        console.log('つながり承認通知作成直前', { requesteeId, requesterId: connection.requester_id, requesteeName })
        
        // Service Roleを使用して通知を作成
        const { data: notificationData, error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: connection.requester_id,
            type: 'connection_approved',
            message: `${requesteeName}さんがあなたのつながり申請を承認しました`,
            related_entity_id: requesteeId,
            related_entity_type: 'user'
          })
          .select('id')
          .single()

        if (notificationError) {
          console.error('つながり承認通知作成エラー:', notificationError)
        } else {
          console.log('つながり承認通知作成成功:', notificationData.id)
        }
      } else {
        console.log('つながり拒否通知作成直前', { requesteeId, requesterId: connection.requester_id, requesteeName })
        
        // Service Roleを使用して通知を作成
        const { data: notificationData, error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: connection.requester_id,
            type: 'connection_declined',
            message: `${requesteeName}さんがあなたのつながり申請を拒否しました`,
            related_entity_id: requesteeId,
            related_entity_type: 'user'
          })
          .select('id')
          .single()

        if (notificationError) {
          console.error('つながり拒否通知作成エラー:', notificationError)
        } else {
          console.log('つながり拒否通知作成成功:', notificationData.id)
        }
      }
    } catch (notifyError) {
      console.error('つながり承認/拒否通知作成エラー:', notifyError)
    }

    return NextResponse.json({ 
      success: true, 
      connection: updatedConnection,
      message: action === 'approve' ? '申請を承認しました' : '申請を拒否しました'
    })

  } catch (error) {
    console.error('つながり申請処理エラー:', error)
    return NextResponse.json({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 