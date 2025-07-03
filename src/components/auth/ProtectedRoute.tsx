'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // OAuth認証後のフラグメント検出 - セッション確立を少し待つ
    const hasOAuthFragment = typeof window !== 'undefined' && 
      (window.location.hash.includes('access_token') || window.location.hash.includes('refresh_token'))
    
    console.log('[ProtectedRoute] 初期化:', {
      hasOAuthFragment,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : 'サーバーサイド',
      hashFragment: typeof window !== 'undefined' ? window.location.hash.substring(0, 50) + '...' : 'サーバーサイド'
    })
    
    if (hasOAuthFragment) {
      console.log('[ProtectedRoute] OAuth認証フラグメント検出 - セッション確立を待機')
      // OAuth認証後は少し長めに待ってからリダイレクト判定を行う
      const timer = setTimeout(() => {
        console.log('[ProtectedRoute] 待機期間終了 - 認証チェック開始')
        setIsInitialLoad(false)
      }, 3000) // 3秒待つ（より確実にするため）
      
      return () => clearTimeout(timer)
    } else {
      setIsInitialLoad(false)
    }
    
    // 明示的にundefinedを返す（クリーンアップ関数がない場合）
    return undefined
  }, [])

  useEffect(() => {
    // 初期ロード中、または認証ローディング中は何もしない
    if (isInitialLoad || loading) {
      return
    }

    console.log('[ProtectedRoute] 認証チェック:', { 
      hasUser: !!user, 
      loading, 
      isInitialLoad,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : 'サーバーサイド'
    })

    if (!user) {
      console.log('[ProtectedRoute] 未認証のため/loginにリダイレクト')
      router.push('/login')
    }
  }, [user, loading, isInitialLoad, router])

  // ローディングが長時間続く場合のフェイルセーフ（例：トークン破損など）
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('[ProtectedRoute] 認証ローディングがタイムアウト、/login へフォールバック')
        router.push('/login')
      }
    }, 6000) // 6秒以上ローディングしている場合はリダイレクト

    return () => clearTimeout(timeout)
  }, [loading, router])

  // ローディング中は何も表示しない
  if (loading || isInitialLoad) {
    return (
      <div className="min-h-screen bg-base-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">
            {isInitialLoad ? '認証処理中...' : '読み込み中...'}
          </p>
        </div>
      </div>
    )
  }

  // ユーザーが認証されていない場合は何も表示しない（リダイレクト中）
  if (!user) {
    return null
  }

  // 認証されている場合は子コンポーネントを表示
  return <>{children}</>
} 