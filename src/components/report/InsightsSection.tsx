import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleProgress } from './SimpleProgress'
import type { WorkData } from '@/types/work'
import type { InputData } from '@/types/input'

interface InsightsSectionProps {
  works: WorkData[]
  inputs: InputData[]
  workStats: any
}

export function InsightsSection({ works, inputs, workStats }: InsightsSectionProps) {
  const hasInputs = inputs.length > 0
  
  // 成長率計算
  const calculateGrowthMetrics = () => {
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1)

    const recentWorks = works.filter(work => 
      work.created_at && new Date(work.created_at) >= sixMonthsAgo
    ).length

    const previousWorks = works.filter(work => 
      work.created_at && 
      new Date(work.created_at) >= twelveMonthsAgo && 
      new Date(work.created_at) < sixMonthsAgo
    ).length

    const recentInputs = inputs.filter(input => 
      input.createdAt && new Date(input.createdAt) >= sixMonthsAgo
    ).length

    const previousInputs = inputs.filter(input => 
      input.createdAt && 
      new Date(input.createdAt) >= twelveMonthsAgo && 
      new Date(input.createdAt) < sixMonthsAgo
    ).length

    const worksGrowth = previousWorks > 0 ? ((recentWorks - previousWorks) / previousWorks) * 100 : 0
    const inputsGrowth = previousInputs > 0 ? ((recentInputs - previousInputs) / previousInputs) * 100 : 0

    return { worksGrowth, inputsGrowth, recentWorks, recentInputs }
  }

  // 継続性計算
  const calculateConsistency = () => {
    const now = new Date()
    const monthsData = Array.from({ length: 12 }, (_, i) => {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthWorks = works.filter(work => 
        work.created_at && 
        new Date(work.created_at) >= monthStart && 
        new Date(work.created_at) <= monthEnd
      ).length

      const monthInputs = inputs.filter(input => 
        input.createdAt && 
        new Date(input.createdAt) >= monthStart && 
        new Date(input.createdAt) <= monthEnd
      ).length

      return { month: monthStart, works: monthWorks, inputs: monthInputs, hasActivity: monthWorks + monthInputs > 0 }
    })

    const activeMonths = monthsData.filter(m => m.hasActivity).length
    const consistency = (activeMonths / 12) * 100

    return { consistency, monthsData: monthsData.reverse().slice(-6) }
  }

  // 改善提案
  const generateSuggestions = () => {
    const suggestions = []
    const recentMonth = new Date()
    recentMonth.setMonth(recentMonth.getMonth() - 1)
    
    const recentWorks = works.filter(work => 
      work.created_at && new Date(work.created_at) >= recentMonth
    ).length

    const recentInputs = inputs.filter(input => 
      input.createdAt && new Date(input.createdAt) >= recentMonth
    ).length

    const ratedInputs = inputs.filter(input => input.rating && input.rating > 0).length
    const articlesWithContent = works.filter(work => 
      work.content_type === 'article' && work.article_has_content
    ).length

    if (recentWorks === 0) {
      suggestions.push({
        title: "作品制作を始めましょう",
        description: "最近1ヶ月間作品がありません。小さな作品でも継続的に制作することが成長に繋がります。",
        icon: "🎨"
      })
    }

    if (!hasInputs) {
      suggestions.push({
        title: "インプット記録を始めましょう",
        description: "書籍、映画、記事などのインプットを記録することで、創作活動に新たなアイデアをもたらします。",
        icon: "📚"
      })
    } else if (recentInputs < 3) {
      suggestions.push({
        title: "インプット機会を増やしましょう",
        description: "多様なインプットが創作活動に新たなアイデアをもたらします。月3件以上を目標にしてみてください。",
        icon: "📚"
      })
    }

    const articleWorks = works.filter(w => w.content_type === 'article')
    if (articleWorks.length > 0 && articlesWithContent / articleWorks.length < 0.5) {
      suggestions.push({
        title: "記事の内容を充実させましょう",
        description: "記事タイプの作品に本文を追加することで、より詳細なポートフォリオになります。",
        icon: "✍️"
      })
    }

    if (hasInputs && inputs.length > 0 && ratedInputs / inputs.length < 0.7) {
      suggestions.push({
        title: "インプットの評価を習慣にしましょう",
        description: "インプットに評価をつけることで、自分の好みや成長パターンを把握できます。",
        icon: "⭐"
      })
    }

    const { consistency } = calculateConsistency()
    if (consistency < 50) {
      suggestions.push({
        title: "継続的な活動を心がけましょう",
        description: "月1回でも活動することで、長期的な成長につながります。習慣化を目指してみてください。",
        icon: "📈"
      })
    }

    return suggestions.slice(0, 4) // 最大4つまで
  }

  // 総合評価計算
  const calculateOverallScore = () => {
    const { consistency } = calculateConsistency()
    const hasWorks = works.length > 0 ? 25 : 0
    const hasInputsScore = hasInputs ? 25 : 0
    const consistencyScore = consistency * 0.5 // 50%が満点

    return Math.min(100, Math.round(hasWorks + hasInputsScore + consistencyScore))
  }

  const growthMetrics = calculateGrowthMetrics()
  const consistencyData = calculateConsistency()
  const suggestions = generateSuggestions()
  const overallScore = calculateOverallScore()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 成長指標 */}
      <div className={`grid gap-4 sm:gap-6 ${hasInputs ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">作品成長率</div>
              <div className={`text-xl sm:text-2xl font-bold mb-1 ${
                growthMetrics.worksGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {growthMetrics.worksGrowth >= 0 ? '+' : ''}{growthMetrics.worksGrowth.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">vs 前6ヶ月</div>
            </div>
          </CardContent>
        </Card>

        {hasInputs && (
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-600 mb-2">インプット成長率</div>
                <div className={`text-xl sm:text-2xl font-bold mb-1 ${
                  growthMetrics.inputsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {growthMetrics.inputsGrowth >= 0 ? '+' : ''}{growthMetrics.inputsGrowth.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">vs 前6ヶ月</div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">活動継続性</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                {consistencyData.consistency.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">過去12ヶ月</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">総合スコア</div>
              <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={overallScore >= 70 ? "#10b981" : overallScore >= 40 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - overallScore / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm sm:text-base font-bold text-gray-700">{overallScore}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 月別活動推移 */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <span>📈</span>
            <span>月別活動推移（最近6ヶ月）</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {consistencyData.monthsData.map(({ month, works: monthWorks, inputs: monthInputs }, index) => {
              const total = monthWorks + monthInputs
              const maxActivity = Math.max(...consistencyData.monthsData.map(m => m.works + m.inputs), 1)
              
              return (
                <div key={month.getTime()} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-xs sm:text-sm text-gray-600 w-16 sm:w-20">
                      {month.toLocaleDateString('ja-JP', { month: 'short', year: '2-digit' })}
                    </span>
                    <div className="flex-1">
                      <SimpleProgress 
                        value={(total / maxActivity) * 100} 
                        className="h-3"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 ml-3">
                    <span>作品: {monthWorks}</span>
                    {hasInputs && <span>インプット: {monthInputs}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 改善提案 */}
      {suggestions.length > 0 && (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span>💡</span>
              <span>改善提案</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="text-xl flex-shrink-0">{suggestion.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{suggestion.title}</h4>
                      <p className="text-xs text-gray-600">{suggestion.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 総合評価とメッセージ */}
      <Card className="hover:shadow-md transition-shadow duration-200 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              あなたの創作活動レポート
            </h3>
            <div className="space-y-2">
              {overallScore >= 70 && (
                <p className="text-sm sm:text-base text-gray-700">
                  素晴らしい活動を続けています！この調子で創作活動を継続していきましょう。
                </p>
              )}
              {overallScore >= 40 && overallScore < 70 && (
                <p className="text-sm sm:text-base text-gray-700">
                  良いペースで活動されています。{!hasInputs ? 'インプット機能も活用して' : ''}さらなる成長を目指しましょう。
                </p>
              )}
              {overallScore < 40 && (
                <p className="text-sm sm:text-base text-gray-700">
                  創作活動を始める第一歩を踏み出しています。{!hasInputs ? 'インプット記録も始めて' : ''}継続的な活動で成長していきましょう。
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 