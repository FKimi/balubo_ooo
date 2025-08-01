/* eslint-disable unused-imports/no-unused-vars */
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TabNavigation } from '@/components/ui/TabNavigation'
import { WordCloud } from '@/components/ui/WordCloud'
import type { InputData, InputAnalysis } from '@/types/input'
import type { WorkData } from '@/features/work/types'
import type { ProfileData, CareerItem } from '@/features/profile/types'
import { useWorkStatistics } from '@/features/work/hooks/useWorkStatistics'
import { useLayout } from '@/contexts/LayoutContext'
import { useWorkCategories } from '@/features/work/hooks/useWorkCategories'
import { WorksCategoryManager } from '@/features/work/components/WorksCategoryManager'
import { ContentTypeSelector } from '@/features/work/components/ContentTypeSelector'
import { FeaturedWorksSection } from '@/features/work/components/FeaturedWorksSection'
import { InputCard } from '@/features/inputs/components/InputCard'
import { calculateTopTags } from '@/features/profile/lib/profileUtils'
import { generateInsightSummary, analyzeInterestTendencies } from '@/utils/insightGenerator'
import { useState, useEffect } from 'react'
import { RolePieChart } from './RolePieChart'
import { EmptyState } from '@/components/common'
import { CreatorIntroCard } from './CreatorIntroCard'
import { useTagStatistics } from '@/hooks/useTagStatistics'

interface ProfileTabsProps {
  activeTab: string
  // eslint-disable-next-line unused-imports/no-unused-vars
  setActiveTab: (tab: 'profile' | 'works' | 'inputs' | 'details') => void
  profileData: ProfileData | null
  savedWorks: WorkData[]
  // eslint-disable-next-line unused-imports/no-unused-vars
  setSavedWorks: (works: WorkData[]) => void
  inputs: InputData[]
  inputAnalysis: InputAnalysis | null
  isLoadingInputs: boolean
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
}

