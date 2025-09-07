/* eslint-disable unused-imports/no-unused-vars */
'use client'


import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

import type { WorkData } from '@/features/work/types'
import type { ProfileData, CareerItem } from '@/features/profile/types'
import { useWorkStatistics } from '@/features/work/hooks/useWorkStatistics'
import { useLayout } from '@/contexts/LayoutContext'
import { useWorkCategories } from '@/features/work/hooks/useWorkCategories'
import { WorksCategoryManager } from '@/features/work/components/WorksCategoryManager'
// ContentTypeSelector はグローバルモーダル（GlobalModalManager）経由で表示するため、ここでは直接使用しない

import { calculateTopTags } from '@/features/profile/lib/profileUtils'

import { useState, useEffect, useMemo } from 'react'
import { RolePieChart } from './RolePieChart'
import { EmptyState } from '@/components/common'
import { useTagStatistics } from '@/hooks/useTagStatistics'
import { AIAnalysisStrengths } from './AIAnalysisStrengths'

interface ProfileTabsProps {
  activeTab: string
  // eslint-disable-next-line unused-imports/no-unused-vars
  setActiveTab: (tab: 'profile' | 'works' | 'details') => void
  profileData: ProfileData | null
  savedWorks: WorkData[]
  // eslint-disable-next-line unused-imports/no-unused-vars
  setSavedWorks: (works: WorkData[]) => void

  // eslint-disable-next-line unused-imports/no-unused-vars
  deleteWork: (workId: string) => void
  // スキル管理
  onAddSkill?: () => void
  onRemoveSkill?: (index: number) => void
  setIsSkillModalOpen: (open: boolean) => void
  // キャリア管理
  onEditCareer: (career: CareerItem) => void
  onDeleteCareerConfirm: (careerId: string) => void
  setIsCareerModalOpen: (open: boolean) => void
  // 自己紹介管理
  onUpdateIntroduction?: (introduction: string) => void
  setIsIntroductionModalOpen: (open: boolean) => void
  showTabHeader?: boolean
  // AI分析による強みのデータ
  strengthsAnalysis?: {
    strengths: Array<{ title: string; description: string }>
    jobMatchingHints?: string[]
  }
  // タブ情報を外部に提供
  getTabsInfo?: (callback: () => {
    tabs: Array<{
      key: string
      label: string
      icon?: React.ReactNode
      count?: number
    }>
    activeTab: string
    onTabChange: (tab: string) => void
  }) => void
}

