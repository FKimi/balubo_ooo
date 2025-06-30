import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WorkData } from '@/types/work'

interface AIFieldSummary {
  averageScore: number
  scoreLevel: {
    level: string
    color: string
    bgColor: string
    description: string
  }
  topWorks: Array<{ title: string; score: number; reason?: string }>
}

interface ComprehensiveAnalysis {
  technology: AIFieldSummary
  creativity: AIFieldSummary
  expertise: AIFieldSummary
  impact: AIFieldSummary
}

interface WorksSectionProps {
  works: WorkData[]
  workStats: any
  analysis?: ComprehensiveAnalysis
}

export function WorksSection({ works, workStats, analysis }: WorksSectionProps) {
  // タグ分析（トップ3のみ）
  const tagAnalysis = () => {
    const tagCount: { [key: string]: number } = {}
    works.forEach(work => {
      if (work.tags && Array.isArray(work.tags)) {
        work.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })
    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
  }

  // カテゴリ分析（トップ3のみ）
  const categoryAnalysis = () => {
    const categoryCount: { [key: string]: number } = {}
    works.forEach(work => {
      if (work.categories && Array.isArray(work.categories)) {
        work.categories.forEach(category => {
          categoryCount[category] = (categoryCount[category] || 0) + 1
        })
      }
    })
    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
  }

  // コンテンツタイプ分析（トップ3のみ）
  const contentTypeAnalysis = () => {
    const typeCount: { [key: string]: number } = {}
    works.forEach(work => {
      const type = work.content_type || 'その他'
      typeCount[type] = (typeCount[type] || 0) + 1
    })
    return Object.entries(typeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
  }

  const categories = categoryAnalysis()
  const tags = tagAnalysis()
  const contentTypes = contentTypeAnalysis()

  // 記事作品の統計
  const articleWorks = works.filter(work => work.content_type === 'article')
  const totalWordCount = articleWorks.reduce((sum, work) => sum + (work.article_word_count || 0), 0)

  // 役割分布（トップ3のみ）
  const topRoles = workStats.roleDistribution.slice(0, 3)

  const renderScoreScale = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8">
      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        AI評価スコア基準
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-800">
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="font-bold text-purple-700">90-100点</div>
          <div className="text-purple-600">エキスパート</div>
          <div className="text-xs text-purple-500 mt-1">プロフェッショナルレベル</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="font-bold text-blue-700">80-89点</div>
          <div className="text-blue-600">上級者</div>
          <div className="text-xs text-blue-500 mt-1">高い品質</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="font-bold text-green-700">70-79点</div>
          <div className="text-green-600">中級者</div>
          <div className="text-xs text-green-500 mt-1">標準的な品質</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <div className="font-bold text-yellow-700">60-69点</div>
          <div className="text-yellow-600">初級者</div>
          <div className="text-xs text-yellow-500 mt-1">基本的な品質</div>
        </div>
      </div>
    </div>
  )

  const renderFieldCard = (title: string, gradient: string, field: AIFieldSummary, colorPrefix: string) => {
    const scoreColorMap: Record<string, string> = {
      gray: 'text-gray-700',
      purple: 'text-purple-700',
      blue: 'text-blue-700',
      orange: 'text-orange-700'
    }
    const scoreColor = scoreColorMap[colorPrefix] || 'text-gray-700'
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className={`px-6 py-4 ${gradient}`}>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`text-4xl font-bold ${scoreColor}`}>{field.averageScore}</div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${field.scoreLevel.bgColor} ${field.scoreLevel.color}`}>
              {field.scoreLevel.level}
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-4">{field.scoreLevel.description}</div>
        </div>
      </div>
    )
  }

  const renderEvaluationGrid = () => {
    if (!analysis) return null
    return (
      <div className="grid gap-6 md:grid-cols-4 mb-10">
        {analysis.technology.averageScore > 0 && renderFieldCard('技術力', 'bg-gradient-to-r from-gray-500 to-gray-600', analysis.technology, 'gray')}
        {analysis.creativity.averageScore > 0 && renderFieldCard('創造性', 'bg-gradient-to-r from-purple-500 to-purple-600', analysis.creativity, 'purple')}
        {analysis.expertise.averageScore > 0 && renderFieldCard('専門性', 'bg-gradient-to-r from-blue-500 to-blue-600', analysis.expertise, 'blue')}
        {analysis.impact.averageScore > 0 && renderFieldCard('影響力', 'bg-gradient-to-r from-orange-500 to-orange-600', analysis.impact, 'orange')}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI評価サマリー */}
      {analysis && renderScoreScale()}
      {analysis && renderEvaluationGrid()}

      {/* 基本統計（3つの箇条書きに統一） */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>{works.length}件</strong>の作品を制作済み
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                総文字数<strong>{totalWordCount.toLocaleString()}文字</strong>を執筆
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>{workStats.roleDistribution.length}種類</strong>の役割を担当
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* シンプルな分析（2カラムレイアウト） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 主要役割 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">主要役割</CardTitle>
          </CardHeader>
          <CardContent>
            {topRoles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topRoles.map((role: any) => (
                  <span
                    key={role.role}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {role.role} ({role.count}件)
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">役割が設定された作品がありません</div>
            )}
          </CardContent>
        </Card>

        {/* コンテンツタイプ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">コンテンツタイプ</CardTitle>
          </CardHeader>
          <CardContent>
            {contentTypes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {contentTypes.map(([type, count]) => (
                  <span
                    key={type}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {type} ({count}件)
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">コンテンツタイプが設定されていません</div>
            )}
          </CardContent>
        </Card>

        {/* 主要カテゴリ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">主要カテゴリ</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map(([category, count]) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {category} ({count}件)
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">カテゴリが設定された作品がありません</div>
            )}
          </CardContent>
        </Card>

        {/* よく使用するタグ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">よく使用するタグ</CardTitle>
          </CardHeader>
          <CardContent>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map(([tag, count]) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                  >
                    {tag} ({count}回)
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">タグが設定された作品がありません</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 