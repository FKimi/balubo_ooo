import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side用のSupabaseクライアント（認証専用）
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
)

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
export function getAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  console.log('[API-Utils] Authorization Header:', authHeader ? '存在します' : '存在しません', authHeader)
  if (!authHeader) {
    return null
  }
  const token = authHeader.split(' ')[1]
  console.log('[API-Utils] Extracted Token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'なし')
  return token || null
}

/**
 * 認証が必要なAPIエンドポイントのための共通処理
 */
export async function withAuth<T>(
  request: NextRequest,
  handler: (_userId: string, _token: string) => Promise<T>
): Promise<NextResponse<T> | NextResponse<{ error: string }>> {
  try {
    const token = getAuthToken(request)
    console.log('[API-Utils] withAuth: Token from getAuthToken:', token ? token.substring(0, 10) + '...' : 'なし')
    if (!token) {
      console.error('[API-Utils] withAuth: 認証トークンがありません')
      return createErrorResponse('認証トークンが必要です', 401)
    }

    // Supabaseでトークンを検証
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token)
    console.log('[API-Utils] withAuth: Supabase getUser結果:', { userExists: !!user, authError: error?.message })
    if (error || !user) {
      console.error('[API-Utils] withAuth: 認証検証エラー:', error?.message || '不明なエラー')
      console.error('[API-Utils] withAuth: ユーザー情報:', user)
      return createErrorResponse('認証に失敗しました', 401)
    }

    const result = await handler(user.id, token)
    
    return createSuccessResponse(result)
  } catch (error) {
    console.error('[API-Utils] withAuth: API認証エラー:', error)
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
  handler: (_userId: string | null, _token: string | null) => Promise<T>
): Promise<NextResponse<T> | NextResponse<{ error: string }>> {
  try {
    const token = getAuthToken(request)
    let userId: string | null = null

    console.log('[API-Utils] withOptionalAuth: Token from getAuthToken:', token ? token.substring(0, 10) + '...' : 'なし')

    if (token) {
      try {
        const { data: { user }, error } = await supabaseAuth.auth.getUser(token)
        console.log('[API-Utils] withOptionalAuth: Supabase getUser結果:', { userExists: !!user, authError: error?.message })
        if (!error && user) {
          userId = user.id
        }
      } catch (authError) {
        // 認証エラーでも処理を続行（匿名アクセス）
        console.warn('[API-Utils] withOptionalAuth: 認証トークンが無効ですが、匿名アクセスとして続行します:', authError)
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
export function processDbArrayResult(data: any[] | null, error: any) {
  if (error) {
    if (error.code === 'PGRST116') {
      return [] // 結果がない場合は空配列を返す
    }
    console.error('Database Error:', error)
    throw new Error(`データベースエラー: ${error.message}`)
  }
  return data || []
} 