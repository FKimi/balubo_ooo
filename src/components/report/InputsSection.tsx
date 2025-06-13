import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleProgress } from './SimpleProgress'
import type { InputData } from '@/types/input'

interface InputsSectionProps {
  inputs: InputData[]
}

export function InputsSection({ inputs }: InputsSectionProps) {
  // インプットデータがない場合の表示
  if (inputs.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-4">📚</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                インプットデータがありません
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto">
                書籍、映画、記事などのインプットを記録すると、詳細な分析レポートが作成されます。
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
                <h4 className="font-medium text-blue-900 mb-2">インプット機能でできること：</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 好きなジャンルの分析</li>
                  <li>• メディアタイプの分布</li>
                  <li>• 評価履歴の可視化</li>
                  <li>• 読書・視聴習慣の把握</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ジャンル分析
  const genreAnalysis = () => {
    const genreCount: { [key: string]: number } = {}
    inputs.forEach(input => {
      if (input.genres && Array.isArray(input.genres)) {
        input.genres.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1
        })
      }
    })
    return Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
  }

  // タイプ分析
  const typeAnalysis = () => {
    const typeCount: { [key: string]: number } = {}
    inputs.forEach(input => {
      typeCount[input.type] = (typeCount[input.type] || 0) + 1
    })
    return Object.entries(typeCount).sort(([, a], [, b]) => b - a)
  }

  // 評価分析
  const ratingAnalysis = () => {
    const ratedInputs = inputs.filter(input => input.rating && input.rating > 0)
    const averageRating = ratedInputs.length > 0 
      ? ratedInputs.reduce((sum, input) => sum + (input.rating || 0), 0) / ratedInputs.length 
      : 0
    
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: ratedInputs.filter(input => input.rating === rating).length
    }))

    return { averageRating, ratingDistribution, totalRated: ratedInputs.length }
  }

  const topGenres = genreAnalysis()
  const typeDistribution = typeAnalysis()
  const ratingData = ratingAnalysis()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 基本統計 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{inputs.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">総インプット数</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">
                {ratingData.averageRating > 0 ? ratingData.averageRating.toFixed(1) : '-'}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">平均評価</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{ratingData.totalRated}</div>
              <div className="text-xs sm:text-sm text-gray-600">評価済み</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ジャンルとメディアタイプを2カラムに */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* ジャンル分析 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span>🎭</span>
              <span>好きなジャンル</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {topGenres.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {topGenres.map(([genre, count], index) => (
                  <div key={genre} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700 truncate">{genre}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <SimpleProgress 
                        value={(count / Math.max(...topGenres.map(([, c]) => c))) * 100} 
                        className="w-12 sm:w-20 h-2" 
                      />
                      <span className="text-xs sm:text-sm font-medium text-gray-600 w-6 sm:w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">ジャンルデータがありません</p>
            )}
          </CardContent>
        </Card>

        {/* メディアタイプ分析 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span>📱</span>
              <span>メディアタイプ分布</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {typeDistribution.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {typeDistribution.map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-700 capitalize truncate flex-1 mr-2">{type}</span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <SimpleProgress 
                        value={(count / Math.max(...typeDistribution.map(([, c]) => c))) * 100} 
                        className="w-16 sm:w-24 h-2" 
                      />
                      <span className="text-xs sm:text-sm font-medium text-gray-600 w-20 sm:w-24 text-right">
                        {count}件 ({Math.round((count / inputs.length) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">メディアタイプデータがありません</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 評価分布 */}
      {ratingData.totalRated > 0 && (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span>⭐</span>
              <span>評価分布</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 sm:space-y-3">
              {ratingData.ratingDistribution.reverse().map(({ rating, count }) => (
                <div key={rating} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">★{rating}</span>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <SimpleProgress 
                      value={ratingData.totalRated > 0 ? (count / ratingData.totalRated) * 100 : 0} 
                      className="w-16 sm:w-24 h-2" 
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-600 w-20 sm:w-24 text-right">
                      {count}件 ({ratingData.totalRated > 0 ? Math.round((count / ratingData.totalRated) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 