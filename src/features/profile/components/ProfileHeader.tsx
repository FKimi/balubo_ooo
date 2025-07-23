'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShareProfileButton } from './ShareProfileButton'
import { FollowStats } from '@/features/follow/components/FollowStats'

interface ProfileHeaderProps {
  displayName: string
  title?: string
  bio: string
  location: string
  websiteUrl: string
  backgroundImageUrl: string
  avatarImageUrl: string
  isProfileEmpty: boolean
  hasCustomBackground: boolean
  hasCustomAvatar: boolean
  userId?: string | undefined
  slug?: string
  portfolioVisibility?: string
}

export function ProfileHeader({
  displayName,
  title,
  bio,
  location,
  websiteUrl,
  backgroundImageUrl,
  avatarImageUrl,
  isProfileEmpty,
  hasCustomBackground,
  hasCustomAvatar,
  userId,
  slug,
  portfolioVisibility
}: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      {/* 背景バナー */}
      <div className="relative h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden">
        {hasCustomBackground && backgroundImageUrl ? (
          <Image src={backgroundImageUrl} alt="プロフィール背景" fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />
        )}
        {/* 薄いオーバーレイで文字可読性確保 */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* メインカード */}
      <div className="-mt-20 sm:-mt-24 relative">
        <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden w-full">
          {/* カードは純白背景に */}
          <div className="absolute inset-0 bg-white" />

          {/* コンテンツ */}
          <div className="relative p-6 flex flex-col sm:flex-row gap-6">
            {/* アバター */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-md">
                {hasCustomAvatar ? (
                  <Image src={avatarImageUrl} alt="プロフィール画像" fill sizes="96px" className="object-cover object-top" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-400">
                    {displayName ? displayName.charAt(0) : 'N'}
                  </span>
                )}
              </div>
            </div>

            {/* 中央情報 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-bold text-gray-900 truncate max-w-xs sm:max-w-none">
                  {displayName || 'ユーザー'}
                </h1>
                {title && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                    {title}
                  </span>
                )}
              </div>
              {bio && (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 max-w-2xl">
                  {bio}
                </p>
              )}

              {/* 統計 */}
              <div className="mt-4 flex items-center gap-6 text-sm text-gray-700">
                {userId && <FollowStats userId={userId} />}
                {/* 場所やURLはオプションで表示 */}
                {location && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{location}</span>
                  </div>
                )}

                {websiteUrl && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px] sm:max-w-none">
                      {websiteUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* 右側ボタン群 */}
            <div className="flex flex-col items-end gap-3">
              {portfolioVisibility === 'public' && userId && (
                <ShareProfileButton userId={userId} slug={slug} displayName={displayName} />
              )}
              <Link href="/profile/edit">
                <Button variant="outline" size="sm" className="px-4 py-2 text-sm">
                  プロフィール編集
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 