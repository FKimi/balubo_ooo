'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('認証エラー:', error)
          router.push('/login?error=auth_failed')
          return
        }

        if (data.session) {
          // 認証成功 - プロフィールページにリダイレクト
          router.push('/profile')
        } else {
          // セッションがない場合はログインページにリダイレクト
          router.push('/login')
        }
      } catch (error) {
        console.error('認証処理エラー:', error)
        router.push('/login?error=auth_failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">認証処理中...</h2>
        <p className="text-gray-600">しばらくお待ちください</p>
      </div>
    </div>
  )
} 