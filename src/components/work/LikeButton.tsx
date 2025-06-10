'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface LikeButtonProps {
  workId: string
  initialCount?: number
  initialIsLiked?: boolean
}

export default function LikeButton({ workId, initialCount = 0, initialIsLiked = false }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase環境変数が設定されていません')
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  useEffect(() => {
    const checkAuthAndFetchLikes = async () => {
      try {
        // 認証状態を確認
        const { data: { session } } = await supabase.auth.getSession()
        const authToken = session?.access_token
        setIsAuthenticated(!!authToken)

        // いいね数と状態を取得
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`
        }

        const response = await fetch(`/api/likes?workId=${workId}`, {
          headers
        })

        if (response.ok) {
          const data = await response.json()
          setLikeCount(data.count)
          setIsLiked(data.isLiked)
        }
      } catch (error) {
        console.error('いいね取得エラー:', error)
      }
    }

    checkAuthAndFetchLikes()
  }, [workId, supabase.auth])

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('いいねするにはログインが必要です')
      return
    }

    if (isLoading) return

    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const authToken = session?.access_token

      if (!authToken) {
        alert('認証エラーが発生しました')
        return
      }

      const url = isLiked ? `/api/likes?workId=${workId}` : '/api/likes'
      const method = isLiked ? 'DELETE' : 'POST'
      
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }

      // DELETEリクエストの場合はbodyを含めない
      if (!isLiked) {
        fetchOptions.body = JSON.stringify({ workId })
      }

      const response = await fetch(url, fetchOptions)

      if (response.ok) {
        // 楽観的更新
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'エラーが発生しました')
      }
    } catch (error) {
      console.error('いいね操作エラー:', error)
      alert('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isLiked
          ? 'text-red-600 bg-red-50 hover:bg-red-100'
          : 'text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-red-500'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Heart 
        className={`h-5 w-5 transition-all duration-200 ${
          isLiked ? 'fill-current' : ''
        } ${isLoading ? '' : 'group-hover:scale-110'}`}
      />
      <span className="text-sm font-medium">
        {likeCount > 0 ? likeCount : 'いいね'}
      </span>
    </button>
  )
} 