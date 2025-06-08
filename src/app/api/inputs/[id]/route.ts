import { NextRequest, NextResponse } from 'next/server'
import { DatabaseClient } from '@/lib/database'
import { verifyFirebaseToken } from '@/lib/auth'

// 個別インプットの取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('個別インプット取得APIが呼び出されました:', params.id)
    
    // 認証確認
    const authHeader = request.headers.get('authorization')
    console.log('Authorization ヘッダー:', !!authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    console.log('認証トークンを確認中...')
    
    const decodedToken = await verifyFirebaseToken(token)
    const userId = decodedToken.uid
    console.log('認証成功、ユーザーID:', userId)
    
    // インプット取得
    console.log('DatabaseClientでインプットを取得中...')
    const input = await DatabaseClient.getInput(params.id, userId, token)
    
    if (!input) {
      return NextResponse.json(
        { error: 'インプットが見つかりません' },
        { status: 404 }
      )
    }
    
    console.log('インプット取得成功:', input.id)
    
    return NextResponse.json({
      success: true,
      input
    })
    
  } catch (error) {
    console.error('個別インプット取得エラー:', error)
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