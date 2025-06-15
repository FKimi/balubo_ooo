import { NextRequest, NextResponse } from 'next/server'
import { DatabaseClient } from '@/lib/database'
import { verifyFirebaseToken } from '@/lib/auth'

// 個別インプットの取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== インプット詳細取得API開始 ===')
    console.log('インプットID:', params.id)
    
    // 認証確認（オプション）
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null
    let token: string | null = null
    
    console.log('Authorization ヘッダー:', !!authHeader)
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        token = authHeader.substring(7)
        console.log('認証トークンを確認中...')
        const decodedToken = await verifyFirebaseToken(token)
        userId = decodedToken.uid
        console.log('認証成功、ユーザーID:', userId)
      } catch (authError) {
        console.log('認証エラー（続行）:', authError)
      }
    } else {
      console.log('認証なしでアクセス')
    }
    
    // インプット取得
    console.log('DatabaseClientでインプットを取得中...')
    const input = await DatabaseClient.getInputWithUser(params.id, userId, token)
    
    if (!input) {
      console.log('インプットが見つかりません:', params.id)
      return NextResponse.json(
        { error: 'インプットが見つかりません' },
        { status: 404 }
      )
    }
    
    console.log('インプット取得成功:', {
      id: input.id,
      title: input.title,
      user_id: input.user_id,
      hasUser: !!input.user
    })
    
    // 他のユーザーのプライベートインプットの場合はアクセス拒否
    // 注意: is_privateフィールドが実装されていない場合は、すべて公開として扱う
    /*
    if (input.user_id !== userId && input.is_private) {
      console.log('プライベートインプットへのアクセス拒否:', {
        inputUserId: input.user_id,
        currentUserId: userId,
        isPrivate: input.is_private
      })
      return NextResponse.json(
        { error: 'このインプットを閲覧する権限がありません' },
        { status: 403 }
      )
    }
    */
    
    console.log('=== インプット詳細取得API成功 ===')
    
    return NextResponse.json({
      success: true,
      input
    })
    
  } catch (error) {
    console.error('=== インプット詳細取得API エラー ===')
    console.error('エラー詳細:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      inputId: params.id
    })
    
    return NextResponse.json(
      { 
        error: 'インプットの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// インプットの更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('インプット更新APIが呼び出されました:', params.id)
    
    // 認証確認
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const decodedToken = await verifyFirebaseToken(token)
    const userId = decodedToken.uid
    console.log('認証成功、ユーザーID:', userId)
    
    // リクエストボディの取得
    const updateData = await request.json()
    console.log('受信した更新データ:', Object.keys(updateData))
    
    // データベース更新
    console.log('DatabaseClientでインプットを更新中...')
    const updatedInput = await DatabaseClient.updateInput(params.id, userId, updateData, token)
    
    console.log('インプット更新成功:', updatedInput.id)
    
    return NextResponse.json({
      success: true,
      input: updatedInput
    })
    
  } catch (error) {
    console.error('インプット更新エラー:', error)
    return NextResponse.json(
      { 
        error: 'インプットの更新に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// インプットの削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('インプット削除APIが呼び出されました:', params.id)
    
    // 認証確認
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const decodedToken = await verifyFirebaseToken(token)
    const userId = decodedToken.uid
    console.log('認証成功、ユーザーID:', userId)
    
    // データベースから削除
    console.log('DatabaseClientでインプットを削除中...')
    await DatabaseClient.deleteInput(params.id, userId, token)
    
    console.log('インプット削除成功:', params.id)
    
    return NextResponse.json({
      success: true,
      message: 'インプットが削除されました'
    })
    
  } catch (error) {
    console.error('インプット削除エラー:', error)
    return NextResponse.json(
      { 
        error: 'インプットの削除に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 