'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WorkData } from '@/features/work/types'
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
  const favoriteInputs = inputs.filter(input => input.favorite)
  const favoriteRate = inputs.length > 0 
    ? (favoriteInputs.length / inputs.length) * 100
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
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
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
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
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
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0H6a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h8a2 2 0 002-2v-6a2 2 0 00-2-2h-2m0 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v0" />
              </svg>
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
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  {expertise}
                </h3>
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
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
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
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
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
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                    {inputs.length > 0 ? favoriteRate.toFixed(1) + '%' : '-'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">お気に入り率</div>
                  <div className="text-xs text-gray-500 mt-1">お気に入り: {favoriteInputs.length}件</div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* クライアント推薦ポイント */}
      {works.length >= 3 && (
        <Card className="border-blue-600 border-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-blue-600">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>クリエイターまとめ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                まとめ
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{works.length}件の実績と{totalArticleWordCount.toLocaleString()}文字の執筆経験</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{workStats.roleDistribution.length}つの専門役割による多角的な制作力</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{hasInputs ? '継続的な学習と' : ''}安定した品質でのコンテンツ制作</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 実績サマリー */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>実績サマリー</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* 役割分布 */}
          {workStats.roleDistribution.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">主な役割（トップ3）</h4>
              <div className="flex flex-wrap gap-2">
                {workStats.roleDistribution.slice(0, 3).map((role: any, _index: number) => (
                  <span 
                    key={role.role}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                  >
                    {role.role} ({role.count}件)
                  </span>
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
                  <div className="text-blue-500 text-xl">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
                    </svg>
                  </div>
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
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-500 text-xl">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">学習活動</div>
                      <div className="text-sm text-blue-700">
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
                <div className="text-blue-500 text-xl">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
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
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>クリエイター分析</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 創造性・専門性・影響力の分析を統合した実用的な表示 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 強み・特徴 */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-blue-600 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  強み・特徴
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
                <h4 className="font-bold text-lg text-blue-600 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  発注者へのアピール
                </h4>
                <div className="space-y-2">
                  {works.length >= 3 && (
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                      <p className="text-sm font-medium text-blue-800">豊富な実績</p>
                      <p className="text-xs text-blue-600">{works.length}件の作品制作経験</p>
                    </div>
                  )}
                  
                  {workStats.totalWordCount > 10000 && (
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                      <p className="text-sm font-medium text-blue-800">高い文章力</p>
                      <p className="text-xs text-blue-600">総{workStats.totalWordCount.toLocaleString()}文字の執筆実績</p>
                    </div>
                  )}
                  
                  {workStats.roleDistribution.length >= 2 && (
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                      <p className="text-sm font-medium text-blue-800">多角的対応力</p>
                      <p className="text-xs text-blue-600">{workStats.roleDistribution.length}つの役割を経験</p>
                    </div>
                  )}
                  
                  {hasInputs && (
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                      <p className="text-sm font-medium text-blue-800">継続的学習姿勢</p>
                      <p className="text-xs text-blue-600">{inputs.length}件のインプット活動</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 今後の成長の方向性 */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-blue-600 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  成長の方向性
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
                      <div key={i} className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                        <p className="text-sm font-medium text-blue-800">{suggestion.title}</p>
                        <p className="text-xs text-blue-600">{suggestion.description}</p>
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
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  注目作品
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
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <h4 className="font-bold text-lg text-blue-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                発注者の方へ
              </h4>
              <p className="text-sm text-blue-700 leading-relaxed">
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