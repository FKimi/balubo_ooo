'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { User, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FollowButton from '@/components/profile/FollowButton'

interface RecommendedUser {
  id: string
  display_name: string
  bio: string
  avatar_image_url?: string
  professions: string[]
}

interface RecommendedUsersProps {
  currentUserId?: string
  isAuthenticated: boolean
}

export function RecommendedUsers({ currentUserId, isAuthenticated }: RecommendedUsersProps) {
  const [users, setUsers] = useState<RecommendedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // useCallbackでコールバック関数をメモ化
  const handleUserClick = useCallback((userId: string) => {
    router.push(`/share/profile/${userId}`)
  }, [router])

  const handleFollowClick = useCallback((userId: string, displayName: string) => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }
    // フォロー機能は実際のプロフィールページで実装されているため、プロフィールページへ遷移
    router.push(`/share/profile/${userId}`)
  }, [isAuthenticated, router])

  // メモ化された検索パラメータ
  const searchParams = useMemo(() => ({
    currentUserId,
    isAuthenticated
  }), [currentUserId, isAuthenticated])

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout
    
    // 短時間での重複実行を防ぐ
    const lastFetch = sessionStorage.getItem('lastRecommendedUsersFetch')
    const now = Date.now()
    if (lastFetch && (now - parseInt(lastFetch)) < 30000) { // 30秒以内は実行しない
      setLoading(false)
      return
    }

    const fetchRecommendedUsers = async () => {
      try {
        setError(null)
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        }

        // 認証されている場合はトークンを追加（タイムアウト設定）
        if (searchParams.isAuthenticated && searchParams.currentUserId) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          
          if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Supabase環境変数が設定されていません')
            return
          }
          
          try {
            const { createClient } = await import('@supabase/supabase-js')
            const supabase = createClient(supabaseUrl, supabaseAnonKey)
            
            // 認証取得にタイムアウトを設定
            const authPromise = supabase.auth.getSession()
            const authTimeout = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('認証タイムアウト')), 3000)
            })
            
            const { data: { session } } = await Promise.race([authPromise, authTimeout]) as any
            if (session?.access_token && isMounted) {
              headers['Authorization'] = `Bearer ${session.access_token}`
            }
          } catch (authError) {
            console.log('認証取得エラー（続行）:', authError)
          }
        }

        if (!isMounted) return

        // API呼び出しにタイムアウトを設定
        const controller = new AbortController()
        timeoutId = setTimeout(() => {
          controller.abort()
        }, 8000) // 8秒でタイムアウト

        const response = await fetch('/api/users/recommended?limit=3', {
          headers,
          signal: controller.signal
        })

        if (!isMounted) return

        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
          // 成功時に最後の取得時刻を保存
          sessionStorage.setItem('lastRecommendedUsersFetch', Date.now().toString())
        } else {
          throw new Error(`API呼び出しエラー: ${response.status}`)
        }
      } catch (error) {
        if (!isMounted) return

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.error('おすすめユーザー取得タイムアウト')
            setError('読み込みに時間がかかっています')
          } else {
            console.error('おすすめユーザー取得エラー:', error)
            setError('ユーザー情報の取得に失敗しました')
          }
        } else {
          console.error('予期しないエラー:', error)
          setError('予期しないエラーが発生しました')
        }
        // エラー時はユーザーを空配列に設定
        setUsers([])
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchRecommendedUsers()

    // クリーンアップ関数
    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [searchParams.isAuthenticated, searchParams.currentUserId]) // 具体的なプロパティのみ依存配列に設定

  // メモ化されたユーザーリスト
  const memoizedUsers = useMemo(() => users, [users])

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Who to follow</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Who to follow</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  if (memoizedUsers.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Who to follow</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            現在おすすめできるユーザーがいません
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-bold text-gray-900">Who to follow</h3>
      </div>
      
      <div className="space-y-3">
        {memoizedUsers.map((user) => (
          <div key={user.id} className="flex items-start gap-3">
            {/* アバター */}
            <div 
              className="cursor-pointer"
              onClick={() => handleUserClick(user.id)}
            >
              {user.avatar_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar_image_url}
                  alt={user.display_name}
                  className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition-opacity"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hover:opacity-90 transition-opacity">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            {/* ユーザー情報 */}
            <div className="flex-1 min-w-0">
              <div 
                className="cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <p className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors truncate">
                  {user.display_name}
                </p>
                {user.professions && user.professions.length > 0 && (
                  <p className="text-xs text-gray-500 truncate">
                    {user.professions[0]}
                  </p>
                )}
                {user.bio && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {user.bio.length > 60 ? `${user.bio.substring(0, 60)}...` : user.bio}
                  </p>
                )}
              </div>
            </div>

            {/* フォローボタン */}
            <div className="flex-shrink-0">
              <FollowButton 
                targetUserId={user.id}
                compact={true}
              />
            </div>
          </div>
        ))}
      </div>

      <button 
        className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        onClick={() => router.push('/explore')}
      >
        Show more
      </button>
    </div>
  )
} 