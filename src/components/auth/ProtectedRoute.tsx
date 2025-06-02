'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // ローディング中は何も表示しない
  if (loading) {
    return (
      <div className="min-h-screen bg-base-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">読み込み中...</p>
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