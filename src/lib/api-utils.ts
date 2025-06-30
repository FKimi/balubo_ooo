import { NextRequest, NextResponse } from 'next/server'
import { supabaseManager } from './supabase-client'

/**
 * API共通エラーレスポンス
 */
export function createErrorResponse(error: string, status = 500, details?: any) {
  return NextResponse.json(
    {
      error,
      details,
      timestamp: new Date().toISOString()
    },
    { status }
  )
}

/**
 * API共通成功レスポンス
 */
export function createSuccessResponse(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

/**
 * リクエストから認証トークンを抽出
 */
export function extractAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.split(' ')[1]
}

/**
 * 認証が必要なAPIエンドポイントのための共通処理
 */
export async function withAuth<T>(
  request: NextRequest,
  handler: (userId: string, token: string) => Promise<T>
): Promise<NextResponse<T> | NextResponse<{ error: string }>> {
  try {
    const token = extractAuthToken(request)
    if (!token) {
      return createErrorResponse('認証トークンが必要です', 401)
    }

    const { userId } = await supabaseManager.verifyToken(token)
    const result = await handler(userId, token)
    
    return createSuccessResponse(result)
  } catch (error) {
    console.error('API認証エラー:', error)
    return createErrorResponse(
      error instanceof Error ? error.message : '認証に失敗しました',
      401
    )
  }
}

/**
 * 認証が任意のAPIエンドポイントのための共通処理
 */
export async function withOptionalAuth<T>(
  request: NextRequest,
  handler: (userId: string | null, token: string | null) => Promise<T>
): Promise<NextResponse<T> | NextResponse<{ error: string }>> {
  try {
    const token = extractAuthToken(request)
    let userId: string | null = null

    if (token) {
      try {
        const authResult = await supabaseManager.verifyToken(token)
        userId = authResult.userId
      } catch (authError) {
        // 認証エラーでも処理を続行（匿名アクセス）
        console.warn('認証トークンが無効ですが、匿名アクセスとして続行します:', authError)
      }
    }

    const result = await handler(userId, token)
    return createSuccessResponse(result)
  } catch (error) {
    console.error('API処理エラー:', error)
    return createErrorResponse(
      error instanceof Error ? error.message : 'APIエラーが発生しました',
      500
    )
  }
}

/**
 * パラメータからIDを安全に取得（Next.js 15対応）
 */
export async function extractId(context: { params: Promise<{ id: string }> }): Promise<string> {
  const { id } = await context.params
  if (!id) {
    throw new Error('IDが指定されていません')
  }
  return id
}

/**
 * Supabaseエラーを人間が読みやすい形式に変換
 */
export function formatSupabaseError(error: any): string {
  if (!error) return '不明なエラー'
  
  // RLSポリシーエラー
  if (error.code === '42501') {
    return 'アクセス権限がありません'
  }
  
  // 見つからないエラー
  if (error.code === 'PGRST116') {
    return 'データが見つかりません'
  }
  
  // 重複エラー
  if (error.code === '23505') {
    return 'データが既に存在します'
  }
  
  // 制約違反
  if (error.code === '23514') {
    return 'データの形式が正しくありません'
  }
  
  return error.message || 'データベースエラーが発生しました'
}

/**
 * データベース操作の結果を統一的に処理
 */
export function processDbResult<T>(data: T | null, error: any): T {
  if (error) {
    throw new Error(formatSupabaseError(error))
  }
  if (!data) {
    throw new Error('データが見つかりません')
  }
  return data
}

/**
 * 配列データの結果を処理
 */
export function processDbArrayResult<T>(data: T[] | null, error: any): T[] {
  if (error) {
    throw new Error(formatSupabaseError(error))
  }
  return data || []
} 