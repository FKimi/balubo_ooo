import { getSupabaseBrowserClient as getClientFromRoot } from '../supabase'

// ブラウザ用のSupabaseクライアントを取得するヘルパー関数
// 既存の `src/lib/supabase.ts` で生成されているシングルトンをそのまま再利用します。
// これによりアプリ全体で Supabase クライアントのインスタンスが 1 つだけになることを保証します。
export const getSupabaseBrowserClient = getClientFromRoot; 