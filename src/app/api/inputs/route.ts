import { NextRequest } from 'next/server'
import { DatabaseClient } from '@/lib/database'
import { withAuth } from '@/lib/api-utils'

// インプット一覧取得 (GET)
export async function GET(request: NextRequest) {
  return withAuth(request, async (userId, token) => {
    console.log('インプット一覧取得APIが呼び出されました、ユーザーID:', userId)

    // DatabaseClientを使用してインプットデータを取得
    const inputs = await DatabaseClient.getInputs(userId, token)
    console.log('インプット取得結果:', inputs.length, '件')

    return { 
      inputs,
      total: inputs.length 
    }
  })
}

// インプット保存 (POST)
export async function POST(request: NextRequest) {
  return withAuth(request, async (userId, token) => {
    console.log('インプット保存APIが呼び出されました、ユーザーID:', userId)

    // リクエストボディを取得
    const inputData = await request.json()
    console.log('受信したインプットデータ:', Object.keys(inputData))

    // DatabaseClientを使用してインプットデータを保存
    const result = await DatabaseClient.saveInput(userId, inputData, token)
    console.log('インプット保存成功:', result.id)

    return {
      success: true,
      input: result,
      message: 'インプットを保存しました'
    }
  })
} 