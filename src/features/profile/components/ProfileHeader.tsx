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
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl mb-6 sm:mb-8">
      {/* 背景画像またはグラデーション */}
      <div className="relative h-32 sm:h-40 md:h-48 lg:h-56">
        {hasCustomBackground ? (
          <div className="absolute inset-0">
            <Image 
              src={backgroundImageUrl}
              alt="プロフィール背景画像"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 overflow-hidden">
            {/* 装飾的なパターン */}
            <div className="absolute inset-0">
              <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-12 sm:w-20 h-12 sm:h-20 bg-white/10 rounded-full"></div>
              <div className="absolute top-8 sm:top-16 right-8 sm:right-16 w-8 sm:w-12 h-8 sm:h-12 bg-white/8 rounded-full"></div>
              <div className="absolute bottom-6 sm:bottom-12 left-1/4 w-10 sm:w-16 h-10 sm:h-16 bg-white/5 rounded-full"></div>
              <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-6 sm:w-8 h-6 sm:h-8 bg-white/12 rounded-full"></div>
            </div>
            
            {/* 新規ユーザー向けメッセージ */}
            {isProfileEmpty && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center text-white/90 max-w-md">
                  <svg className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 sm:mb-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">プロフィールをカスタマイズしましょう</h3>
                  <p className="text-xs sm:text-sm text-white/80">背景画像やプロフィール情報を追加して、あなたらしさを表現してください</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* プロフィール情報コンテンツ */}
      <div className="bg-white px-4 sm:px-6 md:px-8 pt-4 pb-4 sm:pb-6">
        <div className="flex items-start gap-4 sm:gap-6">
            {/* プロフィール画像 */}
            <div className="-mt-16 sm:-mt-24 md:-mt-28">
                <div className="relative">
                    <div className="w-24 sm:w-32 md:w-36 lg:w-40 h-24 sm:h-32 md:h-36 lg:h-40 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center border-4 sm:border-6 border-white shadow-2xl">
                    {hasCustomAvatar ? (
                        <Image
                        src={avatarImageUrl}
                        alt="プロフィール画像"
                        fill
                        sizes="128px"
                        className="object-cover rounded-full"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full flex items-center justify-center relative overflow-hidden">
                        {/* 背景パターン */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
                        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-3 sm:w-6 h-3 sm:h-6 bg-white/20 rounded-full"></div>
                        <div className="absolute bottom-1.5 sm:bottom-3 left-1.5 sm:left-3 w-2 sm:w-4 h-2 sm:h-4 bg-white/15 rounded-full"></div>
                        
                        {/* ユーザーアイコンまたはイニシャル */}
                        {displayName && displayName !== 'ユーザー' ? (
                            <span className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl z-10 relative">
                            {displayName.charAt(0).toUpperCase()}
                            </span>
                        ) : (
                            <svg className="w-12 sm:w-16 md:w-18 lg:w-20 h-12 sm:h-16 md:h-18 lg:h-20 text-white/90 z-10 relative" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        )}
                        </div>
                    )}
                    </div>
                </div>
            </div>

            {/* 名前とプロフィール情報 */}
            <div className="flex-1 min-w-0">
                {/* 肩書き（上部・薄い色・小さめ） */}
                {title && (
                  <div className="mb-3">
                    <span className="inline-block text-base sm:text-lg font-semibold text-indigo-500 tracking-wide bg-indigo-50 px-4 py-1 rounded-full shadow-sm">
                      {title}
                    </span>
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                  {displayName === 'ユーザー' ? (
                    <span className="text-gray-400">表示名を設定してください</span>
                  ) : (
                    displayName
                  )}
                </h1>
                {/* 自己紹介文 */}
                {bio && (
                  <p className="text-base sm:text-lg text-gray-700 font-normal leading-relaxed mb-2 sm:mb-4 max-w-2xl">
                    {bio}
                  </p>
                )}
            </div>
            
            {/* 編集・共有ボタン */}
            <div className="flex gap-2 ml-4">
                {/* 共有ボタン */}
                {portfolioVisibility === 'public' && userId && (
                    <ShareProfileButton userId={userId} slug={slug} displayName={displayName} />
                )}
                
                {/* 編集ボタン */}
                <Link href="/profile/edit">
                    <Button className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border border-gray-200 shadow-lg text-xs sm:text-sm">
                    <svg className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    編集
                    </Button>
                </Link>
            </div>
        </div>

        {/* プロフィール詳細 */}
        <div className="mt-4">

            {/* フォロー統計 */}
            {userId && (
            <div className="mb-4 sm:mb-6">
                <FollowStats userId={userId} />
            </div>
            )}

            {/* 詳細情報 */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            {location && (
                <div className="flex items-center gap-1 sm:gap-2">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location}</span>
                </div>
            )}
            
            {websiteUrl && (
                <div className="flex items-center gap-1 sm:gap-2">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <a 
                    href={websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 transition-colors hover:underline truncate max-w-[200px] sm:max-w-none"
                >
                    {websiteUrl.replace('https://', '')}
                </a>
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  )
} 