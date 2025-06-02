'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface LinkPreviewData {
  title: string
  description: string
  image: string
  url: string
  imageWidth: number
  imageHeight: number
  imageSize: number
  imageType: string
  icon: string
  iconWidth: number
  iconHeight: number
  iconSize: number
  iconType: string
  siteName: string
  locale: string
}

export default function EditWorkPage() {
  const params = useParams()
  const router = useRouter()
  const workId = params.id as string
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    externalUrl: '',
    productionDate: '',
    tags: [] as string[],
    roles: [] as string[],
    categories: [] as string[]
  })
  
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 定義済みの役割
  const predefinedRoles = ['編集', '撮影', '企画', '取材', '執筆', 'デザイン']
  // 認証ヘッダーを取得する関数
  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    if (!user) {
      return {
        'Content-Type': 'application/json'
      }
    }
    
    try {
      // Supabaseの場合はセッションからアクセストークンを取得
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session?.access_token) {
        console.error('認証セッション取得エラー:', error)
        return {
          'Content-Type': 'application/json'
        }
      }
      
      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    } catch (error) {
      console.error('認証トークン取得エラー:', error)
      return {
        'Content-Type': 'application/json'
      }
    }
  })

  // 作品データを取得
  useEffect(() => {
    const fetchWork = async () => {
      if (!user) return

      try {
        const headers = await getAuthHeaders()
        const response = await fetch(`/api/works/${workId}`, {
          headers
        })
        const data = await response.json()

        if (response.ok) {
          setFormData({
            title: data.work.title || '',
            description: data.work.description || '',
            externalUrl: data.work.externalUrl || '',
            productionDate: data.work.productionDate || '',
            tags: data.work.tags || [],
            roles: data.work.roles || [],
            categories: data.work.categories || []
          })

          // プレビューデータを設定
          if (data.work.previewData || data.work.preview_data) {
            setPreviewData(data.work.previewData || data.work.preview_data)
          }

          // AI分析データを設定
          if (data.work.ai_analysis_result) {
            setAnalysisResult(data.work.ai_analysis_result)
          }

          // URLがある場合はプレビューを取得
          if (data.work.externalUrl && !data.work.previewData && !data.work.preview_data) {
            fetchLinkPreview(data.work.externalUrl)
          }
        } else {
          alert('作品データの取得に失敗しました')
          router.push('/profile')
        }
      } catch (error) {
        console.error('作品取得エラー:', error)
        alert('作品データの取得に失敗しました')
        router.push('/profile')
      } finally {
        setIsLoading(false)
      }
    }

    if (workId && user) {
      fetchWork()
    }
  }, [workId, user, getAuthHeaders, router])

  // URLプレビューを取得する関数
  const fetchLinkPreview = async (url: string) => {
    if (!url.trim()) return

    setIsLoadingPreview(true)
    setPreviewError('')

    try {
      const response = await fetch('/api/link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'プレビューの取得に失敗しました')
      }

      setPreviewData(data)

    } catch (error) {
      console.error('Preview fetch error:', error)
      setPreviewError(error instanceof Error ? error.message : 'プレビューの取得に失敗しました')
    } finally {
      setIsLoadingPreview(false)
    }
  }

  // URLが変更された時の処理
  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, externalUrl: url }))
    
    // URLが有効な形式の場合、自動でプレビューを取得
    try {
      new URL(url)
      fetchLinkPreview(url)
    } catch {
      // 無効なURLの場合はプレビューをクリア
      setPreviewData(null)
      setPreviewError('')
    }
  }

  // フォームデータの更新
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // タグ追加
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  // タグ削除
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // 役割追加
  const addRole = (role: string) => {
    if (!formData.roles.includes(role)) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, role]
      }))
    }
  }

  // カスタム役割追加
  const addCustomRole = () => {
    if (newRole.trim() && !formData.roles.includes(newRole.trim())) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, newRole.trim()]
      }))
      setNewRole('')
    }
  }

  // 役割削除
  const removeRole = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role !== roleToRemove)
    }))
  }

  // カテゴリ追加
  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }))
      setNewCategory('')
    }
  }

  // カテゴリ削除
  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    }))
  }

  // AI分析機能
  const analyzeWithAI = async () => {
    if (!formData.description && !formData.title && !formData.externalUrl) {
      alert('分析するために、タイトル、URL、または説明文のいずれかを入力してください')
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      // 認証ヘッダーを取得
      const headers = await getAuthHeaders()

      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          url: formData.externalUrl
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI分析に失敗しました')
      }

      setAnalysisResult(data.analysis)

      // 分析結果をフォームに自動反映するかユーザーに確認
      const shouldApply = confirm(
        `AI分析が完了しました！\n\n` +
        `推奨タグ: ${data.analysis.tags?.join(', ') || 'なし'}\n` +
        `要約: ${data.analysis.summary || 'なし'}\n\n` +
        `推奨タグをタグセクションに追加しますか？`
      )

      if (shouldApply) {
        // タグのみ自動追加
        if (data.analysis.tags && Array.isArray(data.analysis.tags)) {
          const newTags = data.analysis.tags.filter((tag: string) => 
            !formData.tags.includes(tag)
          )
          if (newTags.length > 0) {
            setFormData(prev => ({
              ...prev,
              tags: [...prev.tags, ...newTags]
            }))
          }
        }
      }

    } catch (error) {
      console.error('AI Analysis Error:', error)
      alert(error instanceof Error ? error.message : 'AI分析中にエラーが発生しました')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // フォーム送信処理
  const handleSubmit = async () => {
    try {
      // バリデーション
      if (!formData.title.trim()) {
        alert('タイトルを入力してください')
        return
      }

      if (formData.roles.length === 0) {
        alert('役割を選択してください')
        return
      }

      // 認証ヘッダーを取得
      const headers = await getAuthHeaders()

      // APIに送信
      const response = await fetch(`/api/works/${workId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...formData,
          aiAnalysisResult: analysisResult
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '更新に失敗しました')
      }

      alert('作品を更新しました！')
      
      // プロフィール画面にリダイレクト
      router.push('/profile')
      
    } catch (error) {
      console.error('更新エラー:', error)
      alert(error instanceof Error ? error.message : '更新に失敗しました。もう一度お試しください。')
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 animate-spin text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-gray-600">作品データを読み込み中...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* ヘッダー */}
        <div className="border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/profile" className="flex items-center text-gray-600 hover:text-gray-800">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ポートフォリオに戻る
              </Link>
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2 rounded-full"
              >
                更新
              </Button>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">作品を編集</h1>
            <p className="text-gray-600">作品の情報を編集してください</p>
          </div>

          <div className="space-y-8">
            {/* タイトル */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📝</span>
                <h2 className="text-xl font-medium text-gray-800">タイトル</h2>
              </div>
              <Input
                placeholder="作品のタイトルを入力"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-lg border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-purple-500 focus:ring-0"
              />
            </div>

            {/* 作品URL */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔗</span>
                <h2 className="text-xl font-medium text-gray-800">作品URL</h2>
              </div>
              <p className="text-gray-600 text-sm">URLを入力すると、タイトル・説明・タグを自動取得します。</p>
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://example.com/your-work"
                  value={formData.externalUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="text-lg border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-purple-500 focus:ring-0"
                />
                {isLoadingPreview && (
                  <div className="absolute right-0 top-3">
                    <svg className="w-5 h-5 animate-spin text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                )}
              </div>
              {previewError && (
                <p className="text-red-500 text-sm">{previewError}</p>
              )}

              {/* OGP/バナー画像プレビュー */}
              {previewData && (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  {previewData.image && (
                    <div className="w-full h-48 bg-gray-100 relative">
                      <img
                        src={previewData.image}
                        alt="OGP画像"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.style.display = 'none'
                          // 画像読み込み失敗時のフォールバック表示
                          const fallback = target.parentElement?.querySelector('.fallback-bg')
                          if (fallback) {
                            fallback.classList.remove('hidden')
                          }
                        }}
                      />
                      <div className="fallback-bg hidden absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-4xl mb-2 block">🖼️</span>
                          <p className="text-sm text-gray-500">画像を読み込めませんでした</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    {/* サイト情報 */}
                    {(previewData.siteName || previewData.icon) && (
                      <div className="flex items-center space-x-2 mb-3">
                        {previewData.icon && (
                          <img
                            src={previewData.icon}
                            alt="サイトアイコン"
                            className="w-4 h-4 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        )}
                        {previewData.siteName && (
                          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                            {previewData.siteName}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 line-clamp-2 flex-1 text-lg leading-tight">
                        {previewData.title || 'タイトルなし'}
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (previewData?.title && !formData.title) {
                            setFormData(prev => ({ ...prev, title: previewData.title }))
                          }
                          if (previewData?.description && !formData.description) {
                            setFormData(prev => ({ ...prev, description: previewData.description }))
                          }
                        }}
                        className="ml-3 text-xs px-3 py-1 text-purple-600 border-purple-300 hover:bg-purple-50 flex-shrink-0 font-medium"
                      >
                        反映
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3 leading-relaxed">
                      {previewData.description || '説明なし'}
                    </p>
                    <p className="text-xs text-gray-400 truncate font-mono">
                      {previewData.url}
                    </p>
                    
                    {/* 画像情報 */}
                    {previewData?.image && previewData?.imageWidth > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                          📐 {previewData.imageWidth} × {previewData.imageHeight}px
                          {previewData?.imageSize > 0 && ` • 📁 ${Math.round(previewData.imageSize / 1024)}KB`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 説明文 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💬</span>
                  <h2 className="text-xl font-medium text-gray-800">説明文</h2>
                </div>
                <Button
                  onClick={analyzeWithAI}
                  variant="outline"
                  disabled={isAnalyzing}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>分析中...</span>
                    </div>
                  ) : (
                    'AI分析する'
                  )}
                </Button>
              </div>
              <Textarea
                placeholder="作品の説明を入力"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[120px] border-2 border-gray-200 rounded-lg p-4 focus:border-purple-500 focus:ring-0 resize-none"
              />
            </div>

            {/* 掲載月 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📆</span>
                <h2 className="text-xl font-medium text-gray-800">掲載月</h2>
              </div>
              <Input
                type="month"
                value={formData.productionDate}
                onChange={(e) => handleInputChange('productionDate', e.target.value)}
                className="text-lg border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-purple-500 focus:ring-0 w-48"
              />
            </div>

            {/* タグ */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏷️</span>
                <h2 className="text-xl font-medium text-gray-800">タグ</h2>
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="タグを入力して Enter"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-0"
                />
                <Button
                  onClick={addTag}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
                >
                  追加
                </Button>
              </div>

              {/* AI分析による推奨タグ */}
              {analysisResult && analysisResult.tags && analysisResult.tags.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm">🤖</span>
                    <span className="text-sm font-medium text-purple-800">AI推奨タグ</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.tags.map((tag: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!formData.tags.includes(tag)) {
                            setFormData(prev => ({
                              ...prev,
                              tags: [...prev.tags, tag]
                            }))
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          formData.tags.includes(tag)
                            ? 'bg-purple-200 text-purple-800 cursor-default'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer border-2 border-dashed border-purple-300'
                        }`}
                        disabled={formData.tags.includes(tag)}
                      >
                        {tag} {!formData.tags.includes(tag) && '+'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* あなたの役割 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🧑‍💻</span>
                <h2 className="text-xl font-medium text-gray-800">あなたの役割</h2>
                <span className="text-red-500">*</span>
              </div>
              
              {formData.roles.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">ここに選択した役割が表示されます</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.roles.map((role, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{role}</span>
                        <button
                          onClick={() => removeRole(role)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {predefinedRoles.map((role) => (
                  <Button
                    key={role}
                    onClick={() => addRole(role)}
                    variant="outline"
                    className={`border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 ${
                      formData.roles.includes(role) ? 'bg-purple-100 border-purple-500' : ''
                    }`}
                  >
                    {role} ＋
                  </Button>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="その他の役割を入力"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomRole())}
                  className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-0"
                />
                <Button
                  onClick={addCustomRole}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
                >
                  追加
                </Button>
              </div>
            </div>

            {/* カテゴリ */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📂</span>
                <h2 className="text-xl font-medium text-gray-800">カテゴリ（複数選択可）</h2>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="新しいカテゴリ名を入力"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-0"
                />
                <Button
                  onClick={addCategory}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  追加
                </Button>
              </div>

              {formData.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{category}</span>
                      <button
                        onClick={() => removeCategory(category)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 カテゴリを使って作品を整理しましょう。例：「Webデザイン」「ロゴ制作」「写真撮影」など
              </div>
            </div>

            {/* AI分析結果：要約と作品の強み */}
            {analysisResult && (analysisResult.summary || (analysisResult.strengths && (
              analysisResult.strengths.creativity?.length > 0 || 
              analysisResult.strengths.expertise?.length > 0 || 
              analysisResult.strengths.impact?.length > 0
            ))) && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">🤖</span>
                  <h2 className="text-xl font-medium text-blue-800">AI分析結果</h2>
                </div>
                
                <div className="space-y-4">
                  {analysisResult.summary && (
                    <div>
                      <h3 className="font-medium text-blue-700 mb-2 flex items-center space-x-2">
                        <span>📝</span>
                        <span>要約</span>
                      </h3>
                      <p className="text-gray-700 bg-white rounded-lg p-3 border border-blue-100">
                        {analysisResult.summary}
                      </p>
                    </div>
                  )}
                  
                  {analysisResult.strengths && (
                    <div>
                      <h3 className="font-medium text-blue-700 mb-2 flex items-center space-x-2">
                        <span>💪</span>
                        <span>作品の強み</span>
                      </h3>
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        {/* 創造性 */}
                        {analysisResult.strengths.creativity && analysisResult.strengths.creativity.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-purple-600 mb-2 flex items-center space-x-2">
                              <span>🎨</span>
                              <span>創造性</span>
                            </h4>
                            <ul className="space-y-1">
                              {analysisResult.strengths.creativity.map((strength: string, index: number) => (
                                <li key={index} className="flex items-start space-x-2 text-gray-700 text-sm">
                                  <span className="text-purple-500 mt-1">✓</span>
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 専門性 */}
                        {analysisResult.strengths.expertise && analysisResult.strengths.expertise.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-blue-600 mb-2 flex items-center space-x-2">
                              <span>🔧</span>
                              <span>専門性</span>
                            </h4>
                            <ul className="space-y-1">
                              {analysisResult.strengths.expertise.map((strength: string, index: number) => (
                                <li key={index} className="flex items-start space-x-2 text-gray-700 text-sm">
                                  <span className="text-blue-500 mt-1">✓</span>
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 影響力 */}
                        {analysisResult.strengths.impact && analysisResult.strengths.impact.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-600 mb-2 flex items-center space-x-2">
                              <span>🌟</span>
                              <span>影響力</span>
                            </h4>
                            <ul className="space-y-1">
                              {analysisResult.strengths.impact.map((strength: string, index: number) => (
                                <li key={index} className="flex items-start space-x-2 text-gray-700 text-sm">
                                  <span className="text-green-500 mt-1">✓</span>
                                  <span>{strength}</span>
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

            {/* 下部のアクションボタン */}
            <div className="flex justify-center space-x-4 pt-8">
              <Link href="/profile">
                <Button variant="outline" className="px-8 py-3 rounded-full border-gray-300 text-gray-600 hover:bg-gray-50">
                  キャンセル
                </Button>
              </Link>
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full"
              >
                更新
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 