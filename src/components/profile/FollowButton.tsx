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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 現在のユーザーを取得
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setStatus({ isFollowing: false, canFollow: false })
          return
        }

        setCurrentUserId(user.id)

        // 自分自身の場合はボタンを表示しない
        if (user.id === targetUserId) {
          setStatus({ isFollowing: false, canFollow: false })
          return
        }

        // 現在のフォロー状態を確認
        const token = (await supabase.auth.getSession()).data.session?.access_token
        if (!token) {
          setStatus({ isFollowing: false, canFollow: false })
          return
        }

        const response = await fetch(`/api/connections?targetUserId=${targetUserId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          const data = await response.json()
          
          setStatus({
            isFollowing: data.isFollowing,
            canFollow: data.canFollow !== false,
            followId: data.followId
          })
        }
      } catch (error) {
        console.error('初期データ取得エラー:', error)
        setStatus({ isFollowing: false, canFollow: true })
      }
    }

    fetchInitialData()
  }, [targetUserId])

  const handleFollow = async () => {
    if (!currentUserId || isLoading) return

    setIsLoading(true)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const token = (await supabase.auth.getSession()).data.session?.access_token
      
      if (!token) {
        throw new Error('認証トークンが見つかりません')
      }

      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const token = (await supabase.auth.getSession()).data.session?.access_token
      
      if (!token) {
        throw new Error('認証トークンが見つかりません')
      }

      const response = await fetch(`/api/connections?followId=${status.followId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
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