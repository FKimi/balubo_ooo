'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { auth, supabase } from '@/lib/supabase'

// 型定義の改善
interface AuthError {
  message: string
}

interface AuthData {
  user: User | null
}

interface AuthResult {
  data: AuthData | null
  error: AuthError | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (_email: string, _password: string, _displayName: string) => Promise<AuthResult>
  signIn: (_email: string, _password: string) => Promise<AuthResult>
  signInWithGoogle: () => Promise<AuthResult>
  signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// エラーハンドリング用ユーティリティ
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return '予期しないエラーが発生しました'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // 初期状態を true に変更

  useEffect(() => {
    // ガード節：Supabaseが設定されていない場合は早期return
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('[AuthContext] Supabase設定が不完全です')
      setUser(null)
      setLoading(false)
      return
    }

    // 初期認証状態の確認
    const getInitialUser = async () => {
      setLoading(true)
      console.log('[AuthContext] 初期ユーザー取得開始')
      
      try {
        const { user } = await auth.getCurrentUser()
        console.log('[AuthContext] 初期ユーザー取得結果:', { 
          hasUser: !!user, 
          userEmail: user?.email,
          currentUrl: typeof window !== 'undefined' ? window.location.href : 'サーバーサイド'
        })
        setUser(user)
        // 初期ロード時にもプロフィール存在確認
        ensureProfile(user)
      } catch (error) {
        console.warn('[AuthContext] 初期認証取得エラー:', getErrorMessage(error))
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // 認証状態の変更を監視
    try {
      const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
        console.log('[AuthContext] 認証状態変更:', { 
          event, 
          hasSession: !!session,
          userEmail: session?.user?.email,
          currentUrl: typeof window !== 'undefined' ? window.location.href : 'サーバーサイド',
          hasAccessToken: typeof window !== 'undefined' && window.location.hash.includes('access_token'),
          hasRefreshToken: typeof window !== 'undefined' && window.location.hash.includes('refresh_token')
        })
        
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN' && session) {
          // プロフィールの存在確認 & 自動作成
          ensureProfile(session.user)

          console.log('[AuthContext] SIGNED_IN イベント検出:', {
            userEmail: session.user.email,
            currentPath: typeof window !== 'undefined' ? window.location.pathname : 'サーバーサイド',
            hasFragment: typeof window !== 'undefined' && window.location.hash.length > 0
          })

          // OAuth認証後の自動リダイレクト処理
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname
            const hasOAuthFragment = window.location.hash.includes('access_token')

            // OAuth認証後で、ログインページまたはコールバックページにいる場合
            if (hasOAuthFragment && (currentPath === '/login' || currentPath === '/auth/callback')) {
              console.log('[AuthContext] OAuth認証完了 - プロフィールページにリダイレクト')
              // 少し遅延させてからリダイレクト（セッション確立を確実にするため）
              setTimeout(() => {
                window.location.href = '/profile'
              }, 500)
            } else if (currentPath === '/profile') {
              console.log('[AuthContext] 既に/profileページにいます - リダイレクト不要')
            } else {
              console.log('[AuthContext] その他のページにいます:', currentPath)
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('[AuthContext] SIGNED_OUT イベント検出')
        }
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.warn('[AuthContext] 認証状態監視設定エラー:', getErrorMessage(error))
      setLoading(false)
      return undefined
    }
  }, [])

  const signUp = async (email: string, password: string, displayName: string): Promise<AuthResult> => {
    // ガード節：入力値チェック
    if (!email || !password || !displayName) {
      return { 
        data: null, 
        error: { message: '必須項目を入力してください' } 
      }
    }

    setLoading(true)
    
    try {
      const result = await auth.signUp(email, password, displayName)
      console.log('[AuthContext] サインアップ結果:', { hasData: !!result.data, hasError: !!result.error })
      return result
    } catch (error) {
      console.error('[AuthContext] サインアップエラー:', getErrorMessage(error))
      return { 
        data: null, 
        error: { message: getErrorMessage(error) } 
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    // ガード節：入力値チェック
    if (!email || !password) {
      return { 
        data: null, 
        error: { message: 'メールアドレスとパスワードを入力してください' } 
      }
    }

    setLoading(true)
    
    try {
      const result = await auth.signIn(email, password)
      console.log('[AuthContext] サインイン結果:', { hasData: !!result.data, hasError: !!result.error })
      return result
    } catch (error) {
      console.error('[AuthContext] サインインエラー:', getErrorMessage(error))
      return { 
        data: null, 
        error: { message: getErrorMessage(error) } 
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    setLoading(true)
    
    try {
      const result = await auth.signOut()
      console.log('[AuthContext] サインアウト結果:', { hasError: !!result.error })
      return { error: result.error ? { message: getErrorMessage(result.error) } : null }
    } catch (error) {
      console.error('[AuthContext] サインアウトエラー:', getErrorMessage(error))
      return { error: { message: getErrorMessage(error) } }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (): Promise<AuthResult> => {
    setLoading(true)
    console.log('[AuthContext] Googleサインイン開始')
    
    try {
      const result = await auth.signInWithGoogle()
      
      // OAuthの場合は通常リダイレクトが発生するため、userは即座には取得できない
      // 成功の場合は{ provider, url }が返される
      if ('error' in result && result.error) {
        console.error('[AuthContext] Googleサインインエラー:', getErrorMessage(result.error))
        return { 
          data: null, 
          error: { message: getErrorMessage(result.error) } 
        }
      }
      
      // OAuth成功の場合（リダイレクトが発生するため、実際のユーザー情報は後で取得される）
      console.log('[AuthContext] Googleサインイン成功 - リダイレクト処理開始')
      return { 
        data: { user: null }, 
        error: null 
      }
    } catch (error) {
      console.error('[AuthContext] Googleサインイン例外:', getErrorMessage(error))
      return { 
        data: null, 
        error: { message: getErrorMessage(error) } 
      }
    } finally {
      setLoading(false)
    }
  }

  // サインイン後にプロフィール行が存在しない場合は作成する
  const ensureProfile = async (signedInUser: User | null) => {
    try {
      if (!signedInUser) return

      // 既にプロフィールが存在するか確認
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .eq('user_id', signedInUser.id)
        .single() as { data: any; error: any }

      if (error && error.code !== 'PGRST116') {
        // その他のエラーはログに出すだけ
        console.warn('[AuthContext] ensureProfile: プロフィール確認エラー:', error)
        return
      }

      // PGRST116: Row not found → 新規作成
      if (!data) {
        const displayName = (signedInUser.user_metadata?.display_name as string | undefined) || 'ユーザー'

        const { error: insertError } = await supabase
          .from('profiles')
          .upsert({
            user_id: signedInUser.id,
            display_name: displayName,
          }, { onConflict: 'user_id', ignoreDuplicates: true })

        if (insertError && insertError.code !== '23505') { // 23505 = unique_violation
          console.error('[AuthContext] ensureProfile: プロフィール作成エラー:', insertError)
        } else {
          console.log('[AuthContext] ensureProfile: プロフィールを自動作成しました')
        }
      }
    } catch (err) {
      console.error('[AuthContext] ensureProfile: 例外発生', err)
    }
  }

  // 成功パス：値の構築を最後に
  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  // ガード節：コンテキストが未定義の場合はエラー
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
} 