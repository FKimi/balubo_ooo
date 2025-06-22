'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PublicProfileTabsProps {
  activeTab: 'profile' | 'works' | 'inputs'
  setActiveTab: (tab: 'profile' | 'works' | 'inputs') => void
  profile: any
  works: any[]
  inputs: any[]
  skills: string[]
  career: any[]
  isProfileEmpty: boolean
}

export function PublicProfileTabs({
  activeTab,
  setActiveTab,
  profile,
  works,
  inputs,
  skills,
  career,
  isProfileEmpty
}: PublicProfileTabsProps) {

  // 作品統計の計算
  const workStats = useMemo(() => {
    if (!works || works.length === 0) {
      return {
        totalWorks: 0,
        roles: {},
        monthlyActivity: [],
        recentActivity: [],
        mostActiveMonth: null,
        mostActiveYear: null,
        yearlyActivity: []
      }
    }

    // 役割分布の計算
    const roles = works.reduce((acc, work) => {
      if (work.roles && Array.isArray(work.roles)) {
        work.roles.forEach((role: string) => {
          acc[role] = (acc[role] || 0) + 1
        })
      } else if (work.roles) {
        acc[work.roles] = (acc[work.roles] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // 月別アクティビティの計算
    const monthCounts: Record<string, number> = {}
    works.forEach(work => {
      const date = new Date(work.created_at)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const key = `${year}-${month.toString().padStart(2, '0')}`
      monthCounts[key] = (monthCounts[key] || 0) + 1
    })

    const monthlyActivity = Object.entries(monthCounts).map(([key, count]) => {
      const parts = key.split('-')
      const year = parts[0] ? parseInt(parts[0]) : 0
      const month = parts[1] ? parseInt(parts[1]) : 0
      return {
        month,
        year,
        count,
        displayMonth: `${year}年${month}月`
      }
    }).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.month - a.month
    })

    // 最近のアクティビティ（最新6ヶ月）
    const recentActivity = monthlyActivity.slice(0, 6)

    // 最も活動的だった月
    const mostActiveMonth = monthlyActivity.length > 0 
      ? monthlyActivity.reduce((max, current) => current.count > max.count ? current : max)
      : null

    // 年別アクティビティの計算
    const yearCounts: Record<number, number> = {}
    works.forEach(work => {
      const year = new Date(work.created_at).getFullYear()
      yearCounts[year] = (yearCounts[year] || 0) + 1
    })

    const yearlyActivity = Object.entries(yearCounts)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => b.year - a.year)

    // 最も活動的だった年
    const mostActiveYear = yearlyActivity.length > 0
      ? yearlyActivity.reduce((max, current) => current.count > max.count ? current : max)
      : null

    return {
      totalWorks: works.length,
      roles,
      monthlyActivity,
      recentActivity,
      mostActiveMonth,
      mostActiveYear,
      yearlyActivity
    }
  }, [works])

  // インプット分析の計算
  const inputAnalysis = {
    totalInputs: inputs.length,
    favoriteCount: inputs.filter(input => input.favorite).length,
    averageRating: inputs.length > 0 
      ? inputs.reduce((sum, input) => sum + (input.rating || 0), 0) / inputs.length 
      : 0,
    typeDistribution: inputs.reduce((acc, input) => {
      acc[input.type] = (acc[input.type] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    genresDistribution: inputs.reduce((acc, input) => {
      if (input.genres && Array.isArray(input.genres)) {
        input.genres.forEach((genre: string) => {
          acc[genre] = (acc[genre] || 0) + 1
        })
      } else if (input.genres) {
        acc[input.genres] = (acc[input.genres] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>),
    topGenres: [],
    topTags: []
  }

  return (
    <div className="space-y-6">
      {/* タブナビゲーション */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          👤 プロフィール
        </button>
        <button 
          onClick={() => setActiveTab('works')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'works' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          🎨 作品 ({works.length})
        </button>
        <button 
          onClick={() => setActiveTab('inputs')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'inputs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          📚 インプット ({inputs.length})
        </button>
      </div>

      {/* タブコンテンツ */}
      <div className="mt-6">
        {/* プロフィールタブ */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* プロフィール充実度メッセージ */}
            {(!profile?.bio && (!skills || skills.length === 0) && (!career || career.length === 0)) && (
              <Card className="border-dashed border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">素敵なクリエイターです！</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    このクリエイターは現在プロフィールを充実させている最中です。<br />
                    作品を通じて、その才能と個性を表現しています。
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 自己紹介セクション */}
            {profile?.introduction && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">📝 自己紹介</h3>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {profile.introduction}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* できること（スキル）セクション */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">⚡ できること</h3>
                </div>

                {skills && skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 bg-purple-100 text-purple-800 text-sm"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">💡</div>
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
                  <h3 className="text-xl font-bold text-gray-900">💼 キャリア</h3>
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
                    <div className="text-4xl mb-3">💼</div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">キャリア情報なし</h4>
                    <p className="text-gray-500">まだキャリア情報が登録されていません</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* よく使用するタグ */}
            {(() => {
              const tagCount: { [key: string]: number } = {}
              works.forEach(work => {
                if (work.tags && Array.isArray(work.tags)) {
                  work.tags.forEach((tag: string) => {
                    tagCount[tag] = (tagCount[tag] || 0) + 1
                  })
                } else if (work.tags) {
                  tagCount[work.tags] = (tagCount[work.tags] || 0) + 1
                }
              })
              
              const topTags = Object.entries(tagCount)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)

              return topTags.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">🏷️ よく使用するタグ</h3>
                    <div className="space-y-3">
                      {topTags.map(([tag, count], index) => (
                        <div key={tag} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <Badge variant="outline" className="text-sm">
                              {tag}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min((count / Math.max(...topTags.map(([, c]) => c))) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                          💡
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-900 mb-1">タグ分析について</h5>
                          <p className="text-sm text-blue-700">
                            作品に設定したタグの使用頻度を分析しています。よく使用するタグは、このクリエイターの専門分野や得意領域を表しており、ポートフォリオの特色を示す重要な指標です。
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })()}

            {/* 作品統計・役割分布 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">📊 作品統計・役割分布</h3>
                </div>

                {workStats.totalWorks > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 総作品数表示 */}
                    <div className="text-center lg:text-left">
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">総作品数</h4>
                        <div className="text-4xl font-bold text-indigo-600">{workStats.totalWorks}</div>
                        <p className="text-gray-600 mt-2">これまでに制作した作品</p>
                        
                        {/* 総文字数（記事作品がある場合のみ表示） */}
                        {(() => {
                          const totalWordCount = works.reduce((sum, work) => {
                            if (work.ai_analysis_result && work.ai_analysis_result.wordCount) {
                              return sum + work.ai_analysis_result.wordCount
                            }
                            return sum
                          }, 0)
                          
                          return totalWordCount > 0 && (
                            <div className="mt-4 pt-4 border-t border-indigo-200">
                              <h5 className="text-sm font-medium text-gray-600 mb-1">総文字数</h5>
                              <div className="text-2xl font-bold text-blue-600">
                                {totalWordCount.toLocaleString('ja-JP')}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">記事・ライティング作品の合計</p>
                            </div>
                          )
                        })()}
                      </div>
                    </div>

                    {/* 役割分布 */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">役割分布</h4>
                      {Object.keys(workStats.roles).length > 0 ? (
                        <div className="space-y-3">
                          {(() => {
                            const roleEntries = Object.entries(workStats.roles)
                            const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']
                            
                            return roleEntries.map(([role, count], index) => {
                              const percentage = ((count as number) / workStats.totalWorks) * 100
                              const color = colors[index % colors.length]
                              
                              return (
                                <div key={role} className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">{role}</span>
                                    <span className="text-sm text-gray-600">{count as number}件 ({percentage.toFixed(0)}%)</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="h-2 rounded-full transition-all duration-300" 
                                      style={{ 
                                        width: `${percentage}%`,
                                        backgroundColor: color
                                      }}
                                    />
                                  </div>
                                </div>
                              )
                            })
                          })()}
                        </div>
                      ) : (
                        <p className="text-gray-500">役割データがありません</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📁</div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">まだ作品がありません</h4>
                    <p className="text-gray-500">今後の作品投稿をお楽しみに</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 月別アクティビティ */}
            {workStats.monthlyActivity.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">📅 アクティビティ履歴</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 最近のアクティビティ */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span>🔥</span>
                        <span>最近の活動</span>
                      </h4>
                      {workStats.recentActivity.length > 0 ? (
                        <div className="space-y-3">
                          {workStats.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                  {activity.month}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{activity.displayMonth}</div>
                                  <div className="text-sm text-gray-600">{activity.count}件の作品</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300" 
                                    style={{ 
                                      width: `${Math.min((activity.count / Math.max(...workStats.recentActivity.map(a => a.count))) * 100, 100)}%` 
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-blue-600">{activity.count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">最近のアクティビティがありません</p>
                      )}
                    </div>

                    {/* 年別統計とハイライト */}
                    <div className="space-y-6">
                      {/* 最も活動的だった月 */}
                      {workStats.mostActiveMonth && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                          <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <span>🏆</span>
                            <span>最も活動的だった月</span>
                          </h4>
                          <div className="text-lg font-bold text-green-700">{workStats.mostActiveMonth.displayMonth}</div>
                          <div className="text-sm text-green-600">{workStats.mostActiveMonth.count}件の作品を制作</div>
                        </div>
                      )}

                      {/* 最も活動的だった年 */}
                      {workStats.mostActiveYear && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                          <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
                            <span>🎯</span>
                            <span>最も活動的だった年</span>
                          </h4>
                          <div className="text-lg font-bold text-purple-700">{workStats.mostActiveYear.year}年</div>
                          <div className="text-sm text-purple-600">{workStats.mostActiveYear.count}件の作品を制作</div>
                        </div>
                      )}

                      {/* 年別サマリー */}
                      {workStats.yearlyActivity.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span>📊</span>
                            <span>年別サマリー</span>
                          </h4>
                          <div className="space-y-2">
                            {workStats.yearlyActivity.slice(0, 3).map((year, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">{year.year}年</span>
                                <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">{year.count}件</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 全月別履歴（展開可能） */}
                  {workStats.monthlyActivity.length > 6 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2 mb-4">
                          <span>📋 全アクティビティ履歴を表示</span>
                          <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </summary>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {workStats.monthlyActivity.map((activity, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="font-medium text-gray-900 text-sm">{activity.displayMonth}</div>
                              <div className="text-xs text-gray-600">{activity.count}件</div>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                <div 
                                  className="bg-blue-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ 
                                    width: `${Math.min((activity.count / Math.max(...workStats.monthlyActivity.map(a => a.count))) * 100, 100)}%` 
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* インプット記録による興味・関心分析 */}
            {inputs.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span>🧠</span>
                      <span>興味・関心分析</span>
                    </h3>
                    <div className="text-sm text-gray-500">
                      {inputs.length}件のインプットから分析
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 好きなメディアタイプ */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <span>📱</span>
                        <span>好きなメディア</span>
                      </h4>
                      {Object.keys(inputAnalysis.typeDistribution).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(inputAnalysis.typeDistribution).slice(0, 4).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {type === 'book' ? '📚' : 
                                   type === 'manga' ? '📖' :
                                   type === 'movie' ? '🎬' :
                                   type === 'anime' ? '🎭' :
                                   type === 'tv' ? '📺' :
                                   type === 'game' ? '🎮' :
                                   type === 'podcast' ? '🎧' : '📄'}
                                </span>
                                <span className="text-sm font-medium text-gray-700">
                                  {type === 'book' ? '書籍' : 
                                   type === 'manga' ? '漫画' :
                                   type === 'movie' ? '映画' :
                                   type === 'anime' ? 'アニメ' :
                                   type === 'tv' ? 'TV番組' :
                                   type === 'game' ? 'ゲーム' :
                                   type === 'podcast' ? 'ポッドキャスト' : 'その他'}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-blue-600">{count as number}件</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-blue-600">データが不足しています</p>
                      )}
                    </div>

                    {/* 興味のあるジャンル */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                      <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                        <span>🎭</span>
                        <span>好きなジャンル</span>
                      </h4>
                      {Object.keys(inputAnalysis.genresDistribution).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(inputAnalysis.genresDistribution).slice(0, 5).map(([genre, count], index) => (
                            <div key={genre} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                                  {genre}
                                </Badge>
                              </div>
                              <span className="text-sm font-bold text-green-600">{count as number}件</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-green-600">まだジャンルが登録されていません</p>
                      )}
                    </div>

                    {/* 統計情報 */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                      <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                        <span>📊</span>
                        <span>統計情報</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">総インプット数</span>
                          <span className="text-sm font-bold text-purple-600">{inputAnalysis.totalInputs}件</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">お気に入り</span>
                          <span className="text-sm font-bold text-pink-600">{inputAnalysis.favoriteCount}件</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">平均評価</span>
                          <span className="text-sm font-bold text-yellow-600">
                            {inputAnalysis.averageRating ? `${inputAnalysis.averageRating.toFixed(1)}★` : 'なし'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 分析サマリー */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💡</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 mb-2">このクリエイターの興味・関心プロフィール</h5>
                        <p className="text-sm text-gray-600">
                          このクリエイターは{inputAnalysis.totalInputs}件のインプットを記録しており、
                          {inputAnalysis.favoriteCount > 0 && `そのうち${inputAnalysis.favoriteCount}件をお気に入りに登録しています。`}
                          多様なメディアから情報を収集し、創作活動に活かしています。
                        </p>
                        <p className="mt-3 text-xs text-gray-500">
                          この分析は、記録されたインプットデータを基に自動生成されています。
                          クリエイターの興味・関心の傾向を表しています。
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 作品タブ */}
        {activeTab === 'works' && (
          <div>
            {works.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {works.map((work) => (
                  <Card key={work.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {work.banner_image_url ? (
                        <Image 
                          src={work.banner_image_url}
                          alt={work.title}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl text-gray-400 mb-2">🎨</div>
                            <p className="text-xs text-gray-500">画像なし</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{work.title}</h3>
                      {work.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{work.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {work.roles ? 
                            (Array.isArray(work.roles) ? work.roles.join(', ') : work.roles) 
                            : '役割未設定'}
                        </span>
                        <span>{new Date(work.created_at).toLocaleDateString('ja-JP')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎨</div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">まだ作品がありません</h4>
                <p className="text-gray-500">作品が登録されると表示されます</p>
              </div>
            )}
          </div>
        )}

        {/* インプットタブ */}
        {activeTab === 'inputs' && (
          <div>
            {/* インプット分析 */}
            {inputs.length > 0 && (
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 統計情報 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-purple-600">📈</span>
                    統計情報
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">総インプット数</span>
                      <span className="text-lg font-bold text-purple-600">{inputAnalysis.totalInputs}件</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">お気に入り</span>
                      <span className="text-lg font-bold text-pink-600">{inputAnalysis.favoriteCount}件</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">平均評価</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {inputAnalysis.averageRating ? `${inputAnalysis.averageRating.toFixed(1)}★` : 'なし'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* タイプ分布 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">📊</span>
                    タイプ分布
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(inputAnalysis.typeDistribution).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{type}</span>
                        <span className="text-lg font-bold text-blue-600">{count as number}件</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* インプット一覧 */}
            {inputs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inputs.map((input) => (
                  <div key={input.id} className="group bg-white rounded-xl border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1">
                    {/* インプット画像またはプレースホルダー */}
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {input.cover_image_url ? (
                        <Image
                          src={input.cover_image_url}
                          alt={input.title}
                          fill
                          sizes="100vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">
                              {input.type === 'book' && '📚'}
                              {input.type === 'manga' && '📖'}
                              {input.type === 'movie' && '🎬'}
                              {input.type === 'anime' && '🎭'}
                              {input.type === 'tv' && '📺'}
                              {input.type === 'youtube' && '🎥'}
                              {input.type === 'game' && '🎮'}
                              {input.type === 'podcast' && '🎧'}
                              {input.type === 'other' && '📄'}
                            </div>
                            <p className="text-gray-500 text-sm">{input.type}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* お気に入りアイコン */}
                      {input.favorite && (
                        <div className="absolute top-2 left-2 w-8 h-8 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-100">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </div>
                      )}

                      {/* 評価アイコン */}
                      {input.rating && input.rating > 0 && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-500/80 text-white rounded-full flex items-center justify-center opacity-100">
                          <span className="text-sm font-bold">{input.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* インプット情報 */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {input.title}
                      </h3>
                      
                      {/* 作者・制作者 */}
                      {input.author_creator && (
                        <div className="flex items-center gap-1 mb-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm text-gray-600 font-medium">{input.author_creator}</span>
                        </div>
                      )}
                      
                      {/* ノート */}
                      {input.notes && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {input.notes}
                        </p>
                      )}

                      {/* タイプとジャンル */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800">
                          {input.type}
                        </Badge>
                        {input.genres && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {Array.isArray(input.genres) ? input.genres.slice(0, 2).join(', ') : input.genres}
                          </Badge>
                        )}
                      </div>

                      {/* 外部リンクと日付 */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        {input.external_url && (
                          <a 
                            href={input.external_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            詳細を見る
                          </a>
                        )}
                        <span>{new Date(input.created_at).toLocaleDateString('ja-JP')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">まだインプットがありません</h4>
                <p className="text-gray-500">インプットが登録されると表示されます</p>
              </div>
            )}


          </div>
        )}
      </div>
    </div>
  )
} 