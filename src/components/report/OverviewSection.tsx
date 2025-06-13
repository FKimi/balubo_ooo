'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleProgress } from './SimpleProgress'
import type { WorkData } from '@/types/work'
import type { InputData } from '@/types/input'

interface OverviewSectionProps {
  works: WorkData[]
  inputs: InputData[]
  workStats: any
}

export function OverviewSection({ works, inputs, workStats }: OverviewSectionProps) {
  // 記事作品の文字数計算（実際のデータベースフィールドを使用）
  const articleWorks = works.filter(work => work.content_type === 'article')
  const totalArticleWordCount = articleWorks.reduce((sum, work) => sum + (work.article_word_count || 0), 0)
  
  // 本文付き記事の割合
  const articlesWithContent = articleWorks.filter(work => work.article_has_content).length
  const articleContentRate = articleWorks.length > 0 ? (articlesWithContent / articleWorks.length) * 100 : 0
  
  // インプット評価統計
  const inputsWithRating = inputs.filter(input => input.rating && input.rating > 0)
  const averageInputRating = inputsWithRating.length > 0 
    ? inputsWithRating.reduce((sum, input) => sum + (input.rating || 0), 0) / inputsWithRating.length 
    : 0
  const ratedInputsRate = inputs.length > 0 ? (inputsWithRating.length / inputs.length) * 100 : 0

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

  // 品質スコアの計算
  const qualityScore = () => {
    let score = 0
    if (articleContentRate >= 80) score += 25
    else if (articleContentRate >= 60) score += 20
    else if (articleContentRate >= 40) score += 15
    
    if (averageInputRating >= 4.0) score += 25
    else if (averageInputRating >= 3.5) score += 20
    else if (averageInputRating >= 3.0) score += 15
    
    if (workStats.roleDistribution.length >= 3) score += 25
    else if (workStats.roleDistribution.length >= 2) score += 20
    else score += 10
    
    if (works.length >= 10) score += 25
    else if (works.length >= 5) score += 20
    else if (works.length >= 3) score += 15
    
    return Math.min(score, 100)
  }

  const expertise = getExpertiseLevel()
  const quality = qualityScore()

  return (
    <div className="space-y-4 sm:space-y-6">
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
                <div className="text-3xl font-bold">{quality}</div>
                <div className="text-sm text-blue-100">品質スコア</div>
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
                  {articleContentRate >= 80 && (
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>高品質なコンテンツ制作（品質率{articleContentRate.toFixed(0)}%）</span>
                    </li>
                  )}
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
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 活動分析 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <span>📊</span>
            <span>活動分析</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className={`grid gap-4 sm:gap-6 ${hasInputs ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* コンテンツ品質分析 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">記事コンテンツ品質</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm text-gray-600">本文付き記事率</span>
                    <span className="text-xs sm:text-sm font-medium">{articleContentRate.toFixed(1)}%</span>
                  </div>
                  <SimpleProgress value={articleContentRate} />
                </div>
                {articleWorks.length > 0 && (
                  <div className="text-xs text-gray-500">
                    記事作品 {articleWorks.length}件中 {articlesWithContent}件が本文あり
                  </div>
                )}
                {articleWorks.length === 0 && (
                  <div className="text-xs text-gray-500">
                    記事作品がまだありません
                  </div>
                )}
              </div>
            </div>

            {/* インプット評価分析 - インプットがある場合のみ表示 */}
            {hasInputs && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">インプット評価習慣</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm text-gray-600">評価済みインプット率</span>
                      <span className="text-xs sm:text-sm font-medium">{ratedInputsRate.toFixed(1)}%</span>
                    </div>
                    <SimpleProgress value={ratedInputsRate} />
                  </div>
                  <div className="text-xs text-gray-500">
                    インプット {inputs.length}件中 {inputsWithRating.length}件を評価済み
                  </div>
                </div>
              </div>
            )}
          </div>

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
    </div>
  )
} 