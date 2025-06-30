'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TabNavigation } from '@/components/ui/TabNavigation'
import { useWorkStatistics } from '@/hooks/useWorkStatistics'
import { PublicFeaturedWorksSection } from '@/features/work/components/PublicFeaturedWorksSection'

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
  isProfileEmpty,
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

  // 作品タグの分析
  const topTags = useMemo(() => {
    const tagCount: { [key: string]: number } = {}
    works.forEach((work) => {
      if (work.tags && Array.isArray(work.tags)) {
        work.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })
    return (Object.entries(tagCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)) as [string, number][];
  }, [works])

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
                {/* 代表作セクション */}
                <PublicFeaturedWorksSection works={works} />
                
                {/* 全作品一覧 */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">全作品</h3>
                    <div className="text-sm text-gray-500">
                      {works.length}件の作品
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {works.map((work) => (
                      <Card key={work.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {work.banner_image_url ? (
                        <Image 
                          src={work.banner_image_url}
                          alt={work.title}
                          fill
                          sizes="100vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                          <div className="text-center">
                                <div className="w-8 h-8 mx-auto mb-2 bg-blue-600 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <p className="text-blue-600 text-sm">画像なし</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors text-sm">{work.title}</h3>
                  </CardContent>
                </Card>
              ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h4 className="text-lg font-semibold text-gray-600 mb-2">まだ作品がありません</h4>
                <p className="text-gray-500">作品が登録されると表示されます</p>
              </div>
            )}
          </div>
        )}

        {/* インプットタブ */}
        {activeTab === 'inputs' && (
          <div>
            {/* インプット一覧 */}
            {inputs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-center py-12">
                
                <h4 className="text-lg font-semibold text-gray-600 mb-2">まだインプットがありません</h4>
                <p className="text-gray-500">インプットが登録されると表示されます</p>
              </div>
            )}
          </div>
        )}

        {/* クリエイター詳細タブ */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* 作品統計・役割分布 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">作品統計・役割分布</h3>
                </div>

                {workStats.totalWorks > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 総作品数表示 */}
                    <div className="text-center lg:text-left">
                      <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 rounded-xl p-6 border border-blue-200">
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
                        <div className="space-y-3">
                          {workStats.roleDistribution.map((role, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">{role.role}</span>
                                <span className="text-sm text-gray-600">{role.count}件 ({role.percentage.toFixed(0)}%)</span>
                              </div>
                              <div className="w-full bg-blue-100 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ 
                                    width: `${role.percentage}%`
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">役割データがありません</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">まだ作品がありません</h4>
                    <p className="text-gray-500">作品が登録されると統計情報が表示されます</p>
                  </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 好きなメディアタイプ */}
                    {inputAnalysis.typeDistribution && Object.keys(inputAnalysis.typeDistribution).length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">好きなメディア</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(inputAnalysis.typeDistribution).slice(0, 8).map(([type, count]) => (
                            <Badge
                              key={type}
                              variant="secondary"
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-sm border border-blue-200"
                            >
                              {type === 'book' ? '書籍' : 
                               type === 'manga' ? '漫画' :
                               type === 'movie' ? '映画' :
                               type === 'anime' ? 'アニメ' :
                               type === 'tv' ? 'TV番組' :
                               type === 'game' ? 'ゲーム' :
                               type === 'podcast' ? 'ポッドキャスト' : 'その他'} ({count as number})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 興味のあるジャンル */}
                    {inputAnalysis.topGenres && inputAnalysis.topGenres.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">好きなジャンル</h4>
                        <div className="flex flex-wrap gap-2">
                          {inputAnalysis.topGenres.slice(0, 8).map((genreItem: any, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1 bg-green-50 text-green-700 text-sm border border-green-200"
                            >
                              {genreItem.name} ({genreItem.count})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
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