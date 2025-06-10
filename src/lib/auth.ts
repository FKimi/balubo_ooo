import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface DecodedToken {
  uid: string
  email: string | undefined
}

/**
 * Supabaseアクセストークンを検証し、ユーザー情報を取得する
 * @param token - Supabaseのアクセストークン
 * @returns デコードされたトークン情報
 */
export async function verifySupabaseToken(token: string): Promise<DecodedToken> {
  try {
    // Supabaseでトークンを使用してユーザー情報を取得
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error) {
      console.error('Supabaseトークン検証エラー:', error)
      throw new Error(`認証に失敗しました: ${error.message}`)
    }
    
    if (!user) {
      throw new Error('ユーザーが見つかりません')
    }
    
    return {
      uid: user.id,
      email: user.email
    }
  } catch (error) {
    console.error('トークン検証エラー:', error)
    throw error
  }
}

/**
 * 後方互換性のために、Firebase形式の関数名も提供
 * @deprecated verifySupabaseTokenを使用してください
 */
export const verifyFirebaseToken = verifySupabaseToken

/**
 * 認証が必要なAPIエンドポイントで使用するミドルウェア関数
 * @param request - Next.jsのリクエストオブジェクト
 * @returns ユーザー情報
 */
export async function authenticateRequest(request: Request): Promise<DecodedToken> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('認証トークンが提供されていません')
  }
  
  const token = authHeader.substring(7)
  return await verifySupabaseToken(token)
} 