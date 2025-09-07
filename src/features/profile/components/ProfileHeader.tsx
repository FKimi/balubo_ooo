'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShareProfileButton } from './ShareProfileButton'
import { FollowStats } from '@/features/follow/components/FollowStats'
import { TabNavigation } from '@/components/ui/TabNavigation'
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
  // タブ関連
  tabs?: Array<{
    key: string
    label: string
    icon?: React.ReactNode
    count?: number
  }> | undefined
  activeTab?: string | undefined
  onTabChange?: ((_tab: string) => void) | undefined
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
  rightSlot: _rightSlot,
  tabs,
  activeTab,
  onTabChange
}: ProfileHeaderProps) {
  // Supabaseストレージの相対パスの場合はフルURLを付与、既にフルURLの場合はそのまま使用
  const resolvedBgUrl = backgroundImageUrl && backgroundImageUrl.trim()
    ? (backgroundImageUrl.startsWith('/storage') 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${backgroundImageUrl}`
        : backgroundImageUrl)
    : ''

  const resolvedAvatarUrl = avatarImageUrl && avatarImageUrl.trim()
    ? (avatarImageUrl.startsWith('/storage')
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${avatarImageUrl}`
        : avatarImageUrl)
    : ''



  return (
    <div className="mb-8 -mt-4">
      {/* 背景画像 - フルブリード */}
      <div
        className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden shadow-elegant"
        style={{ minHeight: '200px' }}
      >
        {resolvedBgUrl ? (
          <Image 
            src={resolvedBgUrl} 
            alt="プロフィール背景" 
            fill
            className="object-cover"
            style={{ 
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-white" />
        )}
        {/* 洗練されたオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        {/* 洗練されたセパレーター */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/20 backdrop-blur-sm" />
      </div>
      
      {/* プロフィール情報コンテナ - 背景画像の下から線で囲む */}
      <div className="relative">
        {/* 背景画像の下から線で囲むコンテナ */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg -mt-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* プロフィール画像を背景画像に重ねる - ユートラスト風レイアウト */}
          <div className="relative -mt-32 sm:-mt-36 md:-mt-40 lg:-mt-44">
            <div className="flex items-end gap-4 sm:gap-6">
              <div
                className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-2xl overflow-hidden border-4 border-white shadow-elegant-xl bg-white flex-shrink-0"
                style={{ minWidth: '144px', minHeight: '144px' }}
              >
                {resolvedAvatarUrl ? (
                  <Image
                    src={resolvedAvatarUrl}
                    alt="プロフィール画像"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-400">
                    {displayName ? displayName.charAt(0) : 'N'}
                  </span>
                )}
              </div>
              <div className="pb-2 sm:pb-3 flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight truncate">{displayName || 'ユーザー'}</h1>
                {title && <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1 font-medium truncate">{title}</p>}
              </div>
            </div>
          </div>

          {/* プロフィール情報カード - ユートラスト風のレイアウト */}
          <div className="pt-6 pb-8">
            {bio && (
              <p className="text-base text-gray-700 leading-relaxed mb-6">{bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 mb-6">
              {userId && <FollowStats userId={userId} />}
              {location && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{location}</span>
                </div>
              )}
              {websiteUrl && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 hover:underline truncate max-w-[200px] sm:max-w-none transition-colors duration-200">
                    {websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {portfolioVisibility === 'public' && userId && (
                <ShareProfileButton userId={userId} slug={slug} displayName={displayName} />
              )}
              <Link href="/profile/edit">
                <Button variant="outline" size="sm" className="px-6 py-3 text-sm font-semibold rounded-xl border-[#5570F3] text-[#5570F3] hover:bg-[#5570F3]/10 hover:border-[#4461E8] transition-all duration-200">
                  プロフィール編集
                </Button>
              </Link>
            </div>
          </div>

          {/* タブナビゲーション - プロフィールカードに統合 */}
          {tabs && tabs.length > 0 && activeTab && onTabChange && (
            <div className="border-t border-gray-200 bg-gray-50/50 px-4 sm:px-6 lg:px-8 pb-2 rounded-b-2xl">
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
                className="bg-transparent border-0"
              />
            </div>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 