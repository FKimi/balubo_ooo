import { NextRequest } from 'next/server'
import { DatabaseClient } from '@/lib/database'
import { withAuth } from '@/lib/api-utils'

// 動的レンダリングを強制
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// インプット分析取得 (GET)
export async function GET(request: NextRequest) {
  return withAuth(request, async (userId, token) => {
    console.log('インプット分析APIが呼び出されました、ユーザーID:', userId)

    // DatabaseClientを使用してインプット分析を実行
    const analysis = await DatabaseClient.analyzeInputs(userId, token)
    console.log('インプット分析完了:', analysis.totalInputs, '件のデータを分析')

    return { 
      analysis,
      message: 'インプット分析が完了しました'
    }
  })
} 