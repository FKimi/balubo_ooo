'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeftIcon, PencilIcon, TrashIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline'
import { HeartIcon } from '@heroicons/react/24/solid'
import { Header, MobileBottomNavigation } from '@/components/layout/header'

interface InputDetail {
  id: string
  title: string
  type: string
  category: string
  author_creator: string
  release_date: string | null
  consumption_date: string | null
  status: string
  rating: number | null
  review: string
  tags: string[]
  genres: string[]
  external_url: string
  cover_image_url: string
  notes: string
  favorite: boolean
  ai_analysis_result: any
  created_at: string
  updated_at: string
  user_id: string
  user?: {
    id: string
    display_name: string
    avatar_image_url?: string
  }
}

export default function InputDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [input, setInput] = useState<InputDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchInputDetail = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('=== インプット詳細取得開始 ===')
      console.log('インプットID:', params.id)
      
      // 認証トークンを取得（オプション）
      let authToken = null
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (!sessionError && session?.access_token) {
          authToken = session.access_token
          console.log('認証トークン取得成功')
        } else {
          console.log('認証トークンなし（ゲストアクセス）')
        }
      } catch (authError) {
        console.log('認証トークン取得エラー（続行）:', authError)
      }
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }
      
      console.log('API呼び出し中...', `/api/inputs/${params.id}`)
      
      const response = await fetch(`/api/inputs/${params.id}`, {
        headers
      })
      
      console.log('APIレスポンス:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })
      
      if (!response.ok) {
        let errorMessage = 'インプットの取得に失敗しました'
        
        try {
          const errorData = await response.json()
          console.error('APIエラーレスポンス:', errorData)
          
          if (response.status === 404) {
            errorMessage = 'インプットが見つかりません'
          } else if (response.status === 403) {
            errorMessage = 'このインプットを閲覧する権限がありません'
          } else if (errorData.details) {
            errorMessage = `${errorMessage}: ${errorData.details}`
          }
        } catch (parseError) {
          console.error('エラーレスポンスのパースに失敗:', parseError)
        }
        
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      console.log('インプットデータ取得成功:', {
        id: data.input?.id,
        title: data.input?.title,
        hasUser: !!data.input?.user
      })
      
      setInput(data.input)
      console.log('=== インプット詳細取得完了 ===')
      
    } catch (error) {
      console.error('=== インプット詳細取得エラー ===')
      console.error('エラー詳細:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        inputId: params.id
      })
      
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchInputDetail()
  }, [params.id, fetchInputDetail])

  const handleDelete = async () => {
    if (!input || !user || input.user_id !== user.id) return
    
    try {
      setDeleting(true)
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.access_token) {
        throw new Error('認証トークンの取得に失敗しました')
      }
      
      const response = await fetch(`/api/inputs/${input.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('削除に失敗しました')
      }
      
      router.push('/profile?tab=inputs')
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      book: '📚',
      manga: '📖',
      movie: '🎬',
      anime: '🎌',
      tv: '📺',
      game: '🎮',
      podcast: '🎧',
      other: '📄'
    }
    return icons[type] || '📄'
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      book: 'bg-blue-100 text-blue-800 border-blue-200',
      manga: 'bg-pink-100 text-pink-800 border-pink-200',
      movie: 'bg-purple-100 text-purple-800 border-purple-200',
      anime: 'bg-red-100 text-red-800 border-red-200',
      tv: 'bg-green-100 text-green-800 border-green-200',
      game: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      podcast: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    )
  }

  // 自分のインプットかどうかを判定
  const isOwnInput = user && input && input.user_id === user.id

  if (loading) {
    return (
      <div className="min-h-screen bg-base-light-gray">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-dark-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
        <MobileBottomNavigation />
      </div>
    )
  }

  if (error || !input) {
    return (
      <div className="min-h-screen bg-base-light-gray">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'インプットが見つかりません'}</p>
            <Link href="/feed" className="text-accent-dark-blue hover:underline">
              フィードに戻る
            </Link>
          </div>
        </div>
        <MobileBottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-light-gray">
      <Header />
      
      <main className="pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* ナビゲーション */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              戻る
            </button>
          </div>

          {/* メインコンテンツ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* ヘッダー部分 */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getTypeIcon(input.type)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(input.type)}`}>
                      {input.type}
                    </span>
                    {input.favorite && (
                      <HeartIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {input.title}
                  </h1>
                  {input.author_creator && (
                    <p className="text-lg text-gray-600 mb-3">
                      著者・制作者: {input.author_creator}
                    </p>
                  )}
                  {input.rating && renderStars(input.rating)}
                </div>
                
                {/* 編集・削除ボタン（自分のインプットの場合のみ） */}
                {isOwnInput && (
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/profile/inputs/${input.id}/edit`}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      編集
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      削除
                    </button>
                  </div>
                )}
              </div>

              {/* ユーザー情報（他のユーザーのインプットの場合） */}
              {!isOwnInput && input.user && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {input.user.avatar_image_url ? (
                      <img
                        src={input.user.avatar_image_url}
                        alt={input.user.display_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{input.user.display_name}</p>
                    <p className="text-sm text-gray-500">のインプット</p>
                  </div>
                </div>
              )}
            </div>

            {/* コンテンツ部分 */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左側: カバー画像 */}
                {input.cover_image_url && (
                  <div className="lg:col-span-1">
                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-md">
                      <img
                        src={input.cover_image_url}
                        alt={input.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* 右側: 詳細情報 */}
                <div className={input.cover_image_url ? 'lg:col-span-2' : 'lg:col-span-3'}>
                  <div className="space-y-6">
                    {/* 基本情報 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">基本情報</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {input.category && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">カテゴリ</dt>
                            <dd className="text-sm text-gray-900">{input.category}</dd>
                          </div>
                        )}
                        {input.release_date && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">リリース日</dt>
                            <dd className="text-sm text-gray-900">
                              {new Date(input.release_date).toLocaleDateString('ja-JP')}
                            </dd>
                          </div>
                        )}
                        {input.consumption_date && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">消費日</dt>
                            <dd className="text-sm text-gray-900">
                              {new Date(input.consumption_date).toLocaleDateString('ja-JP')}
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-sm font-medium text-gray-500">ステータス</dt>
                          <dd className="text-sm text-gray-900">{input.status}</dd>
                        </div>
                      </div>
                    </div>

                    {/* レビュー */}
                    {input.review && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">レビュー</h3>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap">{input.review}</p>
                        </div>
                      </div>
                    )}

                    {/* メモ */}
                    {input.notes && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">メモ</h3>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap">{input.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* タグ */}
                    {input.tags && input.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">タグ</h3>
                        <div className="flex flex-wrap gap-2">
                          {input.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ジャンル */}
                    {input.genres && input.genres.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">ジャンル</h3>
                        <div className="flex flex-wrap gap-2">
                          {input.genres.map((genre, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 外部リンク */}
                    {input.external_url && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">外部リンク</h3>
                        <a
                          href={input.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-accent-dark-blue hover:underline"
                        >
                          詳細を見る
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}

                    {/* AI分析結果 */}
                    {input.ai_analysis_result && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <SparklesIcon className="h-5 w-5 mr-2 text-purple-500" />
                          AI分析結果
                        </h3>
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                          <div className="space-y-4">
                            {/* 魅力ポイント */}
                            {input.ai_analysis_result.appealPoints && (
                              <div>
                                <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center gap-2">
                                  <span className="text-green-600">✨</span>
                                  魅力ポイント
                                </h4>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                  <div className="space-y-2">
                                    {input.ai_analysis_result.appealPoints.map((point: string, index: number) => (
                                      <div key={index} className="text-sm text-green-800 flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span className="leading-relaxed">{point}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* ターゲット層 */}
                            {input.ai_analysis_result.targetAudience && (
                              <div>
                                <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center gap-2">
                                  <span className="text-orange-600">🎯</span>
                                  ターゲット層
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {input.ai_analysis_result.targetAudience.map((audience: string, index: number) => (
                                    <span key={index} className="px-3 py-1.5 text-sm bg-orange-50 text-orange-800 rounded-full border border-orange-200">
                                      {audience}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* パーソナリティ特性 */}
                            {input.ai_analysis_result.personalityTraits && (
                              <div>
                                <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center gap-2">
                                  <span className="text-pink-600">🧠</span>
                                  パーソナリティ特性
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {input.ai_analysis_result.personalityTraits.map((trait: string, index: number) => (
                                    <span key={index} className="px-3 py-1.5 text-sm bg-pink-50 text-pink-800 rounded-full border border-pink-200">
                                      {trait}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 興味カテゴリ */}
                            {input.ai_analysis_result.interestCategories && (
                              <div>
                                <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center gap-2">
                                  <span className="text-indigo-600">🔍</span>
                                  興味カテゴリ
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {input.ai_analysis_result.interestCategories.map((category: string, index: number) => (
                                    <span key={index} className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-800 rounded-full border border-indigo-200">
                                      {category}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 主要テーマ */}
                            {input.ai_analysis_result.themes && (
                              <div>
                                <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center gap-2">
                                  <span className="text-gray-600">📖</span>
                                  主要テーマ
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {input.ai_analysis_result.themes.map((theme: string, index: number) => (
                                    <span key={index} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800 rounded-full border border-gray-200">
                                      {theme}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 作品の雰囲気 */}
                            {input.ai_analysis_result.mood && (
                              <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-purple-800 mb-2 flex items-center gap-2">
                                  <span className="text-gray-600">🌟</span>
                                  作品の雰囲気
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">{input.ai_analysis_result.mood}</p>
                              </div>
                            )}

                            {/* 創作への影響 */}
                            {input.ai_analysis_result.creativeInfluence && (
                              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-yellow-800 mb-3 flex items-center gap-2">
                                  <span className="text-yellow-600">🎨</span>
                                  創作への影響・インスピレーション
                                </h4>
                                <div className="space-y-2">
                                  {input.ai_analysis_result.creativeInfluence.map((influence: string, index: number) => (
                                    <div key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                                      <span className="text-yellow-500 mt-0.5">💡</span>
                                      <span className="leading-relaxed">{influence}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 分析精度表示 */}
                            <div className="text-center pt-4 border-t border-purple-200">
                              <div className="text-sm text-purple-700 font-medium">
                                🤖 AI分析完了
                              </div>
                              <div className="text-xs text-purple-600 mt-1">
                                {input.ai_analysis_result.suggestedTags?.length || 0}個のタグを自動追加済み
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 削除確認モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">インプットを削除</h3>
            <p className="text-gray-600 mb-6">
              このインプットを削除してもよろしいですか？この操作は取り消せません。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={deleting}
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? '削除中...' : '削除'}
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileBottomNavigation />
    </div>
  )
} 