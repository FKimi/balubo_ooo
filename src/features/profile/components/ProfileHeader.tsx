'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShareProfileButton } from './ShareProfileButton'
import { FollowStats } from '@/features/follow/components/FollowStats'
import React from 'react'

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
  rightSlot?: React.ReactNode
}

export function ProfileHeader({
  displayName,
  title,
  bio,
  location,
  websiteUrl,
  backgroundImageUrl,
  avatarImageUrl,
  isProfileEmpty: _isProfileEmpty,
  hasCustomBackground: _hasCustomBackground,
  hasCustomAvatar: _hasCustomAvatar,
  userId,
  slug,
  portfolioVisibility,
  rightSlot: _rightSlot
}: ProfileHeaderProps) {
  // Supabaseストレージの相対パスの場合はフルURLを付与、既にフルURLの場合はそのまま使用
  const resolvedBgUrl = backgroundImageUrl && backgroundImageUrl.trim()
    ? (backgroundImageUrl.startsWith('/storage')
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${backgroundImageUrl}`
        : backgroundImageUrl)
    : ''

  // --- DEBUGGING ---
  console.log('[ProfileHeader] Raw backgroundImageUrl prop:', backgroundImageUrl);
  console.log('[ProfileHeader] Resolved background URL for style:', resolvedBgUrl);
  // --- END DEBUGGING ---

  const resolvedAvatarUrl = avatarImageUrl && avatarImageUrl.trim()
    ? (avatarImageUrl.startsWith('/storage')
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${avatarImageUrl}`
        : avatarImageUrl)
    : ''



  return (
    <div className="mb-8">
      {/* X風プロフィールヘッダー */}
      <div className="relative w-full">
        {/* 背景画像 - X風のカバー画像 */}
        <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full overflow-hidden">
          {resolvedBgUrl ? (
            <Image
              src={resolvedBgUrl}
              alt="プロフィール背景"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600" />
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>

            {/* プロフィール情報コンテナ - X風レイアウト */}
            <div className="relative bg-white rounded-b-2xl">
          {/* アバター - 背景画像に重なって配置 */}
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between pt-4 pb-4">
              <div className="relative -mt-16 sm:-mt-20">
                <div
                  className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0"
                >
                  {resolvedAvatarUrl ? (
                    <Image
                      src={resolvedAvatarUrl}
                      alt="プロフィール画像"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-400">
                      {displayName ? displayName.charAt(0) : 'N'}
                    </span>
                  )}
                </div>
              </div>
              
              {/* プロフィール編集ボタン - X風の位置 */}
              <div className="flex items-center gap-3">
                {portfolioVisibility === 'public' && userId && (
                  <ShareProfileButton userId={userId} slug={slug} displayName={displayName} />
                )}
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm" className="px-4 py-2 text-sm font-medium rounded-full border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors duration-200">
                    プロフィール編集
                  </Button>
                </Link>
              </div>
            </div>

            {/* プロフィール情報 - X風のレイアウト */}
            <div className="pb-4">
              <div className="mb-3">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{displayName || 'ユーザー'}</h1>
                {title && <p className="text-base text-gray-600 mt-1">{title}</p>}
              </div>

              {bio && (
                <p className="text-base text-gray-900 leading-relaxed mb-3 whitespace-pre-wrap">{bio}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
                {location && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{location}</span>
                  </div>
                )}
                {websiteUrl && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 hover:underline truncate max-w-[200px] sm:max-w-none transition-colors duration-200">
                      {websiteUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

          {/* フォロー統計 - X風 */}
          {userId && (
            <div className="mb-4">
              <FollowStats userId={userId} />
            </div>
          )}
        </div>
      </div>
    </div>
      </div>
    </div>
  )
} 