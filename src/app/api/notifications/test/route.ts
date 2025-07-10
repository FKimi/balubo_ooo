import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { createNotification } from '@/lib/notificationUtils'

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

// テスト用通知を作成
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
    
    // テスト用通知を作成
    const notificationId = await createNotification({
      userId,
      type: 'work_featured',
      message: 'あなたの作品が特集に選ばれました！🎉',
      relatedEntityId: '',
      relatedEntityType: 'work'
    })

    if (!notificationId) {
      return NextResponse.json({ error: 'テスト通知の作成に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      notificationId,
      message: 'テスト通知を作成しました'
    })

  } catch (error) {
    console.error('テスト通知作成エラー:', error)
    return NextResponse.json({ 
      error: 'サーバーエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}