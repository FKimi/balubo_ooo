'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/header'
import { ShareSuccessToast } from '@/components/social/ShareModal'
import { shareToTwitter } from '@/utils/socialShare'
import { InputType, InputStatus, InputData, inputTypeLabels, inputStatusLabels, defaultInputData } from '@/types/input'

interface PreviewData {
  title: string
  description: string
  image: string
  author: string
  type: string
  category: string
  releaseDate: string
  genre: string[]
  tags: string[]
  rating?: number
  url: string
}

interface AIAnalysis {
  suggestedTags: string[]
  suggestedGenres: string[]
  targetAudience: string[]
  appealPoints: string[]
  personalityTraits: string[]
  interestCategories: string[]
  mood: string
  themes: string[]
  difficulty: string
  timeCommitment: string
  socialElements: string[]
  creativeInfluence: string[]
}

export default function NewInputPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [inputData, setInputData] = useState<Partial<InputData>>({
    ...defaultInputData,
    userId: user?.id || ''
  })
  const [showShareToast, setShowShareToast] = useState(false)
  const [savedInputData, setSavedInputData] = useState<any>(null)

  // URL自動取得機能
  const fetchPreviewData = async () => {
    if (!urlInput.trim()) {
      alert('URLを入力してください')
      return
    }

    setIsLoadingPreview(true)
    try {
      const response = await fetch('/api/inputs/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'プレビューデータの取得に失敗しました')
      }

      console.log('プレビューデータ取得成功:', data.previewData)
      setPreviewData(data.previewData)
      setShowPreview(true)

      // プレビューデータを入力フォームに自動入力
      if (data.previewData) {
        setInputData(prev => ({
          ...prev,
          title: data.previewData.title || '',
          type: (data.previewData.type as InputType) || 'other',
          category: data.previewData.category || '',
          authorCreator: data.previewData.author || '',
          description: data.previewData.description || '',
          tags: data.previewData.tags || [],
          genres: data.previewData.genre || [],
          externalUrl: data.previewData.url || urlInput,
          coverImageUrl: data.previewData.image || '',
          rating: data.previewData.rating || undefined
        }))
      }

    } catch (error) {
      console.error('プレビューデータ取得エラー:', error)
      alert(error instanceof Error ? error.message : 'プレビューデータの取得に失敗しました')
    } finally {
      setIsLoadingPreview(false)
    }
  }

  // AI分析機能
  const fetchAIAnalysis = async () => {
    if (!inputData.title) {
      alert('タイトルを入力してください')
      return
    }

    setIsLoadingAI(true)
    try {
      const response = await fetch('/api/inputs/ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI分析に失敗しました')
      }

      console.log('AI分析取得成功:', data.analysis)
      setAiAnalysis(data.analysis)
      setShowAI(true)

      // AI分析結果を入力フォームに自動入力
      if (data.analysis) {
        setInputData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), ...data.analysis.suggestedTags.slice(0, 5)].filter((tag, index, arr) => arr.indexOf(tag) === index),
          genres: [...(prev.genres || []), ...data.analysis.suggestedGenres.slice(0, 3)].filter((genre, index, arr) => arr.indexOf(genre) === index),
          aiAnalysisResult: data.analysis
        }))
      }

    } catch (error) {
      console.error('AI分析エラー:', error)
      alert(error instanceof Error ? error.message : 'AI分析に失敗しました')
    } finally {
      setIsLoadingAI(false)
    }
  }

  // タグを追加する関数
  const addTag = (tag: string) => {
    if (tag && !inputData.tags?.includes(tag)) {
      setInputData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }))
    }
  }

  // タグを削除する関数
  const removeTag = (tagToRemove: string) => {
    setInputData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  // ジャンルを追加する関数
  const addGenre = (genre: string) => {
    if (genre && !inputData.genres?.includes(genre)) {
      setInputData(prev => ({
        ...prev,
        genres: [...(prev.genres || []), genre]
      }))
    }
  }

  // ジャンルを削除する関数
  const removeGenre = (genreToRemove: string) => {
    setInputData(prev => ({
      ...prev,
      genres: prev.genres?.filter(genre => genre !== genreToRemove) || []
    }))
  }

  // インプット保存処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputData.title) {
      alert('タイトルを入力してください')
      return
    }

    setIsLoading(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('認証が必要です')
      }
      
      // 現在の日付を自動設定（月の初日に設定）
      const currentDate = new Date()
      const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`
      
      const dataToSave = {
        ...inputData,
        consumptionDate: currentYearMonth, // 登録月の初日を自動設定（例：2025-06-01）
        status: 'completed' // デフォルトステータスを設定
      }
      
      const response = await fetch('/api/inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(dataToSave),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'インプットの保存に失敗しました')
      }

      console.log('インプット保存成功:', data)
      
      // 共有トーストを表示
      setSavedInputData(dataToSave)
      setShowShareToast(true)

      // 3秒後にプロフィールページに遷移
      setTimeout(() => {
        router.push('/profile?tab=inputs')
      }, 3000)

    } catch (error) {
      console.error('インプット保存エラー:', error)
      alert(error instanceof Error ? error.message : 'インプットの保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            
            {/* ヘッダー */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/profile?tab=inputs">
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    戻る
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">📖 新しいインプットを追加</h1>
              </div>
              <p className="text-gray-600">
                本、映画、アニメなどの消費したコンテンツを記録しましょう。URLを入力すると情報を自動取得できます。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* メインフォーム */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">📝</span>
                      インプット情報
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {/* URL自動取得セクション */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <h3 className="font-semibold text-blue-900">URL自動取得</h3>
                        </div>
                        <p className="text-blue-700 text-sm mb-4">
                          Amazon、Netflix、YouTube、SteamなどのURLから情報を自動取得します
                        </p>
                        <div className="flex gap-2">
                          <Input
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://www.amazon.co.jp/..."
                            className="flex-1"
                          />
                          <Button 
                            type="button"
                            onClick={fetchPreviewData}
                            disabled={isLoadingPreview}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isLoadingPreview ? '取得中...' : '取得'}
                          </Button>
                        </div>
                      </div>

                      {/* 基本情報 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">タイトル *</Label>
                          <Input
                            id="title"
                            value={inputData.title || ''}
                            onChange={(e) => setInputData(prev => ({ ...prev, title: e.target.value }))}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="type">タイプ *</Label>
                          <select
                            id="type"
                            value={inputData.type || 'other'}
                            onChange={(e) => setInputData(prev => ({ ...prev, type: e.target.value as InputType }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {Object.entries(inputTypeLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">カテゴリ</Label>
                          <Input
                            id="category"
                            value={inputData.category || ''}
                            onChange={(e) => setInputData(prev => ({ ...prev, category: e.target.value }))}
                            placeholder="例: ビジネス書、アクション映画"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="authorCreator">作者・制作者</Label>
                          <Input
                            id="authorCreator"
                            value={inputData.authorCreator || ''}
                            onChange={(e) => setInputData(prev => ({ ...prev, authorCreator: e.target.value }))}
                            placeholder="例: 村上春樹、宮崎駿"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="rating">評価</Label>
                        <select
                          id="rating"
                          value={inputData.rating || ''}
                          onChange={(e) => setInputData(prev => ({ 
                            ...prev, 
                            rating: e.target.value ? parseInt(e.target.value) : 0 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">未評価</option>
                          <option value="5">⭐⭐⭐⭐⭐ 5点</option>
                          <option value="4">⭐⭐⭐⭐ 4点</option>
                          <option value="3">⭐⭐⭐ 3点</option>
                          <option value="2">⭐⭐ 2点</option>
                          <option value="1">⭐ 1点</option>
                        </select>
                      </div>



                      {/* メモ・感想 */}
                      <div>
                        <Label htmlFor="notes">メモ・感想・レビュー</Label>
                        <textarea
                          id="notes"
                          value={inputData.notes || ''}
                          onChange={(e) => setInputData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="このコンテンツについてのメモ、感想、レビューを書いてください..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          rows={4}
                        />
                      </div>

                      {/* AI分析によるタグとジャンル */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <h3 className="font-semibold text-purple-900">🤖 AI分析でタグ・ジャンルを自動生成</h3>
                        </div>
                        <p className="text-purple-700 text-sm mb-4">
                          タイトルを入力してAI分析を実行すると、適切なタグとジャンルが自動で追加されます
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-purple-800">タグ</Label>
                            <div className="flex flex-wrap gap-2 p-3 bg-white border border-purple-200 rounded-md min-h-[50px]">
                              {inputData.tags && inputData.tags.length > 0 ? (
                                inputData.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => removeTag(tag)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))
                              ) : (
                                <div className="flex items-center text-gray-400 text-sm">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  AI分析でタグが追加されます
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-purple-800">ジャンル</Label>
                            <div className="flex flex-wrap gap-2 p-3 bg-white border border-purple-200 rounded-md min-h-[50px]">
                              {inputData.genres && inputData.genres.length > 0 ? (
                                inputData.genres.map((genre, index) => (
                                  <span
                                    key={index}
                                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                                  >
                                    {genre}
                                    <button
                                      type="button"
                                      onClick={() => removeGenre(genre)}
                                      className="text-purple-600 hover:text-purple-800"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))
                              ) : (
                                <div className="flex items-center text-gray-400 text-sm">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                  AI分析でジャンルが追加されます
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 送信ボタン */}
                      <div className="flex gap-4 pt-4">
                        <Button
                          type="submit"
                          disabled={isLoading || !inputData.title}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {isLoading ? '保存中...' : '💾 インプットを保存'}
                        </Button>
                        <Link href="/profile?tab=inputs">
                          <Button type="button" variant="outline">
                            キャンセル
                          </Button>
                        </Link>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* サイドバー */}
              <div className="space-y-6">
                
                {/* AI分析セクション */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🤖</span>
                      AI分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      AIがコンテンツを分析して、適切なタグや魅力ポイントを提案します
                    </p>
                    <Button
                      type="button"
                      onClick={fetchAIAnalysis}
                      disabled={isLoadingAI || !inputData.title}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isLoadingAI ? '分析中...' : '🔮 AI分析を実行'}
                    </Button>
                  </CardContent>
                </Card>

                {/* プレビューデータ表示 */}
                {showPreview && previewData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">👀</span>
                        プレビュー
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {previewData.image && (
                          <img 
                            src={previewData.image} 
                            alt="カバー画像"
                            className="w-full h-32 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{previewData.title}</h4>
                          <p className="text-sm text-gray-600">{previewData.author}</p>
                          <p className="text-xs text-gray-500 mt-1">{previewData.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI分析結果表示 */}
                {showAI && aiAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        AI分析結果
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* 提案タグ */}
                        <div>
                          <h5 className="font-medium text-sm mb-2">提案タグ</h5>
                          <div className="flex flex-wrap gap-1">
                            {aiAnalysis.suggestedTags.slice(0, 6).map((tag, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => addTag(tag)}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs border border-blue-200 transition-colors"
                              >
                                + {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 魅力ポイント */}
                        <div>
                          <h5 className="font-medium text-sm mb-2">魅力ポイント</h5>
                          <div className="space-y-1">
                            {aiAnalysis.appealPoints.slice(0, 3).map((point, index) => (
                              <div key={index} className="text-xs text-gray-600 flex items-start gap-1">
                                <span className="text-green-500">✓</span>
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ターゲット層 */}
                        <div>
                          <h5 className="font-medium text-sm mb-2">ターゲット層</h5>
                          <div className="flex flex-wrap gap-1">
                            {aiAnalysis.targetAudience.slice(0, 3).map((audience, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {audience}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* 共有トースト */}
        <ShareSuccessToast
          isOpen={showShareToast}
          onClose={() => setShowShareToast(false)}
          type="input"
          onShare={() => {
            if (savedInputData) {
              shareToTwitter('input', savedInputData)
              setShowShareToast(false)
              router.push('/profile?tab=inputs')
            }
          }}
        />
      </div>
    </ProtectedRoute>
  )
} 