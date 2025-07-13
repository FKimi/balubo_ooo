import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 2 // イベント頻度を大幅に削減
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'balubo-web'
    }
  }
})

// リソース使用量を削減するための設定
export const createOptimizedSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false, // 自動リフレッシュを無効化
      persistSession: false,   // セッション永続化を無効化
      detectSessionInUrl: false
    },
    realtime: {
      params: {
        eventsPerSecond: 1,    // 最小限のイベント頻度
        maxChannels: 5         // チャンネル数を制限
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'balubo-web-optimized'
      }
    }
  })
} 