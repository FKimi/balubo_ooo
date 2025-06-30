'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProfileAvatarProps {
  avatarUrl?: string | null
  displayName?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProfileAvatar({ 
  avatarUrl, 
  displayName = '', 
  size = 'md',
  className = '' 
}: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base'
  }

  const sizePixels = {
    sm: 24,
    md: 32,
    lg: 48
  } as const

  const hasValidImage = avatarUrl && !imageError && avatarUrl.trim() !== ''

  const getInitial = () => {
    if (displayName && displayName.trim() !== '') {
      return displayName.charAt(0).toUpperCase()
    }
    return 'U'
  }

  if (hasValidImage) {
    return (
      <Image
        src={avatarUrl!}
        alt={`${displayName}のプロフィール画像`}
        width={sizePixels[size]}
        height={sizePixels[size]}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
        sizes={`${sizePixels[size]}px`}
        onError={() => setImageError(true)}
        onLoad={() => setImageError(false)}
      />
    )
  }

  // 画像がない場合はイニシャルまたはデフォルトアイコンを表示
  return (
          <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${className}`}>
      <span className="text-white font-bold">
        {getInitial()}
      </span>
    </div>
  )
} 