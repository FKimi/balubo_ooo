'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TabNavigation } from '@/components/ui/TabNavigation'
import { useWorkStatistics } from '@/hooks/useWorkStatistics'
import { PublicFeaturedWorksSection } from '@/features/work/components/PublicFeaturedWorksSection'
import { PublicWorksCategoryManager } from '@/features/work/components/PublicWorksCategoryManager'
import { RolePieChart } from './RolePieChart'
import { calculateTopTags } from '@/utils/profileUtils'
import { EmptyState } from '@/components/common'
import { CreatorIntroCard } from './CreatorIntroCard'

interface PublicProfileTabsProps {
  activeTab: 'profile' | 'works' | 'inputs' | 'details'
  setActiveTab: (tab: 'profile' | 'works' | 'inputs' | 'details') => void
  profile: any
  works: any[]
  inputs: any[]
  skills: string[]
  career: any[]
  isProfileEmpty: boolean
  inputAnalysis?: any // オプショナルとして追加
}

export function PublicProfileTabs({
  activeTab,
  setActiveTab,
  profile,
  works,
  inputs,
  skills,
  career,
  inputAnalysis: propInputAnalysis
}: PublicProfileTabsProps) {
  // 作品統計の計算（プライベートプロフィールと同じフックを使用）
  const workStats = useWorkStatistics(works)

  // インプット分析の計算（propsで渡された場合はそれを優先、なければ自分で計算）
  const inputAnalysis = useMemo(() => {
    if (propInputAnalysis) {
      return propInputAnalysis
    }

    const totalInputs = inputs.length
    const favoriteCount = inputs.filter((input) => input.favorite).length
    const averageRating =
      totalInputs > 0
        ? inputs.reduce((sum, input) => sum + (input.rating || 0), 0) /
          totalInputs
        : 0

    const typeDistribution = inputs.reduce((acc, input) => {
      const type = input.type || '未分類'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const genresDistribution = inputs.reduce((acc, input) => {
      if (input.genres && Array.isArray(input.genres)) {
        input.genres.forEach((genre: string) => {
          acc[genre] = (acc[genre] || 0) + 1
        })
      }
      return acc
    }, {} as Record<string, number>)

    const topGenres = Object.entries(genresDistribution)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([name, count]) => ({ name, count: count as number }))

    return {
      totalInputs,
      favoriteCount,
      averageRating,
      typeDistribution,
      genresDistribution,
      topGenres,
    }
  }, [propInputAnalysis, inputs])

  const workCategories = useMemo(() => {
    const categories: { [key: string]: any } = {}

    works.forEach(work => {
      const categoryId = work.category_id || 'uncategorized'
      if (!categories[categoryId]) {
        categories[categoryId] = {
          id: categoryId,
          name: work.category_name || (categoryId === 'uncategorized' ? '未分類' : '不明なカテゴリ'),
          works: [],
        }
      }
      categories[categoryId].works.push(work)
    })

    return Object.values(categories)
  }, [works])

  // 作品タグの分析
  const topTags = useMemo(() => calculateTopTags(works), [works])

  // 自己紹介テキスト（introduction が優先、なければ bio）
  const introductionText = profile?.introduction || profile?.bio || ''

  // タブ設定
  const tabs = [
    { key: 'profile', label: 'プロフィール' },
    { key: 'works', label: '作品', count: works.length },
    { key: 'inputs', label: 'インプット', count: inputs.length },
    { key: 'details', label: 'クリエイター詳細' }
  ]

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
            {/* プロフィール充実度メッセージ */}
            {(!profile?.bio && (!skills || skills.length === 0) && (!career || career.length === 0)) && (
              <Card className="border-dashed border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">素敵なクリエイターです！</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    このクリエイターは現在プロフィールを充実させている最中です。<br />
                    作品を通じて、その才能と個性を表現しています。
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 自己紹介セクション */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">自己紹介</h3>
                </div>

                {introductionText ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {introductionText}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">まだ詳細な自己紹介が登録されていません</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* できること（スキル）セクション */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">できること</h3>
                </div>

                {skills && skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm border border-blue-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">スキル情報なし</h4>
                    <p className="text-gray-500">まだスキルが登録されていません</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* キャリアセクション */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">キャリア</h3>
                </div>

                {career && career.length > 0 ? (
                  <div className="space-y-4">
                    {career.map((careerItem, index) => (
                      <div key={careerItem.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{careerItem.position}</h4>
                              {careerItem.isCurrent && (
                                <Badge className="bg-green-100 text-green-800 text-xs">現職</Badge>
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
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">

                    <h4 className="text-lg font-semibold text-gray-600 mb-2">キャリア情報なし</h4>
                    <p className="text-gray-500">まだキャリア情報が登録されていません</p>
                  </div>
                )}
              </CardContent>
            </Card>


          </div>
        )}

        {/* 作品タブ */}
        {activeTab === 'works' && (
          <div>
            {works.length > 0 ? (
              <>
                <PublicFeaturedWorksSection works={works} />
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">全作品</h3>
                  </div>
                  <PublicWorksCategoryManager works={works} categories={workCategories} />
                </div>
              </>
            ) : (
              <EmptyState
                title="まだ作品がありません"
                message="作品が登録されると表示されます"
              />
            )}
          </div>
        )}

        {/* インプットタブ */}
        {activeTab === 'inputs' && (
          <div>
            {/* インプット一覧 */}
            {inputs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto justify-items-center">
                {inputs.map((input) => (
                  <div key={input.id} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer">
                    {/* インプット画像またはプレースホルダー */}
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {input.cover_image_url ? (
                        <Image
                          src={input.cover_image_url}
                          alt={input.title}
                          fill
                          sizes="100vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">
                              📄
                            </div>
                            <p className="text-gray-500 text-sm">{input.type}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* タイトルのみ */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm">
                        {input.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="まだインプットがありません"
                message="インプットが登録されると表示されます"
              />
            )}
          </div>
        )}

        {/* クリエイター詳細タブ */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* クリエイター紹介 */}
            {profile && (
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
                        <RolePieChart roles={workStats.roleDistribution} />
                      ) : (
                        <EmptyState title="役割データがありません" />
                      )}
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="まだ作品がありません"
                    message="作品が登録されると統計情報が表示されます"
                  />
                )}
              </CardContent>
            </Card>

            {/* よく使用するタグ */}
            {topTags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">よく使用するタグ</h3>
                    <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      得意分野・専門領域
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {topTags.slice(0, 5).map(([tag, count]: [string, number], index: number) => (
                      <div 
                        key={tag} 
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm hover:shadow-blue-400/20 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            index < 3 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-400/30' 
                              : 'bg-blue-50 text-blue-600 border border-blue-200'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-base font-medium text-gray-900">
                            {tag}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            index < 3 ? 'text-blue-600' : 'text-blue-400'
                          }`}>
                            {count}
                          </div>
                          <div className="text-xs text-gray-500">件の作品</div>
                        </div>
                      </div>
                    ))}
                  </div>
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

                  <div className="space-y-8">
                    {/* 関心分野の可視化 */}
                    {inputAnalysis.topGenres && inputAnalysis.topGenres.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          関心分野とテーマ
                        </h4>
                        <div className="space-y-3">
                          {inputAnalysis.topGenres.slice(0, 6).map((genreItem: any, index: number) => {
                            const percentage = ((genreItem.count / inputs.length) * 100).toFixed(0)
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <span className="font-medium text-gray-900">{genreItem.name}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-blue-600">{genreItem.count}</div>
                                  <div className="text-xs text-gray-500">{percentage}%</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}


                    {/* インプットの深度分析 */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        インプットの特徴
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                          <div className="text-2xl font-bold text-indigo-600">{inputs.length}</div>
                          <div className="text-sm text-gray-600">総インプット数</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                          <div className="text-2xl font-bold text-purple-600">
                            {inputAnalysis.favoriteCount || 0}
                          </div>
                          <div className="text-sm text-gray-600">お気に入り</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                          <div className="text-2xl font-bold text-pink-600">
                            {inputAnalysis.averageRating ? inputAnalysis.averageRating.toFixed(1) : '0.0'}
                          </div>
                          <div className="text-sm text-gray-600">平均評価</div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          この分析は、記録されたインプットデータを基に自動生成されています。
                          より正確な分析のために、ジャンルやタグの設定を充実させることをお勧めします。
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 