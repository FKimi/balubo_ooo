'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WorkBanner } from '@/components/WorkBanner'
import LikeButton from '@/features/work/components/LikeButton'
import CommentsSection from '@/features/work/components/CommentsSection'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface WorkData {
  id: string
  user_id: string
  title: string
  description: string
  externalUrl: string
  productionDate: string
  tags: string[]
  roles: string[]
  categories: string[]
  previewData?: any
  preview_data?: any
  banner_image_url?: string
  ai_analysis_result?: any
  production_notes?: string
  createdAt: string
  updatedAt: string
}

export default function WorkDetailPage() {
  const params = useParams()
  const workId = params.id as string
  const [work, setWork] = useState<WorkData | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWork = async () => {
      try {
        // 認証トークンを取得
        const { supabase } = await import('@/lib/supabase')
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        
        // 現在のユーザー情報を取得
        if (session?.user) {
          setCurrentUser(session.user)
        }

        const response = await fetch(`/api/works/${workId}`, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        })
        const data = await response.json()

        if (response.ok) {
          // データ構造を統一（APIから返されるデータをフロントエンド用に変換）
          const workData = {
            ...data.work,
            // external_url -> externalUrl への変換
            externalUrl: data.work.external_url || data.work.externalUrl,
            // preview_data -> previewData への変換（既存のpreviewDataがない場合）
            previewData: data.work.previewData || data.work.preview_data,
            // production_date -> productionDate への変換
            productionDate: data.work.production_date || data.work.productionDate,
          }
          
          console.log('Work detail data received:', {
            id: workData.id,
            title: workData.title,
            user_id: workData.user_id,
            externalUrl: workData.externalUrl,
            banner_image_url: workData.banner_image_url,
            hasPreviewData: !!workData.previewData,
            hasPreview_data: !!workData.preview_data,
            previewDataImage: workData.previewData?.image,
            preview_dataImage: workData.preview_data?.image,
            hasAiAnalysis: !!workData.ai_analysis_result,
            hasProductionNotes: !!workData.production_notes
          })
          setWork(workData)
        } else {
          console.error('API Error:', data.error)
          setError(data.error || '作品データの取得に失敗しました')
        }
      } catch (error) {
        console.error('作品取得エラー:', error)
        setError('作品データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    if (workId) {
      console.log('Fetching work with ID:', workId)
      fetchWork()
    }
  }, [workId])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 animate-spin text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-gray-600">作品を読み込み中...</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !work) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">作品が見つかりません</h3>
                <p className="text-gray-600 mb-2">{error}</p>
                <p className="text-gray-500 text-sm mb-6">作品ID: {workId}</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/profile">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                      ポートフォリオに戻る
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    再読み込み
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  // AI分析データの取得（previewDataまたはpreview_dataまたはai_analysis_resultから）
  const aiAnalysis = work.ai_analysis_result || work.previewData?.analysis || work.preview_data?.analysis

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/profile">
                <Button variant="outline" className="flex items-center gap-2 hover:bg-white/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  ポートフォリオに戻る
                </Button>
              </Link>
              
              {/* 編集ボタンは作品の所有者のみに表示 */}
              {currentUser && work.user_id === currentUser.id && (
                <div className="flex gap-3">
                  <Link href={`/works/${work.id}/edit`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      編集
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* 作品詳細 */}
            <Card className="overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              {/* バナー画像 - 修正版 */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {work.externalUrl || work.banner_image_url || work.previewData?.image || work.preview_data?.image ? (
                  <WorkBanner 
                    url={work.externalUrl || ''} 
                    title={work.title}
                    previewData={work.previewData || work.preview_data}
                    bannerImageUrl={work.banner_image_url || ''}
                    useProxy={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-white rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-gray-600 text-lg font-medium">作品</div>
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-8">
                {/* タイトルと基本情報 */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                      {work.title}
                    </h1>
                    {work.productionDate && (
                      <span className="text-gray-500 text-sm font-medium bg-gray-100 px-4 py-2 rounded-full whitespace-nowrap ml-4">
                        {new Date(work.productionDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
                      </span>
                    )}
                  </div>

                  {/* 役割 */}
                  {work.roles && work.roles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {work.roles.map((role, index) => (
                        <span key={index} className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm rounded-full font-medium shadow-sm">
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 説明文 */}
                {work.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="text-3xl">💬</span>
                      作品について
                    </h2>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                        {work.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* 制作メモ */}
                {work.production_notes && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="text-3xl">📝</span>
                      制作メモ
                    </h2>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                      <div className="mb-3">
                        <span className="text-sm text-amber-700 font-medium bg-amber-100 px-3 py-1 rounded-full">
                          制作過程・背景・こだわり
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                        {work.production_notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI分析結果 - 発注者向けの詳細情報 */}
                {aiAnalysis && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="text-3xl">🤖</span>
                      AI分析による作品評価
                    </h2>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      
                      {/* 作品要約 */}
                      {aiAnalysis.summary && (
                        <div className="mb-6">
                          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <span className="text-xl">📝</span>
                            <span className="text-lg">作品要約</span>
                          </h3>
                          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                            <p className="text-gray-700 leading-relaxed">
                              {aiAnalysis.summary}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 推奨タグ */}
                      {aiAnalysis.tags && aiAnalysis.tags.length > 0 && (
                        <div className="mb-6">
                          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <span className="text-xl">🏷️</span>
                            <span className="text-lg">AI推奨タグ ({aiAnalysis.tags.length}個)</span>
                          </h3>
                          
                          {/* タグの分類表示 */}
                          {aiAnalysis.tagClassification && (
                            <div className="space-y-3 mb-4">
                              {Object.entries(aiAnalysis.tagClassification).map(([category, tags]: [string, any]) => (
                                tags && tags.length > 0 && (
                                  <div key={category} className="bg-white rounded-lg p-3 border border-blue-100">
                                    <h4 className="text-xs font-medium text-blue-800 mb-2 uppercase tracking-wide">
                                      {category === 'genre' ? 'ジャンル・分野' :
                                       category === 'style' ? '文体・表現' :
                                       category === 'audience' ? '対象読者' :
                                       category === 'format' ? '記事形式' :
                                       category === 'purpose' ? '機能・価値' :
                                       category === 'technique' ? '技術・手法' :
                                       category === 'quality' ? '品質・レベル' :
                                       category === 'unique' ? '個別特徴' : category}
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {tags.map((tag: string, idx: number) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )
                              ))}
                            </div>
                          )}
                          
                          {/* 全タグ一覧 */}
                          <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <h4 className="text-xs font-medium text-blue-800 mb-2 uppercase tracking-wide">
                              全AI推奨タグ
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {aiAnalysis.tags.map((tag: string, index: number) => (
                                <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg border border-blue-200 shadow-sm font-medium">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 作品の強み */}
                      {aiAnalysis.strengths && (
                        <div>
                          <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <span className="text-xl">💪</span>
                            <span className="text-lg">この作品の強み</span>
                          </h3>
                          <div className="grid gap-4 md:grid-cols-3">
                            
                            {/* 創造性 */}
                            {aiAnalysis.strengths.creativity && aiAnalysis.strengths.creativity.length > 0 && (
                              <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
                                <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-2">
                                  <span className="text-lg">🎨</span>
                                  <span>創造性</span>
                                </h4>
                                <ul className="space-y-2">
                                  {aiAnalysis.strengths.creativity.map((strength: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                                      <span className="text-purple-500 mt-1 text-xs">●</span>
                                      <span className="leading-relaxed">{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* 専門性 */}
                            {aiAnalysis.strengths.expertise && aiAnalysis.strengths.expertise.length > 0 && (
                              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                                <h4 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                                  <span className="text-lg">🔧</span>
                                  <span>専門性</span>
                                </h4>
                                <ul className="space-y-2">
                                  {aiAnalysis.strengths.expertise.map((strength: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                                      <span className="text-blue-500 mt-1 text-xs">●</span>
                                      <span className="leading-relaxed">{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* 影響力 */}
                            {aiAnalysis.strengths.impact && aiAnalysis.strengths.impact.length > 0 && (
                              <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                                <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                                  <span className="text-lg">🌟</span>
                                  <span>影響力</span>
                                </h4>
                                <ul className="space-y-2">
                                  {aiAnalysis.strengths.impact.map((strength: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                                      <span className="text-green-500 mt-1 text-xs">●</span>
                                      <span className="leading-relaxed">{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* タグ */}
                {work.tags && work.tags.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="text-3xl">🏷️</span>
                      タグ
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {work.tags.map((tag, index) => (
                        <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* カテゴリ */}
                {work.categories && work.categories.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="text-3xl">📂</span>
                      カテゴリ
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {work.categories.map((category, index) => (
                        <span key={index} className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm rounded-lg font-medium shadow-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 外部リンク */}
                {work.externalUrl && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="text-3xl">🔗</span>
                      作品を見る
                    </h2>
                    <a 
                      href={work.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="text-lg">実際の作品を確認する</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {/* いいねボタン */}
                <div className="mb-8">
                  <div className="flex items-center gap-4">
                    <LikeButton workId={work.id} />
                  </div>
                </div>

                {/* メタ情報 */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>作成日: {new Date(work.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    {work.updatedAt !== work.createdAt && (
                      <span>更新日: {new Date(work.updatedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* コメントセクション */}
            <div className="mt-8">
              <CommentsSection workId={work.id} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 