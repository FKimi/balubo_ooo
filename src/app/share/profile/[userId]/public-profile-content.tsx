'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PublicProfileHeader } from '@/features/profile/components/PublicProfileHeader'
import { PublicProfileTabs } from '@/features/profile/components/PublicProfileTabs'
import { Button } from '@/components/ui/button'

interface PublicProfileData {
  profile: any
  works: any[]
  inputs: any[]
  inputAnalysis?: any
}

interface PublicProfileContentProps {
  data: PublicProfileData
  userId: string
}

export function PublicProfileContent({ data, userId }: PublicProfileContentProps) {
  console.log('PublicProfileContent: データ受信', {
    hasData: !!data,
    hasProfile: !!data?.profile,
    worksCount: data?.works?.length || 0,
    inputsCount: data?.inputs?.length || 0,
    rawData: data,
    userId
  })
  
  const { profile, works, inputs, inputAnalysis } = data
  const [activeTab, setActiveTab] = useState<'profile' | 'works' | 'inputs' | 'details'>('profile')

  console.log('PublicProfileContent: プロフィール情報', {
    displayName: profile?.display_name,
    bio: profile?.bio,
    skills: profile?.skills,
    career: profile?.career,
    worksLength: works?.length || 0,
    inputsLength: inputs?.length || 0,
    worksData: works,
    inputsData: inputs
  })

  // プロフィール情報の整理
  const displayName = profile?.display_name || 'ユーザー'
  const bio = profile?.bio || ''
  const location = profile?.location || ''
  const websiteUrl = profile?.website_url || ''
  const backgroundImageUrl = profile?.background_image_url || ''
  const avatarImageUrl = profile?.avatar_image_url || ''
  const skills = profile?.skills || []
  const career = profile?.career || []
  const professions = profile?.professions || []

  console.log('PublicProfileContent: 整理後データ', {
    displayName,
    bio,
    skills,
    career,
    professions,
    finalWorksCount: works?.length || 0,
    finalInputsCount: inputs?.length || 0
  })

  // 画像の存在チェック
  const hasCustomBackground = backgroundImageUrl && backgroundImageUrl.trim() !== ''
  const hasCustomAvatar = avatarImageUrl && avatarImageUrl.trim() !== ''

  console.log('PublicProfileContent: 画像設定確認', {
    backgroundImageUrl,
    avatarImageUrl,
    hasCustomBackground,
    hasCustomAvatar
  })

  console.log('PublicProfileContent: HeaderPropsに渡すデータ', {
    userId,
    displayName,
    bio,
    location,
    websiteUrl,
    backgroundImageUrl,
    avatarImageUrl,
    isProfileEmpty: !bio && skills.length === 0 && career.length === 0,
    hasCustomBackground,
    hasCustomAvatar,
    professions
  })

  // プロフィールが空かどうかの判定
  const isProfileEmpty = !bio && skills.length === 0 && career.length === 0

  return (
    <div className="min-h-screen bg-white">
    <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        {/* 戻るリンク */}
        <div className="mb-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              ホームに戻る
            </Button>
          </Link>
        </div>

        {/* 公開プロフィールヘッダー */}
        <PublicProfileHeader
          userId={userId}
          displayName={displayName}
          bio={bio}
          location={location}
          websiteUrl={websiteUrl}
          backgroundImageUrl={backgroundImageUrl}
          avatarImageUrl={avatarImageUrl}
          isProfileEmpty={isProfileEmpty}
          hasCustomBackground={hasCustomBackground}
          hasCustomAvatar={hasCustomAvatar}
          professions={professions}
        />
        
        {/* 公開プロフィールタブ */}
        <PublicProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profile={profile}
          works={works || []}
          inputs={inputs || []}
          skills={skills}
          career={career}
          isProfileEmpty={isProfileEmpty}
          inputAnalysis={inputAnalysis}
        />
      </div>
    </main>
    </div>
  )
} 