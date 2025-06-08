import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 環境変数が設定されているかチェック
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabaseの環境変数が設定されていません')
}
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-project-url-here')

console.log('Supabase設定状況:', {
  url: supabaseUrl,
  keyConfigured: Boolean(supabaseAnonKey),
  isConfigured: isSupabaseConfigured
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
    
    // サイトのオリジンを取得（クライアントサイドでのみ利用可能）
    const siteUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://balubo-ooo.vercel.app'

    const redirectURL = `${siteUrl}/profile`

    // ★★★ デバッグログ ★★★
    console.log('[Supabase Auth] Googleサインイン試行開始:', {
      siteUrl,
      redirectURL,
      windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'サーバーサイド',
      envSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
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
      console.error('[Supabase Auth] Googleサインインエラー:', error)
    } else {
      console.log('[Supabase Auth] Googleサインイン成功:', { data })
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