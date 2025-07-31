'use client'


import FollowButton from '@/features/follow/components/FollowButton'
import MessageButton from './MessageButton'
import { FollowStats } from '@/features/follow/components/FollowStats'

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
      <div className="relative">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-2xl shadow-lg overflow-hidden w-full relative">
          {/* 背景画像 - カード内 */}
          <div 
            className="relative h-40 sm:h-48 md:h-56 rounded-t-2xl overflow-hidden"
            style={{ minHeight: '200px' }}
          >
            {resolvedBgUrl ? (
              <img 
                src={resolvedBgUrl} 
                alt="プロフィール背景" 
                className="absolute inset-0 w-full h-full object-cover"
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
          </div>
          
          {/* 上部: アバターとボタン */}
          <div className="relative px-6 pt-6 flex justify-between items-start">
            {/* アバター */}
            <div className="flex-shrink-0">
              <div 
                className="relative w-28 h-28 sm:w-32 sm:h-32 -mt-14 sm:-mt-16 rounded-full overflow-hidden border-4 border-white shadow-xl"
                style={{ minWidth: '112px', minHeight: '112px' }}
              >
                {resolvedAvatarUrl ? (
                  <img 
                    src={resolvedAvatarUrl} 
                    alt="プロフィール画像" 
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ 
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-400">
                    {displayName ? displayName.charAt(0) : 'N'}
                  </span>
                )}
              </div>
            </div>
            
            {/* 右側ボタン群 */}
            <div className="flex items-center gap-3 pt-4">
              <MessageButton targetUserId={userId} />
              <FollowButton targetUserId={userId} />
            </div>
          </div>
          
          {/* 下部: プロフィール情報 */}
          <div className="px-6 pb-6 pt-4">
            <h1 className="text-2xl font-bold text-gray-900">{displayName || 'ユーザー'}</h1>
            {professions && professions.length>0 && (
              <p className="text-md text-gray-500">{professions[0]}</p>
            )}
            
            {bio && (
              <p className="mt-3 text-sm text-gray-700 leading-relaxed max-w-2xl">
                {bio}
              </p>
            )}

            {/* 統計とリンク */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
              <FollowStats userId={userId} />
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
        </div>
      </div>
    </div>
  )
} 