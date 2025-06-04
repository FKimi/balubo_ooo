'use client'

import Link from 'next/link'
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
  const workStats = {
    totalWorks: works.length,
    roles: works.reduce((acc, work) => {
      if (work.roles && Array.isArray(work.roles)) {
        work.roles.forEach((role: string) => {
          acc[role] = (acc[role] || 0) + 1
        })
      } else if (work.roles) {
        acc[work.roles] = (acc[work.roles] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>),
    recentActivity: works
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(work => ({
        title: work.title,
        date: new Date(work.created_at).toLocaleDateString('ja-JP')
      }))
  }

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
    }, {} as Record<string, number>)
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
            {/* スキル一覧 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">🛠️ スキル・専門分野</h3>
                </div>

                {skills && skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">⚡</div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">スキル情報なし</h4>
                    <p className="text-gray-500">まだスキルが登録されていません</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* キャリア履歴 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">💼 キャリア履歴</h3>
                </div>

                {career && career.length > 0 ? (
                  <div className="space-y-4">
                    {career.map((careerItem, index) => (
                      <div key={careerItem.id || index} className="border border-gray-200 rounded-lg p-4">
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
                      </div>
                    </div>

                    {/* 役割分布 */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">役割分布</h4>
                      <div className="space-y-3">
                        {Object.entries(workStats.roles).map(([role, count]) => (
                          <div key={role} className="flex items-center justify-between">
                            <span className="text-gray-600">{role}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-indigo-600 h-2 rounded-full" 
                                  style={{ width: `${(count / workStats.totalWorks) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📁</div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">まだ作品がありません</h4>
                    <p className="text-gray-500">作品が登録されると統計情報が表示されます</p>
                  </div>
                )}
              </CardContent>
            </Card>
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
                        <img 
                          src={work.banner_image_url} 
                          alt={work.title}
                          className="w-full h-full object-cover"
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
                        <span className="text-lg font-bold text-blue-600">{count}件</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* インプット一覧 */}
            {inputs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputs.map((input) => (
                  <Card key={input.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* サムネイル */}
                        <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                          {input.cover_image_url ? (
                            <img 
                              src={input.cover_image_url} 
                              alt={input.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">
                              {input.type === '書籍' ? '📚' : 
                               input.type === '映画' ? '🎬' : 
                               input.type === 'アニメ' ? '📺' : 
                               input.type === 'ゲーム' ? '🎮' : '📖'}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">{input.title}</h3>
                              {input.author_creator && (
                                <p className="text-sm text-gray-600 mt-1">{input.author_creator}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {input.favorite && (
                                <span className="text-red-500">❤️</span>
                              )}
                              {input.rating && input.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-500">⭐</span>
                                  <span className="text-sm font-medium text-gray-700">{input.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* タグとジャンル */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {input.type}
                            </Badge>
                            {input.genres && (
                              <Badge variant="outline" className="text-xs">
                                {Array.isArray(input.genres) ? input.genres.join(', ') : input.genres}
                              </Badge>
                            )}
                          </div>

                          {input.notes && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{input.notes}</p>
                          )}

                          <div className="text-xs text-gray-500">
                            {new Date(input.created_at).toLocaleDateString('ja-JP')}
                          </div>

                          {input.external_url && (
                            <div className="mt-3">
                              <a 
                                href={input.external_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm underline"
                              >
                                詳細を見る →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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