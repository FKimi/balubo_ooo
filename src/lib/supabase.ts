import { supabaseManager } from './supabase-client'

// 後方互換性のためのサポート
export const supabase = supabaseManager.getStandardClient()

const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url-here'
)

console.log('Supabase設定状況:', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  keyConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  isConfigured: isSupabaseConfigured
})

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

    // ★★★ デバッグログ ★★★
    console.log('[Supabase Auth] Googleサインイン試行開始:', {
      siteUrl,
      redirectURL,
      windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'サーバーサイド',
      envSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      vercelUrl: process.env.VERCEL_URL,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : 'サーバーサイド'
    })

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
      console.error('[Supabase Auth] Googleサインインエラー:', {
        error,
        code: error.code,
        message: error.message,
        details: error
      })
    } else {
      console.log('[Supabase Auth] Googleサインイン成功:', { 
        hasData: !!data,
        dataUrl: data?.url,
        dataProvider: data?.provider
      })
    }
    
    return { data, error }
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
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange(callback)
  },
}

// ブラウザから利用する際に共通インスタンスを返すヘルパー
export function getSupabaseBrowserClient() {
  return supabaseManager.getStandardClient()
} 