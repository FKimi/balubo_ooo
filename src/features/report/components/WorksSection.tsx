import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleProgress } from './SimpleProgress'
import type { WorkData } from '@/types/work'

interface WorksSectionProps {
  works: WorkData[]
  workStats: any
}

export function WorksSection({ works, workStats }: WorksSectionProps) {
  // タグ分析
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
      .slice(0, 10)
  }

  // カテゴリ分析（データベースのcategoriesフィールドを使用）
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
      .slice(0, 8)
  }

  // 月別作品数（production_dateベース）
  const monthlyData = () => {
    const monthCount: { [key: string]: number } = {}
    works.forEach(work => {
      if (work.production_date) {
        const date = new Date(work.production_date)
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        monthCount[monthKey] = (monthCount[monthKey] || 0) + 1
      }
    })
    return Object.entries(monthCount)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6)
  }

  // コンテンツタイプ分析
  const contentTypeAnalysis = () => {
    const typeCount: { [key: string]: number } = {}
    works.forEach(work => {
      const type = work.content_type || 'その他'
      typeCount[type] = (typeCount[type] || 0) + 1
    })
    return Object.entries(typeCount)
      .sort(([, a], [, b]) => b - a)
  }

  const categories = categoryAnalysis()
  const tags = tagAnalysis()
  const monthlyActivity = monthlyData()
  const contentTypes = contentTypeAnalysis()
  const maxTagCount = tags.length > 0 ? tags[0]?.[1] || 1 : 1
  const maxCategoryCount = categories.length > 0 ? categories[0]?.[1] || 1 : 1
  const maxMonthCount = monthlyActivity.length > 0 ? Math.max(...monthlyActivity.map(([, count]) => count)) : 1

  // 記事作品の統計
  const articleWorks = works.filter(work => work.content_type === 'article')
  const totalWordCount = articleWorks.reduce((sum, work) => sum + (work.article_word_count || 0), 0)
  const avgWordCount = articleWorks.length > 0 ? Math.round(totalWordCount / articleWorks.length) : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 基本統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{works.length}</div>
            <div className="text-sm text-gray-600">総作品数</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
              {totalWordCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">総文字数</div>
            <div className="text-xs text-gray-500 mt-1">平均: {avgWordCount.toLocaleString()}文字</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
              {workStats.roleDistribution.length}
            </div>
            <div className="text-sm text-gray-600">担当役割数</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* コンテンツタイプ分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>📄</span>
              <span>コンテンツタイプ分布</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentTypes.map(([type, count]) => (
                <div key={type}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">{type}</span>
                    <span className="text-sm font-medium">{count}件</span>
                  </div>
                  <SimpleProgress value={(count / works.length) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* カテゴリ分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>🏷️</span>
              <span>カテゴリ分析</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map(([category, count]) => (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700">{category}</span>
                      <span className="text-sm font-medium">{count}件</span>
                    </div>
                    <SimpleProgress value={(count / maxCategoryCount) * 100} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                カテゴリが設定された作品がありません
              </div>
            )}
          </CardContent>
        </Card>

        {/* タグ分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>🏷️</span>
              <span>人気タグ（トップ10）</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tags.length > 0 ? (
              <div className="space-y-3">
                {tags.map(([tag, count]) => (
                  <div key={tag}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700">{tag}</span>
                      <span className="text-sm font-medium">{count}件</span>
                    </div>
                    <SimpleProgress value={(count / maxTagCount) * 100} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                タグが設定された作品がありません
              </div>
            )}
          </CardContent>
        </Card>

        {/* 時系列分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>📈</span>
              <span>月別制作活動（最近6ヶ月）</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyActivity.length > 0 ? (
              <div className="space-y-3">
                {monthlyActivity.map(([month, count]) => {
                  const monthParts = month.split('-')
                  const year = monthParts[0] || ''
                  const monthNum = monthParts[1] || ''
                  const displayMonth = `${year}年${parseInt(monthNum) || 0}月`
                  return (
                    <div key={month}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-700">{displayMonth}</span>
                        <span className="text-sm font-medium">{count}件</span>
                      </div>
                      <SimpleProgress value={(count / maxMonthCount) * 100} />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                制作日が設定された作品がありません
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 役割分布 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>👨‍💼</span>
            <span>役割分布</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workStats.roleDistribution.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workStats.roleDistribution.map((role: any) => (
                <div key={role.role}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">{role.role}</span>
                    <span className="text-sm font-medium">{role.count}件 ({role.percentage.toFixed(1)}%)</span>
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
          ) : (
            <div className="text-center text-gray-500 py-4">
              役割が設定された作品がありません
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 