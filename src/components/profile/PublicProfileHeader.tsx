'use client'

import FollowButton from './FollowButton'

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

export function PublicProfileHeader({
  userId,
  displayName,
  bio,
  location,
  websiteUrl,
  backgroundImageUrl,
  avatarImageUrl,
  isProfileEmpty,
  hasCustomBackground,
  hasCustomAvatar,
  professions
}: PublicProfileHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* 背景画像 */}
      <div className="relative h-32 sm:h-48 md:h-56">
        {hasCustomBackground ? (
          <img 
            src={backgroundImageUrl} 
            alt="背景画像" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
            {/* 装飾的な要素 */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full"></div>
            <div className="absolute top-8 right-16 w-6 h-6 bg-white/15 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-8 left-16 w-4 h-4 bg-white/20 rounded-full"></div>
          </div>
        )}
      </div>

      <div className="relative bg-white px-4 sm:px-6 md:px-8 pt-12 sm:pt-16 pb-4 sm:pb-6">
        {/* プロフィール画像 - 背景画像に重ねて配置 */}
        <div className="absolute -top-10 sm:-top-16 left-4 sm:left-6 md:left-8">
          <div className="relative">
            <div className="w-20 sm:w-28 md:w-32 h-20 sm:h-28 md:h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center border-2 sm:border-4 border-white shadow-2xl">
              {hasCustomAvatar ? (
                <img 
                  src={avatarImageUrl} 
                  alt="プロフィール画像" 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center relative overflow-hidden">
                  {/* 背景パターン */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-3 sm:w-6 h-3 sm:h-6 bg-white/20 rounded-full"></div>
                  <div className="absolute bottom-1.5 sm:bottom-3 left-1.5 sm:left-3 w-2 sm:w-4 h-2 sm:h-4 bg-white/15 rounded-full"></div>
                  
                  {/* ユーザーアイコンまたはイニシャル */}
                  {displayName && displayName !== 'ユーザー' ? (
                    <span className="text-white font-bold text-2xl sm:text-3xl md:text-4xl z-10 relative">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <svg className="w-10 sm:w-14 md:w-16 h-10 sm:h-14 md:h-16 text-white/90 z-10 relative" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  )}
                </div>
              )}
            </div>
            {/* オンラインステータス */}
            <div className="absolute -bottom-1 -right-1 w-6 sm:w-8 h-6 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-white flex items-center justify-center">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* プロフィール詳細 */}
        <div className="space-y-3 sm:space-y-4">
          {/* 名前と職種、フォローボタン */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">
                {displayName}
              </h1>
              {professions && professions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {professions.map((profession, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {profession}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* フォローボタン */}
            <div className="flex-shrink-0 sm:mt-2">
                          <FollowButton 
              targetUserId={userId}
            />
            </div>
          </div>

          {/* 自己紹介 */}
          {bio ? (
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {bio}
            </p>
          ) : (
            !isProfileEmpty && (
              <p className="text-sm sm:text-base text-gray-500 italic">
                まだ自己紹介が設定されていません。
              </p>
            )
          )}

          {/* 所在地・ウェブサイト */}
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