import { supabase as supabaseClient } from './supabase-client'

// 後方互換性のためのサポート
export const supabase = supabaseClient

const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url-here'
)

// 認証関連のヘルパー関数
export const auth = {
  // 新規登録
  signUp: async (email: string, password: string, displayName: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })
    return { data, error }
  },

  // ログイン
  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Googleログイン
  signInWithGoogle: async () => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    
    // サイトのオリジンを取得（本番環境対応）
    let siteUrl: string
    if (typeof window !== 'undefined') {
      // クライアントサイドの場合、現在のオリジンを使用
      siteUrl = window.location.origin
    } else {
      // サーバーサイドの場合、環境変数またはヘッダーから取得
      siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                'https://balubo-ooo.vercel.app'
    }

    const redirectURL = `${siteUrl}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // ログイン後にプロフィールページにリダイレクト
        redirectTo: redirectURL,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    
    if (error) {
      console.error('[Supabase Auth] Googleサインインエラー:', error)
      throw error
    }

    return data
  },

  // ログアウト
  signOut: async () => {
    if (!isSupabaseConfigured) {
      return { error: null }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 現在のユーザー取得
  getCurrentUser: async () => {
    if (!isSupabaseConfigured) {
      return { user: null, error: null }
    }
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // 認証状態の変更を監視
  onAuthStateChange: (callback: (_event: string, _session: any) => void) => {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange(callback)
  },
}

// ブラウザから利用する際に共通インスタンスを返すヘルパー
export function getSupabaseBrowserClient() {
  return supabaseClient
} 