export function ProfileTabs({ 
  activeTab, 
  setActiveTab,
  profileData,
  savedWorks,
  setSavedWorks,
  deleteWork,
  onAddSkill,
  onRemoveSkill,
  setIsSkillModalOpen,
  onEditCareer,
  onDeleteCareerConfirm,
  setIsCareerModalOpen,
  onUpdateIntroduction,
  setIsIntroductionModalOpen,
  showTabHeader = true,
  strengthsAnalysis,
  getTabsInfo
}: ProfileTabsProps) {
  const [isClient, setIsClient] = useState(false)
  const { openContentTypeSelector } = useLayout()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // カスタムフックからデータを取得
  const workStats = useWorkStatistics(savedWorks)
  const { categories, addCategory, updateCategory, deleteCategory, updateWorkCategory } = useWorkCategories(savedWorks, setSavedWorks)
  const { data: tagStatistics, getTagStatistic, getTagRanking } = useTagStatistics()
  
  // 作品追加モーダルはレイアウトのグローバル管理を利用

  // よく使用するタグを計算（作品データから）
  const topTags = calculateTopTags(savedWorks)

  // タブ設定
  const tabs = useMemo(() => [
    { 
      key: 'profile', 
      label: 'プロフィール',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      key: 'works', 
      label: '作品',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      key: 'details', 
      label: 'クリエイター詳細',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ], [])

  // タグランキングサマリー生成
  const summary =
    topTags.length === 0
      ? ''
      : topTags.length === 1
        ? `${topTags[0]?.[0] ?? ''}が特に多く使われています。`
        : topTags.length === 2
          ? `${topTags[0]?.[0] ?? ''}・${topTags[1]?.[0] ?? ''}が特に多く使われています。`
          : `${topTags[0]?.[0] ?? ''}・${topTags[1]?.[0] ?? ''}・${topTags[2]?.[0] ?? ''}が特に多く使われています。`;

  // タブ情報を外部に提供する関数
  useEffect(() => {
    if (getTabsInfo) {
      getTabsInfo(() => ({
        tabs,
        activeTab,
        onTabChange: (tab: string) => setActiveTab(tab as 'profile' | 'works' | 'details')
      }))
    }
  }, [getTabsInfo, tabs, activeTab, setActiveTab])

  return (
    <div className="space-y-6">
      {/* タブコンテンツ */}
      <div className="relative">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* プロフィールタブ */}
        {activeTab === 'profile' && (
          <div className="space-y-6 mt-6">
            {/* 新規ユーザー向けウェルカムメッセージ */}
            {(!profileData?.bio && (!profileData?.skills || profileData.skills.length === 0) && (!profileData?.career || profileData.career.length === 0)) && (
              <Card className="border-dashed border-2 border-[#5570F3]/30 bg-gradient-to-br from-[#5570F3]/10 via-[#5570F3]/15 to-[#5570F3]/10 rounded-2xl shadow-lg shadow-[#5570F3]/20 backdrop-blur-sm">
                <CardContent className="p-8 text-center">

                  <h3 className="text-xl font-bold text-gray-900 mb-3">プロフィールを充実させましょう！</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    あなたの経験やスキルを追加して、他のクリエイターとのつながりを深めましょう。<br />
                    プロフィールが充実していると、より多くの機会が生まれます。
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => setIsSkillModalOpen(true)}
                      className="bg-[#5570F3] hover:bg-[#4461E8] text-white rounded-2xl shadow-lg shadow-[#5570F3]/30 transition-all duration-300"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      スキルを追加
                    </Button>
                    <Button 
                      onClick={() => setIsCareerModalOpen(true)}
                      variant="outline"
                      className="border-[#5570F3] text-[#5570F3] hover:bg-[#5570F3]/10 rounded-2xl shadow-lg shadow-[#5570F3]/20 transition-all duration-300"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6v2a2 2 0 002 2h4a2 2 0 002-2V6m0 0V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2z" />
                      </svg>
                      キャリアを追加
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 詳細自己紹介セクション */}
            <Card className="rounded-2xl shadow-lg shadow-[#5570F3]/10 border border-[#5570F3]/10 hover:shadow-xl hover:shadow-[#5570F3]/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">自己紹介</h3>
                  <Button
                    onClick={() => setIsIntroductionModalOpen(true)}
                    size="sm"
                    className="bg-[#5570F3] hover:bg-[#4461E8] text-white rounded-2xl shadow-lg shadow-[#5570F3]/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    編集
                  </Button>
                </div>

                {profileData?.introduction ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {profileData.introduction}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">

                    <p className="text-gray-500 mb-4">まだ詳細な自己紹介が登録されていません</p>
                    <Button
                      onClick={() => setIsIntroductionModalOpen(true)}
                      variant="outline"
                      className="border-[#5570F3] text-[#5570F3] hover:bg-[#5570F3]/10 rounded-2xl shadow-lg shadow-[#5570F3]/20 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      自己紹介を追加
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* できること（スキル）セクション */}
            <Card className="rounded-2xl shadow-lg shadow-[#5570F3]/10 border border-[#5570F3]/10 hover:shadow-xl hover:shadow-[#5570F3]/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">経験・スキル</h3>
                  <Button
                    onClick={() => setIsSkillModalOpen(true)}
                    size="sm"
                    className="bg-[#5570F3] hover:bg-[#4461E8] text-white rounded-2xl shadow-lg shadow-[#5570F3]/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    追加
                  </Button>
                </div>

                {profileData?.skills && profileData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, _index) => (
                      <div key={_index} className="group relative">
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 bg-[#5570F3]/10 text-[#5570F3] hover:bg-[#5570F3]/20 transition-all duration-300 pr-8 rounded-2xl border border-[#5570F3]/20 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                          {skill}
                          <button
                            onClick={() => onRemoveSkill?.(_index)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#5570F3] hover:bg-[#4461E8] text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">

                    <p className="text-gray-500 mb-4">まだスキルが登録されていません</p>
                    <Button
                      onClick={() => setIsSkillModalOpen(true)}
                      variant="outline"
                      className="border-[#5570F3] text-[#5570F3] hover:bg-[#5570F3]/10 rounded-2xl shadow-lg shadow-[#5570F3]/20 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      最初のスキルを追加
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* キャリアセクション */}
            <Card className="rounded-2xl shadow-lg shadow-[#5570F3]/10 border border-[#5570F3]/10 hover:shadow-xl hover:shadow-[#5570F3]/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">キャリア</h3>
                  <Button
                    onClick={() => setIsCareerModalOpen(true)}
                    size="sm"
                    className="bg-[#5570F3] hover:bg-[#4461E8] text-white rounded-2xl shadow-lg shadow-[#5570F3]/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    追加
                  </Button>
                </div>

                {profileData?.career && profileData.career.length > 0 ? (
                  <div className="space-y-4">
                    {[...profileData.career]
                      .sort((a, b) => {
                        const parseYearMonth = (dateStr: string): number => {
                          const match = dateStr.match(/(\d{4})\D*(\d{1,2})?/) // 年と月を抽出
                          if (!match) return 0
                          const year = Number(match[1])
                          const month = match[2] ? Number(match[2]) - 1 : 0
                          return new Date(year, month).getTime()
                        }

                        return parseYearMonth(b.startDate) - parseYearMonth(a.startDate)
                      })
                      .map((careerItem, _index) => (
                        <div key={careerItem.id} className="border border-[#5570F3]/10 rounded-2xl p-4 hover:shadow-lg hover:shadow-[#5570F3]/20 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:-translate-y-0.5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{careerItem.position}</h4>
                                {careerItem.isCurrent && (
                                  <Badge className="bg-[#5570F3]/10 text-[#5570F3] text-xs rounded-full shadow-sm">現職</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{careerItem.company}</p>
                              {careerItem.department && (
                                <p className="text-sm text-gray-500 mb-2">{careerItem.department}</p>
                              )}
                              <p className="text-xs text-gray-500 mb-3">
                                {careerItem.startDate} - {careerItem.isCurrent ? '現在' : careerItem.endDate || '不明'}
                              </p>
                              {careerItem.description && (
                                <p className="text-sm text-gray-700">{careerItem.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => onEditCareer(careerItem)}
                                className="w-8 h-8 bg-[#5570F3]/10 hover:bg-[#5570F3]/20 text-[#5570F3] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-[#5570F3]/20 hover:shadow-md hover:-translate-y-0.5"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => onDeleteCareerConfirm(careerItem.id)}
                                className="w-8 h-8 bg-red-100/80 hover:bg-red-200/80 text-red-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">

                    <p className="text-gray-500 mb-4">まだキャリア情報が登録されていません</p>
                    <Button
                      onClick={() => setIsCareerModalOpen(true)}
                      variant="outline"
                      className="border-[#5570F3] text-[#5570F3] hover:bg-[#5570F3]/10 rounded-2xl shadow-lg shadow-[#5570F3]/20 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      最初のキャリアを追加
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>








          </div>
        )}

        {/* 作品タブ */}
        {activeTab === 'works' && (
          <div className="mt-6">
            {savedWorks.length > 0 ? (
              <div className="space-y-6">
                {/* 主な作品セクション */}
                {savedWorks.filter(work => work.is_featured).length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">主な作品</h3>
                          <p className="text-sm text-gray-600 mt-1">あなたの代表的な作品を紹介</p>
                        </div>
                        <span className="text-sm font-medium text-[#1976D2] bg-[#1976D2]/10 px-3 py-1 rounded-full">
                          {savedWorks.filter(work => work.is_featured).length}/3
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedWorks
                        .filter(work => work.is_featured)
                        .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))
                        .map((work, index) => (
                          <div key={work.id} className="relative group">
                            {/* ランキングバッジ */}
                            <div className="absolute top-3 left-3 z-10">
                              <div className={`px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                                index === 0 ? 'bg-[#5570F3]' :
                                index === 1 ? 'bg-[#4461E8]' :
                                'bg-[#3D51DD]'
                              }`}>
                                #{index + 1}
                              </div>
                            </div>
                            
                            {/* 作品カード */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#5570F3]/10 border border-[#5570F3]/10 overflow-hidden hover:shadow-xl hover:shadow-[#5570F3]/20 transition-all duration-300 group-hover:scale-[1.02] hover:-translate-y-1">
                              <a href={`/works/${work.id}`} className="block">
                                <div className="aspect-video bg-gradient-to-br from-[#5570F3]/5 to-[#5570F3]/10 relative overflow-hidden">
                                  {work.banner_image_url ? (
                                    <Image 
                                      src={work.banner_image_url} 
                                      alt={work.title} 
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : work.preview_data?.image ? (
                                    <Image 
                                      src={work.preview_data.image} 
                                      alt={work.title} 
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="p-4">
                                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors">
                                    {work.title}
                                  </h4>
                                  {work.tags && work.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {work.tags.slice(0, 2).map((tag, idx) => (
                                        <span key={idx} className="text-xs px-2 py-1 bg-[#5570F3]/10 text-[#5570F3] rounded-full shadow-sm">
                                          {tag}
                                        </span>
                                      ))}
                                      {work.tags.length > 2 && (
                                        <span className="text-xs px-2 py-1 bg-[#5570F3]/10 text-[#5570F3] rounded-full shadow-sm">
                                          +{work.tags.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>
                    </div>
                  </div>
                )}

                {/* 通常の作品一覧 */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">すべての作品</h3>
                        <p className="text-sm text-gray-600 mt-1">{savedWorks.length}件の作品</p>
                      </div>
                      <Button
                        onClick={openContentTypeSelector}
                        size="sm"
                        className="bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-xl shadow-sm transition-all duration-300"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                        作品を追加
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <WorksCategoryManager
                      savedWorks={savedWorks}
                      categories={categories}
                      addCategory={addCategory}
                      updateCategory={updateCategory}
                      deleteCategory={deleteCategory}
                      deleteWork={deleteWork}
                      updateWorkCategory={updateWorkCategory}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                title="まだ作品がありません"
                message="最初の作品を追加して、ポートフォリオを始めましょう"
                ctaLabel="最初の作品を追加"
                onCtaClick={openContentTypeSelector}
              />
            )}
          </div>
        )}



        {/* クリエイター詳細タブ */}
        {activeTab === 'details' && (
          <div className="space-y-6 mt-6">
            {/* AI分析による強み */}
            {strengthsAnalysis && strengthsAnalysis.strengths && strengthsAnalysis.strengths.length > 0 && (
              <AIAnalysisStrengths
                strengths={strengthsAnalysis.strengths}
                jobMatchingHints={strengthsAnalysis.jobMatchingHints || []}
                works={savedWorks}
                className="mt-8"
              />
            )}


            {/* 作品統計・役割分析 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">作品統計・役割分析</h3>
                <p className="text-sm text-gray-600 mt-1">あなたの作品の傾向と専門性を分析</p>
              </div>
              
              {workStats.totalWorks > 0 ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 左側: グラフ */}
                    <div className="lg:col-span-2">
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">役割分布</h4>
                        {workStats.roleDistribution.length > 0 ? (
                          isClient ? (
                            <div className="flex justify-center">
                              <RolePieChart roles={workStats.roleDistribution} />
                            </div>
                          ) : (
                            <div className="flex h-[300px] w-full items-center justify-center">
                              <p className="text-sm text-gray-400 font-light">読み込み中...</p>
                            </div>
                          )
                        ) : (
                          <EmptyState title="役割データがありません" />
                        )}
                      </div>
                    </div>

                    {/* 右側: 統計情報 */}
                    <div className="space-y-6">
                      {/* 基本統計 */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h5 className="font-semibold text-gray-900 mb-3">基本統計</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">総作品数</span>
                            <span className="font-semibold text-gray-900">{workStats.totalWorks}件</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">役割種類</span>
                            <span className="font-semibold text-gray-900">{workStats.roleDistribution.length}種類</span>
                          </div>
                        </div>
                      </div>


                      {/* 専門性分析 */}
                      <div className="bg-[#5570F3]/5 rounded-xl p-4">
                        <h5 className="font-semibold text-gray-900 mb-3">専門性分析</h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {workStats.roleDistribution.length > 0 && workStats.roleDistribution[0] && (
                            <>
                              <span className="font-semibold text-[#5570F3]">{workStats.roleDistribution[0].role}</span>
                              が{Math.round((workStats.roleDistribution[0].count / workStats.totalWorks) * 100)}%を占め、
                              あなたの主要な専門分野となっています。
                              {workStats.roleDistribution.length > 1 && workStats.roleDistribution[1] && (
                                <>また、<span className="font-semibold text-[#5570F3]">{workStats.roleDistribution[1].role}</span>も重要なスキルとして活用されています。</>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <EmptyState
                    title="まだ作品がありません"
                    message="最初の作品を追加して、統計情報を表示しましょう"
                    ctaLabel="作品を追加"
                    onCtaClick={openContentTypeSelector}
                  />
                </div>
              )}
            </div>
          </div>
        )}

          </div>
        </div>
      </div>

      {/* 作品追加モーダルは GlobalModalManager が document.body へポータル挿入 */}
    </div>
  )
}


