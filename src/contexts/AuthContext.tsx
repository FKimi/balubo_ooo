'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { auth } from '@/lib/supabase'

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
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // ガード節：Supabaseが設定されていない場合は早期return
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setUser(null)
      setLoading(false)
      return
    }

    // 初期認証状態の確認
    const getInitialUser = async () => {
      setLoading(true)
      
      try {
        const { user } = await auth.getCurrentUser()
        setUser(user)
      } catch (error) {
        console.warn('Authentication not available:', getErrorMessage(error))
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // 認証状態の変更を監視
    try {
      const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.warn('Auth state change monitoring not available:', getErrorMessage(error))
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
      return result
    } catch (error) {
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
      return result
    } catch (error) {
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
      return { error: result.error ? { message: getErrorMessage(result.error) } : null }
    } catch (error) {
      return { error: { message: getErrorMessage(error) } }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (): Promise<AuthResult> => {
    setLoading(true)
    
    try {
      const result = await auth.signInWithGoogle()
      
      // OAuthの場合は通常リダイレクトが発生するため、userは即座には取得できない
      // 成功の場合はdataにはOAuth情報が含まれるが、userは含まれない
      if (result.error) {
        return { 
          data: null, 
          error: { message: getErrorMessage(result.error) } 
        }
      }
      
      // OAuth成功の場合（リダイレクトが発生するため、実際のユーザー情報は後で取得される）
      return { 
        data: { user: null }, 
        error: null 
      }
    } catch (error) {
      return { 
        data: null, 
        error: { message: getErrorMessage(error) } 
      }
    } finally {
      setLoading(false)
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