'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Share, 
  ExternalLink,
  User,
  Heart,
  MessageCircle,
  Eye
} from 'lucide-react'

interface WorkCardProps {
  work: {
    id: string
    type: 'work'
    title: string
    description?: string
    external_url?: string
    tags?: string[]
    roles?: string[]
    banner_image_url?: string
    created_at: string
    user: {
      id: string
      display_name: string
      avatar_image_url?: string
    }
    likes_count?: number
    comments_count?: number
    user_has_liked?: boolean
  }
  currentUser?: any
  isAuthenticated: boolean
  onLike: (workId: string, workType: 'work') => void
  onShare: (work: any) => void
  onOpenComments: (workId: string) => void
}

export function WorkCard({ 
  work, 
  currentUser, 
  isAuthenticated, 
  onLike, 
  onShare, 
  onOpenComments 
}: WorkCardProps) {
  const router = useRouter()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentUser && work.user.id === currentUser.id) {
      router.push('/profile')
    } else {
      router.push(`/share/profile/${work.user.id}`)
    }
  }

  const handleWorkClick = () => {
    router.push(`/works/${work.id}`)
  }

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

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
      {/* 作品画像 */}
      <div 
        className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden"
        onClick={handleWorkClick}
      >
        {work.banner_image_url && !imageError ? (
          <>
            <Image
              src={work.banner_image_url}
              alt={work.title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-2xl">🎨</span>
              </div>
              <p className="text-sm font-medium">{work.title}</p>
            </div>
          </div>
        )}

        {/* ホバー時のオーバーレイ */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white bg-opacity-90 hover:bg-white rounded-full shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  onShare(work)
                }}
              >
                <Share className="h-4 w-4 text-gray-700" />
              </Button>
              {work.external_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white bg-opacity-90 hover:bg-white rounded-full shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(work.external_url, '_blank')
                  }}
                >
                  <ExternalLink className="h-4 w-4 text-gray-700" />
                </Button>
              )}
            </div>
          </div>

          {/* 画像中央のビュー詳細ボタン */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="ghost"
              className="bg-white bg-opacity-90 hover:bg-white rounded-full px-6 py-2 shadow-lg"
              onClick={handleWorkClick}
            >
              <Eye className="h-4 w-4 mr-2" />
              詳細を見る
            </Button>
          </div>
        </div>

        {/* タグ表示（左下） */}
        {work.tags && work.tags.length > 0 && (
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex flex-wrap gap-1">
              {work.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-white bg-opacity-90 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {work.tags.length > 2 && (
                <span className="bg-white bg-opacity-90 text-gray-700 text-xs px-2 py-1 rounded-full">
                  +{work.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* カード下部の情報 */}
      <div className="p-4">
        {/* 作品タイトル */}
        <h3 
          className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleWorkClick}
        >
          {work.title}
        </h3>

        {/* 作品の説明 */}
        {work.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {work.description}
          </p>
        )}

        {/* 役割 */}
        {work.roles && work.roles.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {work.roles.slice(0, 3).map((role, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        )}

        {/* ユーザー情報と統計 */}
        <div className="flex items-center justify-between">
          {/* ユーザー情報 */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleUserClick}
          >
            {work.user.avatar_image_url ? (
              <Image
                src={work.user.avatar_image_url}
                alt={work.user.display_name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {work.user.display_name}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimeAgo(work.created_at)}
              </p>
            </div>
          </div>

          {/* アクション統計 */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 transition-colors ${
                work.user_has_liked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onLike(work.id, work.type)
              }}
            >
              <Heart className={`h-4 w-4 ${work.user_has_liked ? 'fill-current' : ''}`} />
              <span className="ml-1 text-xs">{work.likes_count || 0}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onOpenComments(work.id)
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="ml-1 text-xs">{work.comments_count || 0}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
