'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { RecommendedUsers } from '@/components/feed/RecommendedUsers'
import { 
  Heart, 
  Share, 
  ExternalLink,
  Calendar,
  Tag,
  Users,
  TrendingUp,
  Edit,
  BookOpen,
  BarChart3,
  Users2,
  User,
  LogIn,
  UserPlus
} from 'lucide-react'

interface User {
  id: string
  display_name: string
  avatar_image_url?: string
}

interface FeedItem {
  id: string
  type: 'work' | 'input'
  title: string
  description?: string
  external_url?: string
  author_creator?: string
  rating?: number
  tags?: string[]
  roles?: string[]
  banner_image_url?: string
  cover_image_url?: string
  created_at: string
  user: User
  likes_count?: number
  comments_count?: number
  user_has_liked?: boolean
}

interface FeedStats {
  total: number
  works: number
  inputs: number
  unique_users: number
}

export default function FeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'works' | 'inputs'>('works')
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null)
  const [stats, setStats] = useState<FeedStats>({ total: 0, works: 0, inputs: 0, unique_users: 0 })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const router = useRouter()
  
  // Supabase環境変数の確認
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase環境変数が設定されていません')
    // フォールバック処理または早期リターン
  }
  
  const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
  )

  useEffect(() => {
    async function checkAuthAndFetchFeed() {
      try {
        setLoading(true)
        setError(null)

        // 認証状態を確認（エラーを無視）
        let authToken = null
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          if (session && session.access_token && !sessionError) {
            setIsAuthenticated(true)
            setCurrentUser(session.user)
            authToken = session.access_token
          }
        } catch (authError) {
          console.log('認証確認エラー（続行）:', authError)
        }

        // フィードデータを取得
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`
        }

        const response = await fetch('/api/feed', {
          method: 'GET',
          headers
        })

        if (!response.ok) {
          throw new Error(`フィードの取得に失敗しました: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }

        console.log('フィードデータ取得成功:', {
          items: data.items?.length || 0,
          stats: data.stats,
          debug: data.debug
        })

        setFeedItems(data.items || [])
        setStats(data.stats || { total: 0, works: 0, inputs: 0, unique_users: 0 })
        
      } catch (error) {
        console.error('フィード取得エラー:', error)
        setError(error instanceof Error ? error.message : 'フィードの取得中にエラーが発生しました')
        
        // エラーが発生した場合のフォールバック（デモデータ）
        const fallbackItems: FeedItem[] = [
          {
            id: 'fallback-work-1',
            type: 'work',
            title: '🚀 新しいプロダクトデザイン',
            description: 'ユーザー体験を重視したモバイルファーストなプロダクトデザインを制作しました。',
            tags: ['プロダクトデザイン', 'UI/UX', 'モバイル'],
            roles: ['プロダクトデザイナー'],
            banner_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            user: {
              id: 'fallback-user-1',
              display_name: 'サンプルデザイナー',
              avatar_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
            }
          },
          {
            id: 'fallback-input-1',
            type: 'input',
            title: '📖 UXデザインの法則',
            description: 'ユーザビリティとアクセシビリティについて深く学べる良書でした。',
            author_creator: 'Jon Yablonski',
            rating: 5,
            tags: ['UXデザイン', '読書', 'デザイン'],
            cover_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            user: {
              id: 'fallback-user-2',
              display_name: 'サンプル読書家',
              avatar_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80'
            }
          }
        ]
        
        setFeedItems(fallbackItems)
        setStats({
          total: fallbackItems.length,
          works: fallbackItems.filter(item => item.type === 'work').length,
          inputs: fallbackItems.filter(item => item.type === 'input').length,
          unique_users: new Set(fallbackItems.map(item => item.user.id)).size
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchFeed()
  }, [])

  const filteredItems = feedItems.filter(item => {
    if (activeTab === 'all') return true
    if (activeTab === 'works') return item.type === 'work'
    if (activeTab === 'inputs') return item.type === 'input'
    return true
  })

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return '今'
    if (diffInHours < 24) return `${diffInHours}時間前`
    if (diffInDays < 7) return `${diffInDays}日前`
    return date.toLocaleDateString('ja-JP')
  }

  // いいね機能
  const handleLike = async (itemId: string, isCurrentlyLiked: boolean) => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const authToken = session?.access_token

      if (!authToken) {
        router.push('/auth')
        return
      }

      const url = isCurrentlyLiked ? `/api/likes?workId=${itemId}` : '/api/likes'
      const method = isCurrentlyLiked ? 'DELETE' : 'POST'
      
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }

      if (!isCurrentlyLiked) {
        fetchOptions.body = JSON.stringify({ workId: itemId })
      }

      const response = await fetch(url, fetchOptions)

      if (response.ok) {
        // 楽観的更新
        setFeedItems(prev => prev.map(item => 
          item.id === itemId 
            ? { 
                ...item, 
                user_has_liked: !isCurrentlyLiked,
                likes_count: (item.likes_count || 0) + (isCurrentlyLiked ? -1 : 1)
              }
            : item
        ))
      } else {
        // エラーレスポンスの詳細を取得
        const errorData = await response.json()
        console.error('いいねAPIエラー:', {
          status: response.status,
          errorData,
          itemId,
          isCurrentlyLiked
        })
        alert(`いいね操作に失敗しました: ${errorData.details || errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('いいねネットワークエラー:', error)
      alert('ネットワークエラーが発生しました')
    }
  }

  // コメント投稿
  const handleSubmitComment = async (itemId: string) => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }

    if (!newComment.trim() || isSubmittingComment) return

    setIsSubmittingComment(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const authToken = session?.access_token

      if (!authToken) {
        router.push('/auth')
        return
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          workId: itemId,
          content: newComment.trim()
        })
      })

      if (response.ok) {
        // コメント数を更新
        setFeedItems(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, comments_count: (item.comments_count || 0) + 1 }
            : item
        ))
        setNewComment('')
        setShowCommentModal(null)
      } else {
        // エラーレスポンスの詳細を取得
        const errorData = await response.json()
        console.error('コメントAPIエラー:', {
          status: response.status,
          errorData,
          itemId
        })
        alert(`コメント投稿に失敗しました: ${errorData.details || errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('コメントネットワークエラー:', error)
      alert('ネットワークエラーが発生しました')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // シェア機能
  const handleShare = async (item: FeedItem) => {
    const shareUrl = `${window.location.origin}/works/${item.id}`
    const shareText = `${item.title} - ${item.user.display_name}のポートフォリオをチェック！`

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: shareUrl
        })
      } catch (error) {
        console.log('シェアがキャンセルされました')
      }
    } else {
      // フォールバック: クリップボードにコピー
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        alert('リンクをクリップボードにコピーしました！')
      } catch (error) {
        console.error('コピーに失敗しました:', error)
      }
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 73px)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 font-medium">フィードを読み込み中...</p>
            <p className="text-gray-400 text-sm mt-2">クリエイターの最新作品をお届けします</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto">
        <div className="flex">
          {/* メインフィード */}
          <div className="flex-1 max-w-2xl border-x border-gray-200">
        {/* タブナビゲーション */}
        <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10 mb-0">
          <div className="flex">
            {[
              { key: 'works', label: '作品' },
              { key: 'inputs', label: 'インプット' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-4 text-center font-medium transition-colors relative hover:bg-gray-50 ${
                  activeTab === tab.key || (activeTab === 'all' && tab.key === 'works')
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}
              >
                <span className="text-sm font-semibold">{tab.label}</span>
                {(activeTab === tab.key || (activeTab === 'all' && tab.key === 'works')) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 未ログインユーザー向けバナー */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border-b border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-900">Baluboへようこそ！</p>
                <p className="text-sm text-blue-700">クリエイターのポートフォリオを発見しよう</p>
              </div>
              <button 
                onClick={() => router.push('/auth')}
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors text-sm"
              >
                ログイン
              </button>
            </div>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-800 text-sm font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* フィードアイテム */}
        {filteredItems.length > 0 ? (
          <div className="bg-white">
            {filteredItems.map((item, index) => (
              <article
                key={item.id}
                className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                  index !== filteredItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {/* ユーザー情報ヘッダー */}
                <div className="flex items-start space-x-3 mb-3">
                  <div 
                    className="relative cursor-pointer group flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      // 自分の投稿の場合は自分のプロフィールページに遷移
                      if (currentUser && item.user.id === currentUser.id) {
                        router.push('/profile')
                      } else {
                        router.push(`/share/profile/${item.user.id}`)
                      }
                    }}
                  >
                    {item.user.avatar_image_url ? (
                      <img
                        src={item.user.avatar_image_url}
                        alt={item.user.display_name}
                        className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hover:opacity-90 transition-opacity">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p 
                        className="font-bold text-gray-900 truncate cursor-pointer hover:underline text-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // 自分の投稿の場合は自分のプロフィールページに遷移
                          if (currentUser && item.user.id === currentUser.id) {
                            router.push('/profile')
                          } else {
                            router.push(`/share/profile/${item.user.id}`)
                          }
                        }}
                      >
                        {item.user.display_name}
                      </p>
                      <span className="text-gray-500 text-sm">·</span>
                      <span className="text-gray-500 text-sm">
                        {formatTimeAgo(item.created_at)}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        item.type === 'work' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.type === 'work' ? '作品' : 'インプット'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* コンテンツ */}
                <div className="ml-12 mb-3">
                  <div 
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (item.type === 'work') {
                        router.push(`/works/${item.id}`)
                      } else {
                        setSelectedItem(item)
                      }
                    }}
                  >
                    <p className="text-gray-900 text-sm leading-relaxed mb-2">
                      {item.description && item.description.length > 280 
                        ? `${item.description.substring(0, 280)}...` 
                        : item.description || item.title
                      }
                    </p>

                    {/* 追加情報 */}
                    {item.type === 'input' && item.author_creator && (
                      <p className="text-sm text-gray-500 mb-2">
                        著者: {item.author_creator}
                      </p>
                    )}

                    {item.type === 'input' && item.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < item.rating! ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">{item.rating}/5</span>
                      </div>
                    )}

                    {/* タグ */}
                    {(item.tags && item.tags.length > 0) && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-blue-500 text-sm hover:underline cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-gray-500 text-sm">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* 役割（作品の場合） */}
                    {item.type === 'work' && item.roles && item.roles.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.roles.slice(0, 3).map((role, index) => (
                          <span
                            key={index}
                            className="text-purple-600 text-sm font-medium"
                          >
                            {role}{index < Math.min(item.roles!.length, 3) - 1 ? ' · ' : ''}
                          </span>
                        ))}
                        {item.roles.length > 3 && (
                          <span className="text-gray-500 text-sm">
                            +{item.roles.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 画像 */}
                {(item.banner_image_url || item.cover_image_url) && (
                  <div className="ml-12 mb-3">
                    <img
                      src={item.banner_image_url || item.cover_image_url}
                      alt={item.title}
                      className="w-full max-w-lg h-64 object-cover rounded-2xl cursor-pointer hover:opacity-95 transition-opacity border border-gray-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (item.type === 'work') {
                          router.push(`/works/${item.id}`)
                        } else {
                          setSelectedItem(item)
                        }
                      }}
                    />
                  </div>
                )}

                {/* アクションボタン */}
                <div className="ml-12 flex items-center space-x-12">
                  <button 
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group p-2 rounded-full hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowCommentModal(item.id)
                    }}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.93-6.94c-.042-.3-.07-.611-.07-.94v-.12A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z" />
                    </svg>
                    <span className="text-sm text-gray-500">{item.comments_count || 0}</span>
                  </button>
                  
                  <button 
                    className={`flex items-center space-x-2 transition-colors group p-2 rounded-full ${
                      item.user_has_liked 
                        ? 'text-red-500 hover:bg-red-50' 
                        : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLike(item.id, item.user_has_liked || false)
                    }}
                  >
                    <svg className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      item.user_has_liked ? 'fill-current' : ''
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm">{item.likes_count || 0}</span>
                  </button>
                  
                  <button 
                    className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group p-2 rounded-full hover:bg-green-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare(item)
                    }}
                  >
                    <Share className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center border-b border-gray-200">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">
                  {activeTab === 'works' ? '🎨' : activeTab === 'inputs' ? '📚' : '📱'}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {activeTab === 'works' ? '作品がまだありません' : 
               activeTab === 'inputs' ? 'インプットがまだありません' : 
               'フィードが空です'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              {activeTab === 'works' ? 'クリエイターの作品が投稿されるとここに表示されます。' : 
               activeTab === 'inputs' ? 'クリエイターのインプットが投稿されるとここに表示されます。' : 
               'まだ投稿がありません。'}
            </p>
            {isAuthenticated && (
              <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => router.push('/works/new')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  作品を投稿
                </button>
                <button 
                  onClick={() => router.push('/inputs/new')}
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors text-sm font-semibold"
                >
                  インプットを追加
                </button>
              </div>
            )}
          </div>
        )}


          </div>

          {/* 右サイドバー - デスクトップのみ表示 */}
          <div className="hidden lg:block w-80 flex-shrink-0 p-4">
            <div className="sticky top-[97px] space-y-4">
              <RecommendedUsers 
                currentUserId={currentUser?.id}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="cursor-pointer"
                    onClick={() => {
                      // 自分の投稿の場合は自分のプロフィールページに遷移
                      if (currentUser && selectedItem.user.id === currentUser.id) {
                        router.push('/profile')
                      } else {
                        router.push(`/share/profile/${selectedItem.user.id}`)
                      }
                    }}
                  >
                    {selectedItem.user.avatar_image_url ? (
                      <img
                        src={selectedItem.user.avatar_image_url}
                        alt={selectedItem.user.display_name}
                        className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-blue-300 transition-all duration-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition-all duration-200">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p 
                      className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      onClick={() => {
                        // 自分の投稿の場合は自分のプロフィールページに遷移
                        if (currentUser && selectedItem.user.id === currentUser.id) {
                          router.push('/profile')
                        } else {
                          router.push(`/share/profile/${selectedItem.user.id}`)
                        }
                      }}
                    >
                      {selectedItem.user.display_name}
                    </p>
                    <p className="text-sm text-gray-600">{formatTimeAgo(selectedItem.created_at)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedItem.title}</h2>
              
              {selectedItem.description && (
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">{selectedItem.description}</p>
              )}

              {(selectedItem.banner_image_url || selectedItem.cover_image_url) && (
                <img
                  src={selectedItem.banner_image_url || selectedItem.cover_image_url}
                  alt={selectedItem.title}
                  className="w-full h-80 object-cover rounded-xl mb-6 shadow-lg"
                />
              )}

              {/* アクションボタン */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-8">
                  <button 
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                    onClick={() => setShowCommentModal(selectedItem.id)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.93-6.94c-.042-.3-.07-.611-.07-.94v-.12A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z" />
                    </svg>
                    <span className="text-sm">{selectedItem.comments_count || 0}</span>
                  </button>
                  
                  <button 
                    className={`flex items-center space-x-2 transition-colors ${
                      selectedItem.user_has_liked 
                        ? 'text-red-500' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                    onClick={() => handleLike(selectedItem.id, selectedItem.user_has_liked || false)}
                  >
                    <svg className={`h-5 w-5 ${
                      selectedItem.user_has_liked ? 'fill-current' : ''
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm">{selectedItem.likes_count || 0}</span>
                  </button>
                  
                  <button 
                    className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                    onClick={() => handleShare(selectedItem)}
                  >
                    <Share className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button className={`px-6 py-3 font-semibold rounded-full transition-all duration-200 ${
                    isAuthenticated
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}>
                    {isAuthenticated ? 'フォロー' : 'ログイン'}
                  </button>
                  {selectedItem.external_url && (
                    <a
                      href={selectedItem.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <ExternalLink className="h-5 w-5" />
                      外部リンク
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* コメントモーダル */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">コメントを投稿</h3>
                <button
                  onClick={() => {
                    setShowCommentModal(null)
                    setNewComment('')
                  }}
                  className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">コメントするにはログインが必要です</p>
                  <button
                    onClick={() => router.push('/auth')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    ログイン
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmitComment(showCommentModal)
                }}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="感想やアドバイスを書いてみませんか..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    disabled={isSubmittingComment}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      {newComment.length}/280
                    </span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCommentModal(null)
                          setNewComment('')
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmittingComment || newComment.length > 280}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${
                          newComment.trim() && !isSubmittingComment && newComment.length <= 280
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isSubmittingComment ? '投稿中...' : '投稿'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 