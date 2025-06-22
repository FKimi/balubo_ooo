// Supabase クライアントのシングルトン
import { supabase } from '@/lib/supabase'

/**
 * Minimal fetch wrapper that automatically attaches JSON headers and, if available,
 * the current Supabase session's `access_token` as a Bearer token. Returns parsed
 * JSON for convenience and throws on non-2xx responses.
 */
export async function fetcher<T = unknown>(
  input: string | URL | Request,
  init: RequestInit = {}
): Promise<T> {
  // 共有 Supabase クライアントからアクセストークンを取得
  let token: string | undefined
  try {
    const { data: { session } } = await supabase.auth.getSession()
    token = session?.access_token
  } catch {
    // サーバーサイドやセッション未初期化の場合はトークンなし
    token = undefined
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(input, { ...init, headers })
  if (!response.ok) {
    // Try to parse error payload but fall back to status text
    let message: string
    try {
      const data = await response.json()
      message = data.error || JSON.stringify(data)
    } catch (_) {
      message = response.statusText
    }
    throw new Error(message || 'Fetch error')
  }

  // Assume JSON response by default
  return (await response.json()) as T
}
