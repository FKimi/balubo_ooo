'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WorkData } from '@/types/work'
import type { InputData } from '@/types/input'

interface OverviewSectionProps {
  works: WorkData[]
  inputs: InputData[]
  workStats: any
  profile?: any
  comprehensiveAnalysis?: any
}

export function OverviewSection({ works, inputs, workStats, profile, comprehensiveAnalysis }: OverviewSectionProps) {
  // 記事作品の文字数計算（実際のデータベースフィールドを使用）
  const articleWorks = works.filter(work => work.content_type === 'article')
  const totalArticleWordCount = articleWorks.reduce((sum, work) => sum + (work.article_word_count || 0), 0)
  
  // インプット統計
  const inputsWithRating = inputs.filter(input => input.rating && input.rating > 0)
  const averageInputRating = inputsWithRating.length > 0 
    ? inputsWithRating.reduce((sum, input) => sum + (input.rating || 0), 0) / inputsWithRating.length 
    : 0

  const hasInputs = inputs.length > 0

  // 平均執筆文字数
  const avgWordCount = articleWorks.length > 0 ? Math.round(totalArticleWordCount / articleWorks.length) : 0

  // プロフェッショナルレベルの判定
  const getExpertiseLevel = () => {
    if (works.length >= 10 && totalArticleWordCount >= 50000) return 'エキスパート'
    if (works.length >= 5 && totalArticleWordCount >= 20000) return 'プロフェッショナル'
    if (works.length >= 3 && totalArticleWordCount >= 5000) return '経験者'
    return '新進クリエイター'
  }

  const expertise = getExpertiseLevel()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 自己紹介セクション */}
      {profile?.introduction && (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <span>📝</span>
              <span>自己紹介</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {profile.introduction}
            </p>
          </CardContent>
        </Card>
      )}

      {/* できること・スキルセクション */}
      {profile?.skills && (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <span>⚡</span>
              <span>できること</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {profile.skills}
            </p>
          </CardContent>
        </Card>
      )}

      {/* キャリアセクション */}
      {profile?.career && (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <span>💼</span>
              <span>キャリア</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {profile.career}
            </p>
          </CardContent>
        </Card>
      )}

      {/* エキスパート認定バッジ */}
      {works.length >= 3 && (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">🏆 {expertise}</h3>
                <p className="text-blue-100">
                  実績作品{works.length}件、総文字数{totalArticleWordCount.toLocaleString()}文字の経験豊富なクリエイター
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{workStats.roleDistribution.length}</div>
                <div className="text-sm text-blue-100">対応可能役割</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* サマリーカード */}
      <div className={`grid gap-4 ${hasInputs ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'}`}>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                {works.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">総作品数</div>
              <div className="text-xs text-gray-500 mt-1">実績豊富</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                {totalArticleWordCount.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">総文字数</div>
              <div className="text-xs text-gray-500 mt-1">平均: {avgWordCount.toLocaleString()}文字</div>
            </div>
          </CardContent>
        </Card>

        {hasInputs && (
          <>
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                    {inputs.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">インプット数</div>
                  <div className="text-xs text-gray-500 mt-1">学習意欲旺盛</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                    {averageInputRating > 0 ? averageInputRating.toFixed(1) : '-'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">平均評価</div>
                  <div className="text-xs text-gray-500 mt-1">評価済み: {inputsWithRating.length}件</div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* クライアント推薦ポイント */}
      {works.length >= 3 && (
        <Card className="border-accent-dark-blue border-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-accent-dark-blue">
              <span>🎯</span>
              <span>クライアント推薦ポイント</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">✨ 強み・特徴</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>実績作品{works.length}件の豊富な経験</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>総{totalArticleWordCount.toLocaleString()}文字の執筆実績</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{workStats.roleDistribution.length}つの専門役割をカバー</span>
                  </li>
                  {averageInputRating >= 4.0 && (
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>高い品質意識（評価{averageInputRating.toFixed(1)}/5.0）</span>
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">🚀 期待できる成果</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {avgWordCount >= 2000 && (
                    <li className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>充実したボリュームの記事作成</span>
                    </li>
                  )}
                  {workStats.roleDistribution.length >= 2 && (
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>多角的な視点でのプロジェクト推進</span>
                    </li>
                  )}
                  {hasInputs && (
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>継続的な学習による品質向上</span>
                    </li>
                  )}
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>安定した品質でのコンテンツ制作</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 実績サマリー */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <span>📊</span>
            <span>実績サマリー</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* 役割分布 */}
          {workStats.roleDistribution.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">主な役割分布（トップ5）</h4>
              <div className="space-y-3">
                {workStats.roleDistribution.slice(0, 5).map((role: any, index: number) => (
                  <div key={role.role}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm text-gray-700">{role.role}</span>
                      <span className="text-xs sm:text-sm font-medium">{role.count}件 ({role.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          backgroundColor: role.color,
                          width: `${role.percentage}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 最近の活動状況 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">最近の活動状況</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-500 text-xl">🎨</div>
                  <div>
                    <div className="font-medium text-blue-900">作品制作</div>
                    <div className="text-sm text-blue-700">
                      {(() => {
                        const recentWorks = works.filter(work => 
                          work.created_at && 
                          new Date(work.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        ).length
                        return recentWorks > 0 
                          ? `最近30日で${recentWorks}件の作品を制作`
                          : '継続的な制作活動を実施'
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {hasInputs && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-purple-500 text-xl">📚</div>
                    <div>
                      <div className="font-medium text-purple-900">学習活動</div>
                      <div className="text-sm text-purple-700">
                        {(() => {
                          const recentInputs = inputs.filter(input => 
                            input.createdAt && 
                            new Date(input.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                          ).length
                          return recentInputs > 0 
                            ? `最近30日で${recentInputs}件のインプット`
                            : '継続的な学習活動を実施'
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* インプットがない場合の案内 */}
          {!hasInputs && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-blue-500 text-xl">💡</div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">インプット機能を活用しましょう</h4>
                  <p className="text-sm text-blue-700">
                    書籍、映画、記事などのインプットを記録することで、より詳細な分析とレポートが作成できます。
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 総合分析セクション */}
      {comprehensiveAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span>🌟</span>
              <span>クリエイター分析</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 創造性・専門性・影響力の分析を統合した実用的な表示 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 強み・特徴 */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-blue-600 flex items-center gap-2">
                  <span>💎</span>強み・特徴
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const allStrengths = new Set()
                    Object.values(comprehensiveAnalysis).forEach((analysis: any) => {
                      if (analysis.insights) {
                        analysis.insights.slice(0, 2).forEach((insight: string) => allStrengths.add(insight))
                      }
                    })
                    return Array.from(allStrengths).slice(0, 4).map((strength: any, i: number) => (
                      <div key={i} className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700">{strength}</p>
                      </div>
                    ))
                  })()}
                </div>
              </div>

              {/* 発注者へのアピールポイント */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-green-600 flex items-center gap-2">
                  <span>🎯</span>発注者へのアピール
                </h4>
                <div className="space-y-2">
                  {works.length >= 3 && (
                    <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                      <p className="text-sm font-medium text-green-800">豊富な実績</p>
                      <p className="text-xs text-green-600">{works.length}件の作品制作経験</p>
                    </div>
                  )}
                  
                  {workStats.totalWordCount > 10000 && (
                    <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                      <p className="text-sm font-medium text-green-800">高い文章力</p>
                      <p className="text-xs text-green-600">総{workStats.totalWordCount.toLocaleString()}文字の執筆実績</p>
                    </div>
                  )}
                  
                  {workStats.roleDistribution.length >= 2 && (
                    <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                      <p className="text-sm font-medium text-green-800">多角的対応力</p>
                      <p className="text-xs text-green-600">{workStats.roleDistribution.length}つの役割を経験</p>
                    </div>
                  )}
                  
                  {hasInputs && (
                    <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                      <p className="text-sm font-medium text-green-800">継続的学習姿勢</p>
                      <p className="text-xs text-green-600">{inputs.length}件のインプット活動</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 今後の成長の方向性 */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-purple-600 flex items-center gap-2">
                  <span>🚀</span>成長の方向性
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const suggestions = []
                    
                    // 作品数に基づく提案
                    if (works.length < 5) {
                      suggestions.push({
                        title: "作品数の充実",
                        description: "ポートフォリオの厚みを増すことで信頼性向上"
                      })
                    }
                    
                    // 役割の多様化提案
                    if (workStats.roleDistribution.length < 3) {
                      suggestions.push({
                        title: "新領域への挑戦",
                        description: "異なる役割での経験により市場価値向上"
                      })
                    }
                    
                    // 文字数に基づく提案
                    const avgWordCount = works.filter(w => w.content_type === 'article').length > 0 
                      ? workStats.totalWordCount / works.filter(w => w.content_type === 'article').length 
                      : 0
                    
                    if (avgWordCount < 2000 && avgWordCount > 0) {
                      suggestions.push({
                        title: "長文コンテンツへの挑戦",
                        description: "深掘りした記事で専門性をアピール"
                      })
                    }
                    
                    // インプット強化提案
                    if (!hasInputs || inputs.length < 5) {
                      suggestions.push({
                        title: "インプット活動の強化",
                        description: "継続的学習でクリエイティブの幅を拡大"
                      })
                    }
                    
                    return suggestions.slice(0, 3).map((suggestion, i) => (
                      <div key={i} className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-400">
                        <p className="text-sm font-medium text-purple-800">{suggestion.title}</p>
                        <p className="text-xs text-purple-600">{suggestion.description}</p>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </div>

            {/* 代表作品の紹介 */}
            {works.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <span>✨</span>注目作品
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {works.slice(0, 2).map((work, i) => (
                    <div key={i} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-2 line-clamp-2">{work.title}</h5>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {work.roles && work.roles.slice(0, 2).map((role: string, j: number) => (
                          <span key={j} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {role}
                          </span>
                        ))}
                      </div>
                      {work.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {work.description.slice(0, 100)}...
                        </p>
                      )}
                      {work.article_word_count && (
                        <p className="text-xs text-gray-500 mt-2">
                          文字数: {work.article_word_count.toLocaleString()}文字
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* クライアント向けメッセージ */}
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
              <h4 className="font-bold text-lg text-amber-800 mb-3 flex items-center gap-2">
                <span>📢</span>発注者の方へ
              </h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                {works.length >= 5 
                  ? `豊富な実績（${works.length}件）と継続的な学習姿勢により、安定した品質でのコンテンツ制作をお約束します。` 
                  : works.length >= 3
                  ? `実績（${works.length}件）を積み重ね、品質向上に努めております。新しい挑戦にも意欲的に取り組みます。`
                  : `真摯にコンテンツ制作に取り組んでおり、クライアント様のご要望に丁寧にお応えいたします。`
                }
                {workStats.roleDistribution.length >= 2 && 
                  ` ${workStats.roleDistribution.length}つの異なる役割での経験により、多角的な視点でプロジェクトに貢献できます。`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 