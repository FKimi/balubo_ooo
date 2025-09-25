'use client'

import { useState, useEffect, useCallback } from 'react'
import { debounce, runInIdle } from '@/utils/performance'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui'
import { 
  TrendingUp, 
  Hash, 
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface FeaturedWork {
  id: string
  title: string
  description?: string
  banner_image_url?: string
  external_url?: string
  tags?: string[]
  roles?: string[]
  view_count: number
  created_at: string
  user: {
    id: string
    display_name: string
    avatar_image_url?: string
  }
  likes_count: number
  comments_count: number
  user_has_liked: boolean
}

interface TrendingTag {
  tag: string
  count: number
}

interface DiscoveryData {
  featured: FeaturedWork[]
  tags: TrendingTag[]
}

interface DiscoverySectionProps {
  onTagClick?: (_tag: string) => void
  onWorkClick?: (_work: FeaturedWork) => void
}

export const DiscoverySection = ({ onTagClick: _onTagClick, onWorkClick: _onWorkClick }: DiscoverySectionProps) => {
  const [data, setData] = useState<DiscoveryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  // データ取得（パフォーマンス最適化済み）
  const fetchDiscoveryData = useCallback(async () => {
    try {
      setError(null)
      // 初回のみローディング表示を出す
      if (!data) setLoading(true)

      // 重い処理をrequestIdleCallbackで実行
      await runInIdle(async () => {
        // キャッシュを避けるためのタイムスタンプを付与し、no-storeで取得
        const ts = Date.now()
        const response = await fetch(`/api/discovery/trending?type=all&ts=${ts}`, { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        if (result.success) {
          setData(result.data)
        } else {
          throw new Error(result.error || 'データ取得に失敗しました')
        }
      })
    } catch (error) {
      console.error('Discovery data fetch error:', error)
      setError(error instanceof Error ? error.message : 'データ取得エラー')
    } finally {
      setLoading(false)
    }
  }, [data])

  useEffect(() => {
    fetchDiscoveryData()

    // 30秒ごとにポーリングして最新ランキングを取得
    const intervalId = setInterval(() => {
      fetchDiscoveryData()
    }, 30000)

    // フォーカス時にも更新（デバウンス適用）
    const debouncedFetch = debounce(fetchDiscoveryData, 1000)
    const onFocus = () => debouncedFetch()
    window.addEventListener('focus', onFocus)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
    }
  }, [fetchDiscoveryData])

  // 横スクロール処理（スロットル適用）
  const scrollFeatured = useCallback((direction: 'left' | 'right') => {
    const container = document.getElementById('featured-scroll-container')
    if (container) {
      const scrollAmount = 320 // カード幅 + gap
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }, [scrollPosition])

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-80">
                    <Skeleton className="h-48 w-full rounded-xl mb-3" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-500 text-sm">データの読み込みに失敗しました</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              再読み込み
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* 今日の注目コンテンツ */}
          {data?.featured && data.featured.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#5570F3]" />
                  <h3 className="text-lg font-semibold text-gray-900">今日の注目コンテンツ</h3>
                </div>
                
                {/* スクロールボタン */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => scrollFeatured('left')}
                    className="h-8 w-8 rounded-full border border-gray-200 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => scrollFeatured('right')}
                    className="h-8 w-8 rounded-full border border-gray-200 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 横スクロール可能な注目作品 */}
              <div 
                id="featured-scroll-container"
                className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {data.featured.map((work, index) => (
                  <Card 
                    key={work.id} 
                    className="flex-shrink-0 w-80 hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-[#5570F3]/30"
                    onClick={() => _onWorkClick?.(work)}
                  >
                    <CardContent className="p-0">
                      {/* 画像とランキングバッジ */}
                      <div className="relative aspect-video bg-gradient-to-br from-[#5570F3]/5 to-[#5570F3]/10 rounded-t-xl overflow-hidden">
                        {work.banner_image_url ? (
                          <Image
                            src={work.banner_image_url}
                            alt={work.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-6xl opacity-20">🎨</div>
                          </div>
                        )}
                        
                        {/* ランキングバッジ */}
                        <div className="absolute top-3 left-3">
                          <div className={`px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                            index === 0 ? 'bg-[#5570F3]' :
                            index === 1 ? 'bg-[#4461E8]' :
                            index === 2 ? 'bg-[#3D51DD]' :
                            'bg-gray-500'
                          }`}>
                            #{index + 1}
                          </div>
                        </div>

                      </div>

                      {/* コンテンツ */}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#5570F3] transition-colors">
                          {work.title}
                        </h4>
                        
                        {work.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {work.description}
                          </p>
                        )}

                        {/* タグ */}
                        {work.tags && work.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {work.tags.slice(0, 3).map((tag, idx) => (
                              <Badge 
                                key={idx} 
                                variant="secondary" 
                                className="text-xs bg-[#5570F3]/10 text-[#5570F3] hover:bg-[#5570F3]/20 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  _onTagClick?.(tag)
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                            {work.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                +{work.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* ユーザー情報とアクション */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {work.user.avatar_image_url ? (
                              <Image
                                src={work.user.avatar_image_url}
                                alt={work.user.display_name}
                                width={20}
                                height={20}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-[#5570F3]/20 flex items-center justify-center">
                                <span className="text-[#5570F3] text-xs font-medium">
                                  {work.user.display_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-sm text-gray-600 font-medium">
                              {work.user.display_name}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Heart className={`h-3 w-3 ${work.user_has_liked ? 'fill-current text-red-500' : ''}`} />
                              {work.likes_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {work.comments_count}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* トレンドタグ */}
          {data?.tags && data.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Hash className="h-5 w-5 text-[#5570F3]" />
                <h3 className="text-lg font-semibold text-gray-900">今注目されているタグ</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.tags.map((tagItem, index) => (
                  <Button
                    key={tagItem.tag}
                    variant="ghost"
                    size="sm"
                    onClick={() => _onTagClick?.(tagItem.tag)}
                    className={`rounded-full px-4 py-2 transition-all duration-200 ${
                      index < 3 
                        ? 'bg-[#5570F3]/10 text-[#5570F3] hover:bg-[#5570F3]/20 border border-[#5570F3]/20' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {tagItem.tag}
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      index < 3 
                        ? 'bg-[#5570F3]/20 text-[#5570F3]' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tagItem.count}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
