'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeftIcon, PencilIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { HeartIcon } from '@heroicons/react/24/solid'

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
}

export default function InputDetailPage({ params }: any) {
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
      
      // Supabaseからアクセストークンを取得
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.access_token) {
        throw new Error('認証トークンの取得に失敗しました')
      }
      
      const response = await fetch(`/api/inputs/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('インプットの取得に失敗しました')
      }
      
      const data = await response.json()
      setInput(data.input)
    } catch (error) {
      console.error('インプット詳細取得エラー:', error)
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    fetchInputDetail()
  }, [user, params.id, fetchInputDetail, router])

  const handleDelete = async () => {
    if (!input) return
    
    try {
      setDeleting(true)
      
      // Supabaseからアクセストークンを取得
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !input) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'インプットが見つかりません'}</p>
          <Link href="/profile?tab=inputs" className="text-blue-600 hover:underline">
            インプット一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/profile?tab=inputs"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                インプット一覧に戻る
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                href={`/profile/inputs/${input.id}/edit`}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                編集
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                削除
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左カラム: 基本情報 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* カバー画像 */}
              <div className="aspect-[3/4] bg-gray-100 relative">
                {input.cover_image_url ? (
                  <Image
                    src={input.cover_image_url}
                    alt={input.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-6xl">{getTypeIcon(input.type)}</span>
                  </div>
                )}
                
                {/* お気に入りマーク */}
                {input.favorite && (
                  <div className="absolute top-4 right-4">
                    <HeartIcon className="h-8 w-8 text-red-500" />
                  </div>
                )}
              </div>
              
              {/* 基本情報 */}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getTypeColor(input.type)}`}>
                    {getTypeIcon(input.type)} {input.type}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded border">
                    {input.status}
                  </span>
                </div>
                
                <h1 className="text-xl font-bold text-gray-900 mb-2">{input.title}</h1>
                
                {input.author_creator && (
                  <p className="text-gray-600 mb-3">作者: {input.author_creator}</p>
                )}
                
                {input.category && (
                  <p className="text-gray-600 mb-3">カテゴリ: {input.category}</p>
                )}
                
                {/* 評価 */}
                {input.rating && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">評価</h3>
                    {renderStars(input.rating)}
                  </div>
                )}
                
                {/* 日付情報 */}
                <div className="space-y-2 text-sm text-gray-600">
                  {input.release_date && (
                    <p>発売日: {new Date(input.release_date).toLocaleDateString()}</p>
                  )}
                  {input.consumption_date && (
                    <p>視聴/読了日: {new Date(input.consumption_date).toLocaleDateString()}</p>
                  )}
                </div>
                
                {/* 外部リンク */}
                {input.external_url && (
                  <div className="mt-4">
                    <a
                      href={input.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      外部リンクを開く →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右カラム: 詳細情報とAI分析 */}
          <div className="lg:col-span-2 space-y-6">
            {/* タグとジャンル */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">タグ・ジャンル</h2>
              
              {input.tags && input.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">タグ</h3>
                  <div className="flex flex-wrap gap-2">
                    {input.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded border border-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {input.genres && input.genres.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">ジャンル</h3>
                  <div className="flex flex-wrap gap-2">
                    {input.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded border border-green-200"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* レビュー・ノート */}
            {(input.review || input.notes) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">レビュー・メモ</h2>
                
                {input.review && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">レビュー</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{input.review}</p>
                  </div>
                )}
                
                {input.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">メモ</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{input.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* AI分析結果 */}
            {input.ai_analysis_result && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-purple-600" />
                  AI分析結果
                </h2>
                
                <div className="space-y-4">
                  {/* 魅力ポイント */}
                  {input.ai_analysis_result.appealPoints && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <span className="text-green-600">✨</span>
                        魅力ポイント
                      </h3>
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
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <span className="text-orange-600">🎯</span>
                        ターゲット層
                      </h3>
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
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <span className="text-pink-600">🧠</span>
                        パーソナリティ特性
                      </h3>
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
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <span className="text-indigo-600">🔍</span>
                        興味カテゴリ
                      </h3>
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
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <span className="text-gray-600">📖</span>
                        主要テーマ
                      </h3>
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
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-gray-600">🌟</span>
                        作品の雰囲気
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{input.ai_analysis_result.mood}</p>
                    </div>
                  )}

                  {/* 創作への影響 */}
                  {input.ai_analysis_result.creativeInfluence && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-yellow-800 mb-3 flex items-center gap-2">
                        <span className="text-yellow-600">🎨</span>
                        創作への影響・インスピレーション
                      </h3>
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

                  {/* 創作方向性（レガシー対応） */}
                  {input.ai_analysis_result.creativeInsights?.creativeDirection && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <span className="text-yellow-600">🎯</span>
                        創作方向性
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {input.ai_analysis_result.creativeInsights.creativeDirection.map((direction: string, index: number) => (
                          <span key={index} className="px-3 py-1.5 text-sm bg-yellow-50 text-yellow-800 rounded-full border border-yellow-200">
                            {direction}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 分析精度表示 */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 font-medium">
                      🤖 AI分析完了
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {input.ai_analysis_result.suggestedTags?.length || 0}個のタグを自動追加済み
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 削除確認モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">削除の確認</h3>
            <p className="text-gray-600 mb-6">
              「{input.title}」を削除しますか？<br />
              この操作は取り消せません。
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 