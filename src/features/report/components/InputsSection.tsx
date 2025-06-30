import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
              <div className="text-4xl sm:text-6xl mb-4">
                <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
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

  // ジャンル分析（トップ3のみ）
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
      .slice(0, 3)
  }

  // タイプ分析（トップ3のみ）
  const typeAnalysis = () => {
    const typeCount: { [key: string]: number } = {}
    inputs.forEach(input => {
      typeCount[input.type] = (typeCount[input.type] || 0) + 1
    })
    return Object.entries(typeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
  }

  // お気に入り分析
  const favoriteAnalysis = () => {
    const favoriteCount = inputs.filter(input => input.favorite).length
    const favoriteRate = inputs.length > 0 ? Math.round((favoriteCount / inputs.length) * 100) : 0
    return { favoriteCount, favoriteRate }
  }

  const topGenres = genreAnalysis()
  const typeDistribution = typeAnalysis()
  const favoriteData = favoriteAnalysis()

  return (
    <div className="space-y-6">
      {/* 基本統計（3つの箇条書きに統一） */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>{inputs.length}件</strong>のインプットを記録済み
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>{favoriteData.favoriteCount}件</strong>をお気に入り登録（{favoriteData.favoriteRate}%）
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>{typeDistribution.length}種類</strong>のメディアタイプを活用
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* シンプルな分析（2カラムレイアウト） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 好きなジャンル */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">好きなジャンル</CardTitle>
          </CardHeader>
          <CardContent>
            {topGenres.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topGenres.map(([genre, count]) => (
                  <span
                    key={genre}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {genre} ({count}件)
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">ジャンルデータがありません</div>
            )}
          </CardContent>
        </Card>

        {/* メディアタイプ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">メディアタイプ</CardTitle>
          </CardHeader>
          <CardContent>
            {typeDistribution.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {typeDistribution.map(([type, count]) => (
                  <span
                    key={type}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {type} ({count}件)
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">メディアタイプデータがありません</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 