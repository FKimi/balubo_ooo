'use client'

import { useState, useEffect } from 'react'
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
  const router = useRouter()

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        }

        // 認証されている場合はトークンを追加
        if (isAuthenticated && currentUserId) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          
          if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Supabase環境変数が設定されていません')
            return
          }
          
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(supabaseUrl, supabaseAnonKey)
          
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`
          }
        }

        const response = await fetch('/api/users/recommended?limit=3', {
          headers
        })

        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        }
      } catch (error) {
        console.error('おすすめユーザー取得エラー:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedUsers()
  }, [currentUserId, isAuthenticated])

  const handleUserClick = (userId: string) => {
    router.push(`/share/profile/${userId}`)
  }

  const handleFollowClick = (userId: string, displayName: string) => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }
    // フォロー機能は実際のプロフィールページで実装されているため、プロフィールページへ遷移
    router.push(`/share/profile/${userId}`)
  }

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

  if (users.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-bold text-gray-900">Who to follow</h3>
      </div>
      
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-start gap-3">
            {/* アバター */}
            <div 
              className="cursor-pointer"
              onClick={() => handleUserClick(user.id)}
            >
              {user.avatar_image_url ? (
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
                displayName={user.display_name}
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