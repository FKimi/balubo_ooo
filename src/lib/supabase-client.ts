import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * 統一されたSupabaseクライアント管理
 * 認証方式とクライアント作成ロジックを一元化
 */
export class SupabaseClientManager {
  private static instance: SupabaseClientManager
  private readonly supabaseUrl: string
  private readonly supabaseAnonKey: string
  private readonly supabaseServiceKey?: string
  
  // クライアントキャッシュ
  private clientCache = new Map<string, SupabaseClient>()

  private constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    this.supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error('Supabaseの環境変数が設定されていません')
    }
  }

  static getInstance(): SupabaseClientManager {
    if (!SupabaseClientManager.instance) {
      SupabaseClientManager.instance = new SupabaseClientManager()
    }
    return SupabaseClientManager.instance
  }

  /**
   * 認証されたSupabaseクライアントを作成
   * @param token - Supabaseアクセストークン
   * @param useServiceRole - Service Role Keyを使用するか（RLS制約なし）
   */
  createClient(token?: string, useServiceRole = false): SupabaseClient {
    // キャッシュキャーを生成
    const cacheKey = `${useServiceRole ? 'service' : 'anon'}-${token ? 'auth' : 'no-auth'}`
    
    // キャッシュからクライアントを取得
    const cachedClient = this.clientCache.get(cacheKey)
    if (cachedClient) {
      return cachedClient
    }

    let client: SupabaseClient

    if (useServiceRole && this.supabaseServiceKey) {
      // Service Role Key使用（RLS制約なし）
      client = createClient(this.supabaseUrl, this.supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    } else if (token) {
      // Anonymous Key + Authorization header（RLS制約あり）
      client = createClient(this.supabaseUrl, this.supabaseAnonKey, {
        global: {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    } else {
      // Anonymous Key のみ（未認証）
      client = createClient(this.supabaseUrl, this.supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      })
    }

    // キャッシュに保存（最大10個まで）
    if (this.clientCache.size >= 10) {
      const firstKey = this.clientCache.keys().next().value
      this.clientCache.delete(firstKey)
    }
    this.clientCache.set(cacheKey, client)

    return client
  }

  /**
   * 認証トークンを検証してユーザー情報を取得
   */
  async verifyToken(token: string): Promise<{ userId: string; email?: string }> {
    const client = this.createClient(token)
    const { data: { user }, error } = await client.auth.getUser()
    
    if (error || !user) {
      throw new Error(`認証に失敗しました: ${error?.message || 'ユーザーが見つかりません'}`)
    }
    
    return {
      userId: user.id,
      email: user.email
    }
  }

  /**
   * 標準クライアント（ブラウザ用、認証状態管理あり）
   */
  getStandardClient(): SupabaseClient {
    return this.createClient()
  }

  /**
   * Service Role Key使用判定
   */
  hasServiceRoleKey(): boolean {
    return Boolean(this.supabaseServiceKey)
  }
}

// シングルトンインスタンスをエクスポート
export const supabaseManager = SupabaseClientManager.getInstance()

// 後方互換性のためのヘルパー関数
export function createAuthenticatedClient(token?: string, useServiceRole = false): SupabaseClient {
  return supabaseManager.createClient(token, useServiceRole)
}

export function getSupabaseBrowserClient(): SupabaseClient {
  return supabaseManager.getStandardClient()
} 