export function ProfileTabs({ 
  activeTab, 
  setActiveTab,
  profileData,
  savedWorks, 
  setSavedWorks,
  inputs, 
  inputAnalysis, 
  isLoadingInputs, 
  deleteWork,
  onAddSkill,
  onRemoveSkill,
  setIsSkillModalOpen,
  onEditCareer,
  onDeleteCareerConfirm,
  setIsCareerModalOpen,
  onUpdateIntroduction,
  setIsIntroductionModalOpen
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
    { key: 'inputs', label: 'インプット' },
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
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'profile' | 'works' | 'inputs' | 'details')}
      />

      {/* タブコンテンツ */}
      <div className="mt-6">
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
              <div>
                {/* 代表作セクション */}
                <FeaturedWorksSection
                  savedWorks={savedWorks}
                  setSavedWorks={setSavedWorks}
                  deleteWork={deleteWork}
                />
                
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

        {/* インプットタブ */}
        {activeTab === 'inputs' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">インプット記録</h2>
                <p className="text-gray-600 text-sm sm:text-base">読んだ本、視聴した映画・アニメ、プレイしたゲームなどを記録して、興味関心を分析しましょう</p>
              </div>
              <div className="flex justify-center">
                <Link href="/inputs/new" className="inline-block">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-400/30 transition-all duration-300 mx-auto">
                    インプットを追加
                  </Button>
                </Link>
              </div>
            </div>

            {/* インプット表示 */}
            {isLoadingInputs ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">インプットを読み込み中...</p>
              </div>
            ) : inputs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto justify-items-center">
                {inputs.map((input, _index) => (
                  <InputCard
                    key={input.id}
                    input={input}
                    linkPath={`/inputs/${input.id}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="まだインプットがありません"
                message="最初のインプットを追加して、興味関心を分析しましょう"
                ctaLabel="インプットを追加"
                ctaHref="/inputs/new"
              />
            )}
          </div>
        )}

        {/* クリエイター詳細タブ */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* クリエイター紹介 */}
            {profileData && (
              <CreatorIntroCard tags={topTags} />
            )}
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

                        {/* よく使用するタグ */}
            {topTags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">専門領域の可視化</h3>
                      <p className="text-gray-600 mt-1">作品のタグからあなたの得意分野を分析します。</p>
                    </div>
                    <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      トップ7
                    </div>
                  </div>
                  
                  {/* トップ7タグ（コンパクト表示） */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {topTags.slice(0, 7).map(([tag, count], _index) => (
                      <div 
                        key={tag} 
                        className="flex items-center justify-between p-2 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          {/* ランキングバッジ */}
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            _index === 0
                              ? 'bg-yellow-400 text-gray-900'
                              : _index === 1
                              ? 'bg-gray-300 text-gray-900'
                              : _index === 2
                              ? 'bg-orange-500 text-gray-900'
                              : 'bg-blue-500 text-white'
                          }`}>
                            {_index + 1}
                          </div>
                          
                          {/* タグ名 */}
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {tag}
                          </span>
                        </div>
                        
                        {/* 使用回数 */}
                        <div className="text-right">
                          <div className={`text-sm font-bold ${
                            _index < 3 ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {count}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* その他のタグ（パラパラ表示） */}
                  {topTags.length > 7 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">その他のタグ</h4>
                      <div className="flex flex-wrap gap-1">
                        {topTags.slice(7).map(([tag, count]) => (
                          <span 
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                          >
                            {tag}
                            <span className="ml-1 text-gray-500">({count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* タグランキングサマリー */}
                  {summary && (
                    <div className="mt-6 text-sm text-blue-700 font-medium">
                      {summary}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* インプット記録による興味・関心分析 */}
            {inputs.length > 0 && inputAnalysis && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">興味・関心分析</h3>
                    <div className="text-sm text-gray-500">
                      {inputs.length}件のインプットから分析
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 好きなジャンル（ランキング形式） */}
                    <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 rounded-xl p-5 border border-blue-200">
                      <h4 className="text-lg font-semibold text-blue-700 mb-4">
                        好きなジャンル
                      </h4>
                      {inputAnalysis.topGenres && inputAnalysis.topGenres.length > 0 ? (
                        <div className="space-y-3">
                          {inputAnalysis.topGenres.slice(0, 5).map((genreItem, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-blue-400/30">
                                  {index + 1}
                                </div>
                                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-white">
                                  {typeof genreItem === 'string' ? genreItem : genreItem.genre}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-blue-100 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ 
                                      width: `${Math.min(((typeof genreItem === 'object' && genreItem.count ? genreItem.count : 1) / Math.max(...inputAnalysis.topGenres.map(g => typeof g === 'object' && g.count ? g.count : 1))) * 100, 100)}%` 
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-blue-600 w-6 text-right">
                                  {typeof genreItem === 'object' && genreItem.count ? genreItem.count : ''}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState title="まだジャンルが登録されていません" />
                      )}
                    </div>

                    {/* 関心キーワード（ワードクラウド） */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">
                        関心キーワード
                      </h4>
                      {inputAnalysis.topTags && inputAnalysis.topTags.length > 0 ? (
                        <div className="h-48 sm:h-52 flex items-center justify-center">
                          <WordCloud
                            data={inputAnalysis.topTags.map(tagItem => ({
                              value: typeof tagItem === 'string' ? tagItem : tagItem.tag,
                              count: typeof tagItem === 'object' && tagItem.count ? tagItem.count : 1
                            }))}
                            minSize={14}
                            maxSize={32}
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <EmptyState title="まだタグが登録されていません" />
                      )}
                    </div>
                  </div>

                  {/* インサイトサマリー */}
                  <div className="mt-6 p-6 bg-gradient-to-r from-blue-50/60 to-blue-100/30 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 mb-3 text-lg">あなたの興味・関心インサイト</h5>
                        <div className="bg-white/70 rounded-lg p-4 border border-blue-200/50 shadow-sm">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {generateInsightSummary(inputAnalysis)}
                          </p>
                        </div>
                        <p className="mt-3 text-xs text-gray-500">
                          この分析は、あなたが記録したインプットデータを基に自動生成されています。
                          より正確な分析のために、ジャンルやタグの設定を充実させることをお勧めします。
                        </p>
                        <div className="mt-3 pt-3 border-t border-blue-200/50">
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-blue-600">
                              このインサイトはAIによる分析結果です。実際の興味・関心は人それぞれ異なるため、参考程度にお考えください。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 興味傾向分析 */}
                  {(() => {
                    const interestAnalysis = analyzeInterestTendencies(inputAnalysis)
                    return (
                      <div className="mt-6">
                        {/* 分析の説明 */}
                        <div className="mb-4 p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="text-sm text-blue-800 font-medium mb-1">AIによる興味傾向の推察</p>
                              <p className="text-xs text-blue-700">
                                以下の分析は、あなたのインプットデータを基にAIが推測したものです。
                                あくまで参考程度にお考えいただき、実際の興味・関心は人それぞれ異なります。
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* 興味がありそうな分野 */}
                          <div className="bg-gradient-to-br from-green-50/80 to-green-100/50 rounded-xl p-5 border border-green-200">
                            <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              興味がありそうな分野
                            </h4>
                            {interestAnalysis.interestedIn.length > 0 ? (
                              <div className="space-y-2">
                                {interestAnalysis.interestedIn.map((interest, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700">{interest}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">データが不足しています</p>
                            )}
                          </div>

                          {/* あまり興味がなさそうな分野 */}
                          <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/50 rounded-xl p-5 border border-orange-200">
                            <h4 className="text-lg font-semibold text-orange-700 mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              あまり興味がなさそうな分野
                            </h4>
                            {interestAnalysis.notInterestedIn.length > 0 ? (
                              <div className="space-y-2">
                                {interestAnalysis.notInterestedIn.map((interest, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700">{interest}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">データが不足しています</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* 興味傾向分析の推論 */}
                  {(() => {
                    const interestAnalysis = analyzeInterestTendencies(inputAnalysis)
                    if (interestAnalysis.reasoning) {
                      return (
                        <div className="mt-4 p-4 bg-white/60 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            {interestAnalysis.reasoning}
                          </p>
                          <div className="flex items-start gap-2 pt-3 border-t border-gray-200">
                            <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-gray-500">
                              この推論は、限られたデータに基づくAIの推測です。実際の興味・関心は多様で、個人差があります。
                            </p>
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
      
      {/* コンテンツタイプ選択モーダル */}
      <ContentTypeSelector 
        isOpen={isContentTypeSelectorOpen}
        onClose={() => setIsContentTypeSelectorOpen(false)}
      />
    </div>
  )
}

