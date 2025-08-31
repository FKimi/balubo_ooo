/* eslint-disable unused-imports/no-unused-vars */
'use client'


import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TabNavigation } from '@/components/ui/TabNavigation'

import type { WorkData } from '@/features/work/types'
import type { ProfileData, CareerItem } from '@/features/profile/types'
import { useWorkStatistics } from '@/features/work/hooks/useWorkStatistics'
import { useLayout } from '@/contexts/LayoutContext'
import { useWorkCategories } from '@/features/work/hooks/useWorkCategories'
import { WorksCategoryManager } from '@/features/work/components/WorksCategoryManager'
import { ContentTypeSelector } from '@/features/work/components/ContentTypeSelector'

import { calculateTopTags } from '@/features/profile/lib/profileUtils'

import { useState, useEffect } from 'react'
import { RolePieChart } from './RolePieChart'
import { EmptyState } from '@/components/common'
import { CreatorIntroCard } from './CreatorIntroCard'
import { useTagStatistics } from '@/hooks/useTagStatistics'

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
  showTabHeader = true
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
  
  // コンテンツタイプ選択モーダルの状態
  const [isContentTypeSelectorOpen, setIsContentTypeSelectorOpen] = useState(false)

  // よく使用するタグを計算（作品データから）
  const topTags = calculateTopTags(savedWorks)

  // タブ設定
  const tabs = [
    { key: 'profile', label: 'プロフィール' },
    { key: 'works', label: '作品' },
    { key: 'details', label: 'クリエイター詳細' }
  ]

  // タグランキングサマリー生成
  const summary =
    topTags.length === 0
      ? ''
      : topTags.length === 1
        ? `${topTags[0]?.[0] ?? ''}が特に多く使われています。`
        : topTags.length === 2
          ? `${topTags[0]?.[0] ?? ''}・${topTags[1]?.[0] ?? ''}が特に多く使われています。`
          : `${topTags[0]?.[0] ?? ''}・${topTags[1]?.[0] ?? ''}・${topTags[2]?.[0] ?? ''}が特に多く使われています。`;

  return (
    <div className="space-y-6">
      {/* タブナビゲーション */}
      {showTabHeader && (
        <div className="sticky top-16 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as 'profile' | 'works' | 'details')}
          />
        </div>
      )}

      {/* タブコンテンツ */}
      <div className="mt-6 px-6">
        {/* プロフィールタブ */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* 新規ユーザー向けウェルカムメッセージ */}
            {(!profileData?.bio && (!profileData?.skills || profileData.skills.length === 0) && (!profileData?.career || profileData.career.length === 0)) && (
              <Card className="border-dashed border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
                <CardContent className="p-8 text-center">

                  <h3 className="text-xl font-bold text-gray-900 mb-3">プロフィールを充実させましょう！</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    あなたの経験やスキルを追加して、他のクリエイターとのつながりを深めましょう。<br />
                    プロフィールが充実していると、より多くの機会が生まれます。
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => setIsSkillModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      スキルを追加
                    </Button>
                    <Button 
                      onClick={() => setIsCareerModalOpen(true)}
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">自己紹介</h3>
                  <Button
                    onClick={() => setIsIntroductionModalOpen(true)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-400/30 transition-all duration-300"
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
                      className="border-blue-400 text-blue-600 hover:bg-blue-50/80 rounded-2xl shadow-lg shadow-blue-400/20 transition-all duration-300"
                    >
                      自己紹介を追加
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* できること（スキル）セクション */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">経験・スキル</h3>
                  <Button
                    onClick={() => setIsSkillModalOpen(true)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-400/30 transition-all duration-300"
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
                          className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors pr-8 rounded-2xl border border-blue-200"
                        >
                          {skill}
                          <button
                            onClick={() => onRemoveSkill?.(_index)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
                      className="border-blue-400 text-blue-600 hover:bg-blue-50/80 rounded-2xl shadow-lg shadow-blue-400/20 transition-all duration-300"
                    >
                      最初のスキルを追加
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* キャリアセクション */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">キャリア</h3>
                  <Button
                    onClick={() => setIsCareerModalOpen(true)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-400/30 transition-all duration-300"
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
                        <div key={careerItem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{careerItem.position}</h4>
                                {careerItem.isCurrent && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">現職</Badge>
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
                                className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-blue-400/20"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => onDeleteCareerConfirm(careerItem.id)}
                                className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
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
                      className="border-blue-400 text-blue-600 hover:bg-blue-50/80 rounded-2xl shadow-lg shadow-blue-400/20 transition-all duration-300"
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
          <div>
            {/* 作品追加ボタン */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">ポートフォリオ</h2>
              <Button
                onClick={openContentTypeSelector}
                className="bg-gray-800 text-white hover:bg-gray-900 rounded-md shadow-sm px-4 py-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                作品を追加
              </Button>
            </div>

            {savedWorks.length > 0 ? (
              <div className="space-y-8">
                {/* 主な作品セクション */}
                {savedWorks.filter(work => work.is_featured).length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">主な作品</h3>
                        <p className="text-sm text-gray-600">あなたの代表的な作品を紹介</p>
                      </div>
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {savedWorks.filter(work => work.is_featured).length}/3
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedWorks
                        .filter(work => work.is_featured)
                        .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))
                        .map((work, index) => (
                          <div key={work.id} className="relative group">
                            {/* ランキングバッジ */}
                            <div className="absolute top-3 left-3 z-10">
                              <div className={`px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                                'bg-gradient-to-r from-amber-400 to-orange-600'
                              }`}>
                                #{index + 1}
                              </div>
                            </div>
                            
                            {/* 作品カード */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                              <a href={`/works/${work.id}`} className="block">
                                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                                  {work.banner_image_url ? (
                                    <img 
                                      src={work.banner_image_url} 
                                      alt={work.title} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : work.preview_data?.image ? (
                                    <img 
                                      src={work.preview_data.image} 
                                      alt={work.title} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                    {work.title}
                                  </h4>
                                  {work.tags && work.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {work.tags.slice(0, 2).map((tag, idx) => (
                                        <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                          {tag}
                                        </span>
                                      ))}
                                      {work.tags.length > 2 && (
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
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
                )}

                {/* 通常の作品一覧 */}
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
            ) : (
              <EmptyState
                title="まだ作品がありません"
                message="最初の作品を追加して、ポートフォリオを始めましょう"
                ctaLabel="最初の作品を追加"
                onCtaClick={() => setIsContentTypeSelectorOpen(true)}
              />
            )}
          </div>
        )}



        {/* クリエイター詳細タブ */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* クリエイター紹介 */}
            {profileData && <CreatorIntroCard tags={topTags} />}

            {/* 作品統計・役割分布 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">作品統計・役割分布</h3>
                </div>

                {workStats.totalWorks > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* 総作品数表示 */}
                    <div className="text-center lg:text-left">
                      <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 rounded-xl p-6 border border-blue-200 h-full">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">総作品数</h4>
                        <div className="text-4xl font-bold text-blue-600">{workStats.totalWorks}</div>
                        <p className="text-gray-600 mt-2">これまでに制作した作品</p>

                        {/* 総文字数（記事作品がある場合のみ表示） */}
                        {workStats.totalWordCount > 0 && (
                          <div className="mt-4 pt-4 border-t border-blue-200">
                            <h5 className="text-sm font-medium text-gray-600 mb-1">総文字数</h5>
                            <div className="text-2xl font-bold text-blue-600">
                              {workStats.totalWordCount.toLocaleString('ja-JP')}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">記事・ライティング作品の合計</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 役割分布 */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">役割分布</h4>
                      {workStats.roleDistribution.length > 0 ? (
                        isClient ? (
                          <RolePieChart roles={workStats.roleDistribution} />
                        ) : (
                          <div className="flex h-[260px] w-full items-center justify-center">
                            <p className="text-sm text-gray-400">読み込み中...</p>
                          </div>
                        )
                      ) : (
                        <EmptyState title="役割データがありません" />
                      )}
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="まだ作品がありません"
                    message="最初の作品を追加して、統計情報を表示しましょう"
                    ctaLabel="作品を追加"
                    onCtaClick={() => setIsContentTypeSelectorOpen(true)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* コンテンツタイプ選択モーダル */}
        <ContentTypeSelector
        isOpen={isContentTypeSelectorOpen}
        onClose={() => setIsContentTypeSelectorOpen(false)}
      />
      </div>
    </div>
  )
}


