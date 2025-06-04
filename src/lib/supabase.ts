import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kdrnxnorxquxvxutkwnq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkcm54bm9yeHF1eHZ4dXRrd25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxODU5MzEsImV4cCI6MjA2Mzc2MTkzMX0.tIwl9XnZ9D4gkQP8-8m2QZiVuMGP7E9M1dNJvkQHdZE'

// 環境変数が設定されているかチェック
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

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // ログイン後にプロフィールページにリダイレクト
        redirectTo: `${siteUrl}/profile`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
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