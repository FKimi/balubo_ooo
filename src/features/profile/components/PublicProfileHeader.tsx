'use client'


import FollowButton from '@/features/follow/components/FollowButton'
import { FollowStats } from '@/features/follow/components/FollowStats'
import Image from 'next/image'

interface PublicProfileHeaderProps {
  userId: string
  displayName: string
  bio: string
  location: string
  websiteUrl: string
  backgroundImageUrl: string
  avatarImageUrl: string
  isProfileEmpty: boolean
  hasCustomBackground: boolean
  hasCustomAvatar: boolean
  professions: string[]
  rightSlot?: React.ReactNode
}

export function PublicProfileHeader(props: PublicProfileHeaderProps) {
  const {
    userId,
    displayName,
    bio,
    location,
    websiteUrl,
    backgroundImageUrl,
    avatarImageUrl,
    professions,
    rightSlot,
  } = props

  // Resolve storage paths to full URLs (same logic as ProfileHeader)
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
    <div className="mb-8">
      {/* メインカード */}
      <div className="relative max-w-7xl mx-auto">
        {/* 背景画像 - フルブリード（コンテナパディングを相殺） */}
        <div 
          className="relative h-40 sm:h-56 md:h-64 lg:h-72 -mx-6 sm:-mx-8 lg:-mx-12 overflow-hidden"
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />
          )}
          {/* 薄いオーバーレイで文字可読性確保 */}
          <div className="absolute inset-0 bg-black/20" />
          {/* 下端のセパレーター */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gray-200/70" />
        </div>
        
        {/* プロフィール情報コンテナ - 背景画像に重ねて表示 */}
        <div className="relative px-6 sm:px-8 lg:px-12">
          {/* プロフィール画像を背景画像に重ねる */}
          <div className="relative -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24">
            <div className="flex items-end gap-4">
              <div
                className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white"
                style={{ minWidth: '112px', minHeight: '112px' }}
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
              <div className="pb-2">
                <h1 className="text-2xl font-bold text-slate-900">{displayName || 'ユーザー'}</h1>
                {professions && professions.length>0 && (
                  <p className="text-md text-slate-500">{professions[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* プロフィール情報カード */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mt-6">
            {bio && (
              <p className="text-sm text-slate-700 leading-relaxed mb-6">{bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 mb-6">
              <FollowStats userId={userId} />
              {location && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{location}</span>
                </div>
              )}
              {websiteUrl && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-blue-600 hover:underline truncate max-w-[200px] sm:max-w-none">
                    {websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <FollowButton targetUserId={userId} />
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