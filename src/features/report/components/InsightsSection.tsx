import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WorkData } from '@/types/work'
import type { InputData } from '@/types/input'

interface InsightsSectionProps {
  works: WorkData[]
  inputs: InputData[]
  workStats: any
}

export function InsightsSection({ works, inputs, workStats }: InsightsSectionProps) {
  const hasInputs = inputs.length > 0
  
  // 興味・関心分析
  const getInterestAnalysis = () => {
    const interests: string[] = []
    
    works.forEach(work => {
      if (work.ai_analysis_result) {
        try {
          const analysis = typeof work.ai_analysis_result === 'string' 
            ? JSON.parse(work.ai_analysis_result) 
            : work.ai_analysis_result
          
          if (analysis.tagClassification?.interest) {
            interests.push(...analysis.tagClassification.interest)
          }
        } catch (error) {
          console.warn('AI分析結果のパースに失敗:', error)
        }
      }
    })
    
    const interestCount: { [key: string]: number } = {}
    interests.forEach(interest => {
      interestCount[interest] = (interestCount[interest] || 0) + 1
    })
    
    return Object.entries(interestCount)
      .map(([interest, count]) => ({ interest, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // 月別活動データ（シンプル化）
  const getMonthlyActivity = () => {
    const now = new Date()
    const monthsData = Array.from({ length: 6 }, (_, i) => {
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

      return { 
        month: monthStart, 
        works: monthWorks, 
        inputs: monthInputs, 
        total: monthWorks + monthInputs 
      }
    })

    return monthsData.reverse()
  }

  // 最近の活動傾向
  const getRecentTrend = () => {
    const recentMonth = new Date()
    recentMonth.setMonth(recentMonth.getMonth() - 1)
    
    const recentWorks = works.filter(work => 
      work.created_at && new Date(work.created_at) >= recentMonth
    ).length

    const recentInputs = inputs.filter(input => 
      input.createdAt && new Date(input.createdAt) >= recentMonth
    ).length

    return { recentWorks, recentInputs }
  }

  // 実用的な改善提案
  const generatePracticalSuggestions = () => {
    const suggestions = []
    const { recentWorks, recentInputs } = getRecentTrend()
    
    // 作品制作に関する提案
    if (recentWorks === 0) {
      suggestions.push({
        title: "作品制作を再開しましょう",
        description: "最近1ヶ月間作品がありません。小さなプロジェクトから始めて制作リズムを取り戻しましょう。",
        icon: "🎨",
        priority: "high"
      })
    } else if (recentWorks < 2) {
      suggestions.push({
        title: "制作ペースを上げてみましょう",
        description: "月2-3件の作品制作を目標にすることで、スキル向上と実績蓄積が期待できます。",
        icon: "⚡",
        priority: "medium"
      })
    }

    // インプットに関する提案
    if (!hasInputs) {
      suggestions.push({
        title: "インプット記録を始めましょう",
        description: "書籍、映画、記事などのインプットを記録することで、創作活動に新たなアイデアをもたらします。",
        icon: "📚",
        priority: "medium"
      })
    } else if (recentInputs < 2) {
      suggestions.push({
        title: "学習機会を増やしましょう",
        description: "月2-3件のインプットを目標にすることで、創作の幅が広がります。",
        icon: "📖",
        priority: "medium"
      })
    }

    // 役割の多様化に関する提案
    if (workStats.roleDistribution.length < 3) {
      suggestions.push({
        title: "新しい役割にチャレンジしましょう",
        description: "異なる役割での作品制作により、スキルの幅を広げることができます。",
        icon: "🌟",
        priority: "low"
      })
    }

    return suggestions.slice(0, 3) // 最大3つまで
  }

  const monthlyData = getMonthlyActivity()
  const suggestions = generatePracticalSuggestions()
  const maxActivity = Math.max(...monthlyData.map(m => m.total), 1)
  const interestAnalysis = getInterestAnalysis()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 活動サマリー */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">最近30日の作品</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                {getRecentTrend().recentWorks}
              </div>
              <div className="text-xs text-gray-500">件</div>
            </div>
          </CardContent>
        </Card>

        {hasInputs && (
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-600 mb-2">最近30日のインプット</div>
                <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">
                  {getRecentTrend().recentInputs}
                </div>
                <div className="text-xs text-gray-500">件</div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">活動継続月数</div>
              <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                {monthlyData.filter(m => m.total > 0).length}
              </div>
              <div className="text-xs text-gray-500">/ 6ヶ月</div>
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
          <div className="space-y-4">
            {monthlyData.map(({ month, works: monthWorks, inputs: monthInputs, total }, index) => (
              <div key={month.getTime()} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    {month.toLocaleDateString('ja-JP', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>作品: {monthWorks}</span>
                    </span>
                    {hasInputs && (
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>インプット: {monthInputs}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" 
                    style={{ width: `${(total / maxActivity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 実用的な改善提案 */}
      {suggestions.length > 0 && (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span>💡</span>
              <span>次のステップ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg p-4 border-l-4 ${
                    suggestion.priority === 'high' 
                      ? 'bg-red-50 border-red-400' 
                      : suggestion.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-blue-50 border-blue-400'
                  }`}
                >
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

      {/* 興味・関心分析セクション */}
      {interestAnalysis.length > 0 && (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span>🧠</span>
              <span>興味・関心分析</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                AI分析による作品から読み取れる興味・関心領域の傾向
              </p>
              <div className="flex flex-wrap gap-2">
                {interestAnalysis.map((item, index) => (
                  <span
                    key={item.interest}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      index < 3 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.interest}
                    <span className={`ml-2 text-xs ${index < 3 ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* データ連携状況 */}
      <Card className="hover:shadow-md transition-shadow duration-200 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              📊 データ連携状況
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-lg font-bold text-blue-600 mb-1">{works.length}</div>
                <div className="text-xs text-gray-600">作品データ</div>
                <div className="text-xs text-green-600 mt-1">✓ 連携済み</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-lg font-bold text-purple-600 mb-1">{inputs.length}</div>
                <div className="text-xs text-gray-600">インプットデータ</div>
                <div className={`text-xs mt-1 ${hasInputs ? 'text-green-600' : 'text-gray-400'}`}>
                  {hasInputs ? '✓ 連携済み' : '未連携'}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                {hasInputs 
                  ? 'すべてのデータが連携されています。継続的な記録でより詳細な分析が可能になります。'
                  : 'インプットデータを追加することで、より包括的な分析レポートを作成できます。'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 