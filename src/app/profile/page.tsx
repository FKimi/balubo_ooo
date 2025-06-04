'use client'

import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ProfileContent from './profile-content'

function ProfileLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">プロフィールを読み込んでいます...</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()

  // OAuth認証後のフラグメント処理 - 一時的に無効化してSupabaseの自動処理に任せる
  /*
  useEffect(() => {
    const handleOAuthCallback = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      if (hashParams.get('access_token') || hashParams.get('refresh_token')) {
        console.log('OAuth認証フラグメント検出 - URLをクリーンアップします')
        // URLのフラグメントをクリアして履歴を更新
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
      }
    }

    handleOAuthCallback()
  }, [])
  */

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <Suspense fallback={<ProfileLoadingFallback />}>
          <ProfileContent />
        </Suspense>
      </AuthenticatedLayout>
    </ProtectedRoute>
  )
} 