'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { UserPlus, UserCheck } from 'lucide-react'

interface FollowButtonProps {
  targetUserId: string
  compact?: boolean
}

interface FollowStatus {
  isFollowing: boolean
  canFollow?: boolean
  followId?: string
}

export default function FollowButton({ targetUserId, compact = false }: FollowButtonProps) {
  const [status, setStatus] = useState<FollowStatus>({
    isFollowing: false,
    canFollow: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Supabaseクライアントを作成するヘルパー関数
  const createSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase環境変数が設定されていません')
    }
    
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  useEffect(() => {
    // 既に初期化済みの場合はスキップ
    if (isInitialized) return

    let isMounted = true

    const fetchInitialData = async () => {
      try {
        setIsLoading(true)
        
        // セッションから現在のユーザーを取得（auth.getUserではなくauth.getSessionを使用）
        const supabase = createSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!isMounted) return

        if (!session?.user) {
          setStatus({ isFollowing: false, canFollow: false })
          setIsInitialized(true)
          setIsLoading(false)
          return
        }

        const userId = session.user.id
        setCurrentUserId(userId)

        // 自分自身の場合はボタンを表示しない
        if (userId === targetUserId) {
          setStatus({ isFollowing: false, canFollow: false })
          setIsInitialized(true)
          setIsLoading(false)
          return
        }

        // APIコールにタイムアウトを設定
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        try {
          // 現在のフォロー状態を確認
          const response = await fetch(`/api/connections?targetUserId=${targetUserId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal
          })

          clearTimeout(timeoutId)

          if (!isMounted) return

          if (response.ok) {
            const data = await response.json()
            
            setStatus({
              isFollowing: data.isFollowing,
              canFollow: data.canFollow !== false,
              followId: data.followId
            })
          } else {
            // API エラーの場合はデフォルト値を設定
            setStatus({ isFollowing: false, canFollow: true })
          }
        } catch (fetchError) {
          if (!isMounted) return
          
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            console.log('フォロー状態取得タイムアウト')
          } else {
            console.error('フォロー状態取得エラー:', fetchError)
          }
          setStatus({ isFollowing: false, canFollow: true })
        }
      } catch (error) {
        if (!isMounted) return
        
        console.error('初期データ取得エラー:', error)
        setStatus({ isFollowing: false, canFollow: true })
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setIsInitialized(true)
        }
      }
    }

    fetchInitialData()

    // クリーンアップ関数
    return () => {
      isMounted = false
    }
  }, [targetUserId, isInitialized]) // 依存配列を最小限に

  const handleFollow = async () => {
    if (!currentUserId || isLoading) return

    setIsLoading(true)
    try {
      const supabase = createSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('認証トークンが見つかりません')
      }

      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          isFollowing: true,
          canFollow: false,
          followId: data.follow.id
        })
      } else {
        console.error('フォローエラー:', data.error)
      }
    } catch (error) {
      console.error('フォローエラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnfollow = async () => {
    if (!status.followId || isLoading) return

    setIsLoading(true)
    try {
      const supabase = createSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('認証トークンが見つかりません')
      }

      const response = await fetch(`/api/connections?followId=${status.followId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        setStatus({
          isFollowing: false,
          canFollow: true
        })
      } else {
        const data = await response.json()
        console.error('フォロー解除エラー:', data.error)
      }
    } catch (error) {
      console.error('フォロー解除エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 初期化中はローディング表示
  if (!isInitialized) {
    return (
      <Button
        disabled
        variant="outline"
        className={compact ? "h-8 px-3 text-sm" : "h-10 px-4"}
      >
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </Button>
    )
  }

  // 自分自身の場合は何も表示しない
  if (!status.canFollow && !status.isFollowing) {
    return null
  }

  const baseButtonClass = compact 
    ? "h-8 px-3 text-sm" 
    : "h-10 px-4"

  const iconSize = compact ? 16 : 20

  // フォロー中の場合
  if (status.isFollowing) {
    return (
      <Button
        onClick={handleUnfollow}
        disabled={isLoading}
        variant="outline"
        className={`${baseButtonClass} text-gray-700 border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50`}
      >
        <UserCheck size={iconSize} className="mr-2" />
        {compact ? 'フォロー中' : 'フォローしています'}
      </Button>
    )
  }

  // 初回フォロー
  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      className={`${baseButtonClass} bg-blue-600 text-white hover:bg-blue-700`}
    >
      <UserPlus size={iconSize} className="mr-2" />
      {compact ? 'フォロー' : 'フォローする'}
    </Button>
  )
} 