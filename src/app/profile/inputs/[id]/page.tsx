'use client'

import React, { useState, useEffect, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
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
  const resolvedParams = use(params)
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
      
      const response = await fetch(`/api/inputs/${resolvedParams.id}`, {
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
  }, [resolvedParams.id])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    fetchInputDetail()
  }, [user, resolvedParams.id, fetchInputDetail, router])

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
      book: '本',
      manga: '漫画',
      movie: '映画',
      anime: 'アニメ',
      tv: 'TV',
      game: 'ゲーム',
      podcast: '音声',
      other: 'その他'
    }
    return icons[type] || 'その他'
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      book: 'bg-blue-100 text-blue-700 border-blue-200',
      manga: 'bg-blue-100 text-blue-700 border-blue-200',
      movie: 'bg-blue-100 text-blue-700 border-blue-200',
      anime: 'bg-blue-100 text-blue-700 border-blue-200',
      tv: 'bg-blue-100 text-blue-700 border-blue-200',
      game: 'bg-blue-100 text-blue-700 border-blue-200',
      podcast: 'bg-blue-100 text-blue-700 border-blue-200',
      other: 'bg-blue-100 text-blue-700 border-blue-200'
    }
    return colors[type] || 'bg-blue-100 text-blue-700 border-blue-200'
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-blue-600' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
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
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-blue-200">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="text-sm text-blue-700">{getTypeIcon(input.type)}</p>
                    </div>
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
                
                {/* 日付情報 */}
                <div className="space-y-2 text-sm text-gray-600">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    AI分析結果
                  </h2>
                  
                  <div className="space-y-6">
                    {/* インプット作品概要・要約 */}
                    {input.ai_analysis_result.summary && (
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <h4 className="text-lg font-bold text-blue-900">コンテンツ概要</h4>
                        </div>
                        <p className="text-blue-800 leading-relaxed text-sm">{input.ai_analysis_result.summary}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* 左カラム：AI自動生成されたタグ・ジャンル */}
                      <div className="space-y-4">
                        {/* AI分析でタグ・ジャンルを自動生成 */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <h5 className="font-semibold text-purple-900">AI自動生成タグ・ジャンル</h5>
                          </div>
                          
                          <div className="space-y-4">
                            {/* タグ */}
                            <div>
                              <h6 className="font-medium text-sm mb-2 text-purple-800">タグ</h6>
                              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[50px]">
                                {input.tags && input.tags.length > 0 ? (
                                  input.tags.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                    >
                                      {tag}
                                    </span>
                                  ))
                                ) : input.ai_analysis_result.suggestedTags && input.ai_analysis_result.suggestedTags.length > 0 ? (
                                  input.ai_analysis_result.suggestedTags.map((tag: string, index: number) => (
                                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-200">
                                      {tag}
                                    </span>
                                  ))
                                ) : (
                                  <div className="flex items-center text-gray-400 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    タグが見つかりません
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* ジャンル */}
                            <div>
                              <h6 className="font-medium text-sm mb-2 text-purple-800">ジャンル</h6>
                              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[50px]">
                                {input.genres && input.genres.length > 0 ? (
                                  input.genres.map((genre, index) => (
                                    <span
                                      key={index}
                                      className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                                    >
                                      {genre}
                                    </span>
                                  ))
                                ) : input.ai_analysis_result.suggestedGenres && input.ai_analysis_result.suggestedGenres.length > 0 ? (
                                  input.ai_analysis_result.suggestedGenres.map((genre: string, index: number) => (
                                    <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm border border-purple-200">
                                      {genre}
                                    </span>
                                  ))
                                ) : (
                                  <div className="flex items-center text-gray-400 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    ジャンルが見つかりません
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 右カラム：読者・ファン傾向分析 */}
                          <div>
                        {/* 読者・ファン傾向分析 */}
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
                          <h5 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            この作品を好む人の傾向
                          </h5>
                          
                          <div className="space-y-3">
                        {/* ターゲット層 */}
                            {input.ai_analysis_result.targetAudience && input.ai_analysis_result.targetAudience.length > 0 && (
                              <div className="bg-white/70 rounded-lg p-3">
                                <h6 className="font-semibold text-emerald-800 mb-2 text-sm">読者層</h6>
                                <div className="flex flex-wrap gap-1.5">
                              {input.ai_analysis_result.targetAudience.map((audience: string, index: number) => (
                                    <span key={index} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                                  {audience}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 興味カテゴリ */}
                            {input.ai_analysis_result.interestCategories && input.ai_analysis_result.interestCategories.length > 0 && (
                              <div className="bg-white/70 rounded-lg p-3">
                                <h6 className="font-semibold text-emerald-800 mb-2 text-sm">興味分野</h6>
                                <div className="flex flex-wrap gap-1.5">
                              {input.ai_analysis_result.interestCategories.map((category: string, index: number) => (
                                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                            {/* 好みの雰囲気・テーマ */}
                            {(input.ai_analysis_result.mood || (input.ai_analysis_result.themes && input.ai_analysis_result.themes.length > 0)) && (
                              <div className="bg-white/70 rounded-lg p-3">
                                <h6 className="font-semibold text-emerald-800 mb-2 text-sm">好みの雰囲気</h6>
                                <div className="space-y-2">
                                  {input.ai_analysis_result.mood && (
                                    <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                      {input.ai_analysis_result.mood}
                                    </div>
                                  )}
                                  {input.ai_analysis_result.themes && input.ai_analysis_result.themes.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                      {input.ai_analysis_result.themes.slice(0, 3).map((theme: string, index: number) => (
                                        <span key={index} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                                  {theme}
                                </span>
                              ))}
                          </div>
                        )}
                          </div>
                        </div>
                      )}
                          </div>
                        </div>
                      </div>
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