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
  rightSlot
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
    <div className="mb-12">
      {/* メインカード */}
      <div className="relative max-w-7xl mx-auto">
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200" />
          )}
          {/* 洗練されたオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          {/* 洗練されたセパレーター */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/20 backdrop-blur-sm" />
        </div>
        
        {/* プロフィール情報コンテナ - 背景画像に重ねて表示 */}
        <div className="relative px-6 sm:px-8 lg:px-12">
          {/* プロフィール画像を背景画像に重ねる */}
          <div className="relative -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-28">
            <div className="flex items-end gap-6">
              <div
                className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-elegant-xl bg-white"
                style={{ minWidth: '128px', minHeight: '128px' }}
              >
                {resolvedAvatarUrl ? (
                  <Image
                    src={resolvedAvatarUrl}
                    alt="プロフィール画像"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-400">
                    {displayName ? displayName.charAt(0) : 'N'}
                  </span>
                )}
              </div>
              <div className="pb-3">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{displayName || 'ユーザー'}</h1>
                {title && <p className="text-lg text-gray-600 mt-1 font-medium">{title}</p>}
              </div>
            </div>
          </div>

          {/* プロフィール情報カード */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mt-6">
            {bio && (
              <p className="text-base text-gray-700 leading-relaxed mb-6">{bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
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

            <div className="mt-8 flex items-center gap-4">
              {portfolioVisibility === 'public' && userId && (
                <ShareProfileButton userId={userId} slug={slug} displayName={displayName} />
              )}
              <Link href="/profile/edit">
                <Button variant="outline" size="sm" className="px-6 py-3 text-sm font-semibold rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                  プロフィール編集
                </Button>
              </Link>
            </div>
          </div>

          {/* 右カラム：アクションボタン */}
          {rightSlot && (
            <div className="mt-6 md:mt-0">
              {rightSlot}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 