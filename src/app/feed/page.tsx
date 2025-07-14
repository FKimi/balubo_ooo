'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { RecommendedUsers } from '@/features/feed'
import { 
  Share, 
  ExternalLink,
  User
} from 'lucide-react'
import { EmptyState } from '@/components/common'
import { TabNavigation } from '@/components/ui/TabNavigation'
import { Skeleton } from '@/components/ui'

// Supabaseクライアントをコンポーネント外で初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase環境変数が設定されていません')
}

const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

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



export default function FeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'works' | 'inputs'>('works')
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [_stats, setStats] = useState({ total: 0, works: 0, inputs: 0, unique_users: 0 })
  const [_total, setTotal] = useState(0)

  const router = useRouter()
  
  useEffect(() => {
    const checkAuthAndFetchFeed = async () => {
      const startTime = Date.now()
      console.log('フィード画面: データ取得開始')
      
      try {
        // 認証状態を確認
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('フィード画面: 認証エラー:', authError)
          setError('認証エラーが発生しました')
          return
        }

        // 認証状態を設定
        setIsAuthenticated(!!user)
        setCurrentUser(user)

        console.log('フィード画面: 認証確認完了、フィードデータ取得開始', { isAuthenticated: !!user })

        // フィードデータを取得（タイムアウトを20秒に延長）
        const feedTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('フィード取得タイムアウト')), 20000) // 20秒に延長
        })

        const feedPromise = fetch('/api/feed', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
        })

        const response = await Promise.race([feedPromise, feedTimeout]) as Response

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const feedData = await response.json()
        
        const processingTime = Date.now() - startTime
        console.log('フィード画面: データ取得成功', {
          items: feedData.items?.length || 0,
          processingTime: `${processingTime}ms`
        })

        if (feedData.items && Array.isArray(feedData.items)) {
          setFeedItems(feedData.items)
          setStats(feedData.stats || { total: 0, works: 0, inputs: 0, unique_users: 0 })
          setTotal(feedData.total || 0)
          setError(null)
        } else {
          console.warn('フィード画面: 無効なデータ形式:', feedData)
          setFeedItems([])
          setStats({ total: 0, works: 0, inputs: 0, unique_users: 0 })
          setTotal(0)
          setError('データ形式エラー')
        }

      } catch (error) {
        const processingTime = Date.now() - startTime
        console.error('フィード画面: データ取得エラー:', error)
        console.log('処理時間:', processingTime)
        
        setError(error instanceof Error ? error.message : 'データ取得エラー')
        setFeedItems([])
        setStats({ total: 0, works: 0, inputs: 0, unique_users: 0 })
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchFeed()
  }, [])

  const filteredItems = feedItems.filter(item => {
    if (activeTab === 'works') return item.type === 'work'
    if (activeTab === 'inputs') return item.type === 'input'
    return true
  })

  const tabConfigs = [
    { key: 'works', label: '作品' },
    { key: 'inputs', label: 'インプット' },
  ]

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

  // いいね処理
  const handleLike = async (itemId: string, itemType: 'work' | 'input') => {
    console.log('いいね処理開始:', { itemId, itemType, isAuthenticated })
    
    if (!isAuthenticated) {
      console.log('認証されていないため、ログインページにリダイレクト')
      router.push('/login')
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const authToken = session?.access_token

      if (!authToken) {
        console.log('認証トークンが取得できません')
        router.push('/login')
        return
      }

      console.log('認証トークン取得成功')

      // 対象アイテムの現在の状態を確認
      const targetItem = feedItems.find(item => item.id === itemId)
      if (!targetItem) {
        console.error('対象アイテムが見つかりません:', itemId)
        return
      }

      const isCurrentlyLiked = targetItem.user_has_liked
      console.log('現在のいいね状態:', { itemId, isCurrentlyLiked })

      if (isCurrentlyLiked) {
        console.log('いいね削除処理開始')
        // いいね削除
        const response = await fetch(`/api/likes?workId=${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        })

        console.log('いいね削除レスポンス:', { status: response.status, ok: response.ok })

        if (response.ok) {
          console.log('いいね削除成功、楽観的更新実行')
          // 楽観的更新
          setFeedItems(prev => prev.map(item => 
            item.id === itemId 
              ? { 
                  ...item, 
                  likes_count: Math.max(0, (item.likes_count || 0) - 1),
                  user_has_liked: false
                }
              : item
          ))
        } else {
          console.error('いいね削除エラー:', response.status)
        }
      } else {
        console.log('いいね追加処理開始')
        // いいね追加
        const response = await fetch('/api/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            workId: itemId,
            targetType: itemType
          })
        })

        console.log('いいね追加レスポンス:', { status: response.status, ok: response.ok })

        if (response.ok) {
          console.log('いいね追加成功、楽観的更新実行')
          // 楽観的更新
          setFeedItems(prev => prev.map(item => 
            item.id === itemId 
              ? { 
                  ...item, 
                  likes_count: (item.likes_count || 0) + 1,
                  user_has_liked: true
                }
              : item
          ))
        } else {
          const errorData = await response.json()
          console.error('いいね追加エラー:', response.status, errorData)
        }
      }
    } catch (error) {
      console.error('いいね処理ネットワークエラー:', error)
    }
  }

  

  // コメント一覧を取得
  const fetchComments = async (itemId: string) => {
    setLoadingComments(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const authToken = session?.access_token

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch(`/api/comments?workId=${itemId}`, {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      } else {
        console.error('コメント取得エラー:', response.status)
        setComments([])
      }
    } catch (error) {
      console.error('コメント取得ネットワークエラー:', error)
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }

  // コメント投稿（修正版）
  const handleSubmitComment = async (itemId: string) => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }

    if (!newComment.trim() || isSubmittingComment) return

    // 対象アイテムの情報を取得
    const targetItem = feedItems.find(item => item.id === itemId)
    if (!targetItem) {
      alert('対象のアイテムが見つかりません')
      return
    }

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
          content: newComment.trim(),
          targetType: targetItem.type // 'work' または 'input'
        })
      })

      if (response.ok) {
        // 楽観的更新
        setFeedItems(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, comments_count: (item.comments_count || 0) + 1 }
            : item
        ))

        // 選択中のアイテムも更新
        if (selectedItem && selectedItem.id === itemId) {
          setSelectedItem(prev => prev ? {
            ...prev,
            comments_count: (prev.comments_count || 0) + 1
          } : null)
        }

        setNewComment('')
        
        // コメント一覧を再取得
        await fetchComments(itemId)
        
        // 最新のコメント数を取得
        // setTimeout(() => fetchItemStats(itemId), 500) // この行は削除
      } else {
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

  // コメントモーダルを開く
  const openCommentModal = async (itemId: string) => {
    setShowCommentModal(itemId)
    await fetchComments(itemId)
  }

  // コメントモーダルを閉じる
  const closeCommentModal = () => {
    setShowCommentModal(null)
    setComments([])
    setNewComment('')
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
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto">
          {/* スケルトンヘッダー */}
          <div className="border-x border-b border-gray-200">
            <Skeleton className="h-14 w-full" />
          </div>
          {/* スケルトンフィードアイテム */}
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="border-x border-b border-gray-200 p-4 max-w-4xl mx-auto">
              <div className="flex items-start space-x-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
              <div className="ml-12 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto">
        <div className="flex">
          {/* メインフィード - 横幅を広げて中央配置 */}
          <div className="flex-1 max-w-4xl mx-auto border-x border-gray-200">
        {/* タブナビゲーション */}
        <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10 mb-0 p-2">
          <TabNavigation
            tabs={tabConfigs}
            activeTab={activeTab}
            onTabChange={(key) => setActiveTab(key as any)}
            className="bg-transparent"
          />
        </div>

        {/* 未ログインユーザー向けバナー */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border-b border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-900">Baluboへようこそ！</p>
                <p className="text-sm text-blue-700">クリエイターのポートフォリオを発見しよう</p>
              </div>
              <Button 
                onClick={() => router.push('/auth')}
                className="rounded-full px-4 py-2 font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                ログイン
              </Button>
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
                      <Image
                        src={item.user.avatar_image_url}
                        alt={item.user.display_name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hover:opacity-90 transition-opacity">
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
                          ? 'bg-blue-100 text-blue-700' 
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
                        router.push(`/inputs/${item.id}`)
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
                            className="text-blue-600 text-sm font-medium"
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
                    <Image
                       src={(item.banner_image_url || item.cover_image_url) as string}
                       alt={item.title}
                       width={800}
                       height={256}
                       className="w-full max-w-lg h-64 object-cover rounded-2xl cursor-pointer hover:opacity-95 transition-opacity border border-gray-200"
                       onClick={(e) => {
                         e.stopPropagation()
                         if (item.type === 'work') {
                           router.push(`/works/${item.id}`)
                         } else {
                           router.push(`/inputs/${item.id}`)
                         }
                       }}
                     />
                  </div>
                )}

                {/* アクションボタン */}
                <div className="ml-12 flex items-center gap-4 text-gray-500">
                  {/* コメント */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="コメントする"
                      className="hover:text-blue-500 hover:bg-blue-50 group"
                      onClick={(e) => {
                        e.stopPropagation()
                        openCommentModal(item.id)
                      }}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.93-6.94c-.042-.3-.07-.611-.07-.94v-.12A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z" />
                      </svg>
                    </Button>
                    <span className="text-sm">{item.comments_count || 0}</span>
                  </div>
                  {/* いいね */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="いいね"
                      className={`transition-colors group ${
                        item.user_has_liked 
                          ? 'text-red-500 hover:bg-red-50' 
                          : 'hover:text-red-500 hover:bg-red-50'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(item.id, item.type)
                      }}
                    >
                      <svg className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                        item.user_has_liked ? 'fill-current' : ''
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </Button>
                    <span className="text-sm">{item.likes_count || 0}</span>
                  </div>
                  {/* シェア */}
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="シェア"
                    className="hover:text-green-500 hover:bg-green-50 group"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare(item)
                    }}
                  >
                    <Share className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 border-b border-gray-200">
            <EmptyState
              title={error ? 'データの取得に失敗しました' :
                activeTab === 'works' ? '作品がまだありません' :
                activeTab === 'inputs' ? 'インプットがまだありません' :
                'フィードが空です'}
              message={error ? 'サーバーに接続できませんでした。しばらくしてから再度お試しください。' :
                !isAuthenticated ? 'ログインすると、クリエイターのポートフォリオを閲覧できます。' :
                activeTab === 'works' ? 'クリエイターの作品が投稿されるとここに表示されます。' :
                activeTab === 'inputs' ? 'クリエイターのインプットが投稿されるとここに表示されます。' :
                'まだ投稿がありません。'}
              ctaLabel={error ? '再読み込み' :
                !isAuthenticated ? 'ログイン' :
                activeTab === 'works' ? '作品を投稿' :
                activeTab === 'inputs' ? 'インプットを追加' : ''}
              onCtaClick={error ? () => window.location.reload() :
                !isAuthenticated ? () => router.push('/auth') :
                activeTab === 'works' ? () => router.push('/works/new') :
                activeTab === 'inputs' ? () => router.push('/inputs/new') : () => {}}
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">
                  {error ? '⚠️' : activeTab === 'works' ? '🎨' : activeTab === 'inputs' ? '📚' : '📱'}
                </span>
              </div>
            </EmptyState>
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
                      <Image
                         src={selectedItem.user.avatar_image_url as string}
                         alt={selectedItem.user.display_name}
                         width={40}
                         height={40}
                         className="rounded-full object-cover hover:ring-2 hover:ring-blue-300 transition-all duration-200"
                       />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition-all duration-200">
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
                <Button
                  variant="ghost"
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedItem.title}</h2>
              
              {selectedItem.description && (
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">{selectedItem.description}</p>
              )}

              {(selectedItem.banner_image_url || selectedItem.cover_image_url) && (
                <Image
                   src={(selectedItem.banner_image_url || selectedItem.cover_image_url) as string}
                   alt={selectedItem.title}
                   width={1000}
                   height={320}
                   className="w-full h-80 object-cover rounded-xl mb-6 shadow-lg"
                 />
              )}

              {/* アクションボタン */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="コメントする"
                    className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 group"
                    onClick={() => openCommentModal(selectedItem.id)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.93-6.94c-.042-.3-.07-.611-.07-.94v-.12A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z" />
                    </svg>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="いいね"
                    className={`transition-colors group ${
                      selectedItem.user_has_liked 
                        ? 'text-red-500' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                    onClick={() => handleLike(selectedItem.id, selectedItem.type)}
                  >
                    <svg className={`h-5 w-5 ${
                      selectedItem.user_has_liked ? 'fill-current' : ''
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="シェア"
                    className="text-gray-500 hover:text-green-500 hover:bg-green-50 group"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare(selectedItem)
                    }}
                  >
                    <Share className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={isAuthenticated ? 'フォロー' : 'ログイン'}
                    className={`px-6 py-3 font-semibold rounded-full transition-all duration-200 ${
                      isAuthenticated
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => {
                      if (!isAuthenticated) router.push('/auth')
                    }}
                  >
                    {isAuthenticated ? 'フォロー' : 'ログイン'}
                  </Button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">コメント</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="閉じる"
                  className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  onClick={closeCommentModal}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
            
            {/* コメント一覧 */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {loadingComments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600"></div>
                  <span className="ml-2 text-gray-600">読み込み中...</span>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {comment.user?.avatar_image_url ? (
                          <Image
                             src={comment.user.avatar_image_url as string}
                             alt={comment.user.display_name || 'User'}
                             width={32}
                             height={32}
                             className="rounded-full object-cover"
                           />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {(comment.user?.display_name || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {comment.user?.display_name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(comment.created_at)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="まだコメントがありません" message="最初のコメントを投稿してみましょう">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.93-6.94c-.042-.3-.07-.611-.07-.94v-.12A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z" />
                    </svg>
                  </div>
                </EmptyState>
              )}
            </div>

            {/* コメント投稿フォーム */}
            {isAuthenticated ? (
              <div className="p-4 border-t border-gray-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (showCommentModal) {
                      handleSubmitComment(showCommentModal)
                    }
                  }}
                  className="space-y-3"
                >
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="コメントを入力..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    disabled={isSubmittingComment}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="キャンセル"
                      onClick={closeCommentModal}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      aria-label="投稿"
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingComment ? '投稿中...' : '投稿'}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-4 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm mb-3">コメントを投稿するにはログインが必要です</p>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="ログイン"
                  onClick={() => {
                    closeCommentModal()
                    router.push('/auth')
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  ログイン
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 