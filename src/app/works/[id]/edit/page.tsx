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
import { AIAnalysisDetailModal } from '@/components/works/AIAnalysisDetailModal'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, X, Sparkles } from 'lucide-react'

interface AnalysisResult {
  summary?: string
  genre?: string[]
  topic?: string[]
  keyword?: string[]
  sentiment?: string[]
  style?: string[]
  target?: string[]
  strengths?: {
    creativity?: string[]
    expertise?: string[]
    impact?: string[]
  }
  tags?: string[]
  tagClassification?: {
    [key: string]: string[]
  }
}

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
    categories: [] as string[],
    contentType: '' as string
  })
  
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAIAnalysisDetailOpen, setIsAIAnalysisDetailOpen] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewContent, setPreviewContent] = useState<{
    title: string;
    content: string;
    tags: string[];
  }>({
    title: '',
    content: '',
    tags: []
  })
  const [useFullContent, setUseFullContent] = useState(false)
  const [articleContent, setArticleContent] = useState('')

  // 定義済みの役割
  const predefinedRoles = ['編集', '撮影', '企画', '取材', '執筆', 'デザイン']

  // コンテンツタイプの定義
  const contentTypes = [
    { id: 'article', name: '記事・ライティング', emoji: '📝', description: 'ブログ記事、コラム、ニュース記事など' },
    { id: 'design', name: 'デザイン', emoji: '🎨', description: 'グラフィックデザイン、UI/UXデザイン、ロゴなど' },
    { id: 'photo', name: '写真', emoji: '📸', description: '写真撮影、フォトレタッチなど' },
    { id: 'video', name: '動画', emoji: '🎬', description: '動画制作、映像編集、アニメーションなど' },
    { id: 'podcast', name: 'ポッドキャスト', emoji: '🎙️', description: '音声コンテンツ、ラジオ番組など' },
    { id: 'event', name: 'イベント', emoji: '🎪', description: 'イベント企画・運営、カンファレンスなど' }
  ]
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
  }, [user])

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
            categories: data.work.categories || [],
            contentType: data.work.contentType || data.work.content_type || ''
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

  // Enterキーでタグ追加
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
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

    // コンテンツタイプが未選択の場合は警告
    if (!formData.contentType) {
      const shouldContinue = confirm('コンテンツタイプが選択されていません。汎用的な分析を行いますか？\n\nより精度の高い分析のために、まずコンテンツタイプを選択することをお勧めします。')
      if (!shouldContinue) {
        return
      }
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
          url: formData.externalUrl,
          contentType: formData.contentType
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
      setIsSaving(true)
      setError(null)

      // バリデーション
      if (!formData.title.trim()) {
        setError('タイトルを入力してください')
        return
      }

      if (formData.roles.length === 0) {
        setError('役割を選択してください')
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
          contentType: formData.contentType,
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
      setError(error instanceof Error ? error.message : '更新に失敗しました。もう一度お試しください。')
    } finally {
      setIsSaving(false)
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {formData.contentType === 'article' ? '記事作品を編集' : 
                 formData.contentType === 'design' ? 'デザイン作品を編集' :
                 formData.contentType === 'photo' ? '写真作品を編集' :
                 formData.contentType === 'video' ? '動画作品を編集' :
                 formData.contentType === 'podcast' ? 'ポッドキャスト作品を編集' :
                 formData.contentType === 'event' ? 'イベント作品を編集' : '作品を編集'}
              </h1>
              <p className="text-gray-600">
                {formData.contentType === 'article' ? 'あなたの記事・ライティング作品を編集しましょう' :
                 formData.contentType === 'design' ? 'あなたのデザイン作品を編集しましょう' :
                 formData.contentType === 'photo' ? 'あなたの写真作品を編集しましょう' :
                 formData.contentType === 'video' ? 'あなたの動画・映像作品を編集しましょう' :
                 formData.contentType === 'podcast' ? 'あなたのポッドキャスト作品を編集しましょう' :
                 formData.contentType === 'event' ? 'あなたのイベント作品を編集しましょう' : 'あなたの作品を編集しましょう'}
              </p>
            </div>
          </div>

          {/* 2カラム構成 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 左カラム: 基本情報 */}
            <div className="space-y-6">
              {/* 作品名 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  作品名 <span className="text-red-500">*</span>
                </h2>
                <Input
                  placeholder="ここにタイトルが入ります"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="h-12"
                />
              </div>

              {/* 詳細 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">詳細</h2>
                <Textarea
                  placeholder="詳細説明を入力..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* 記事本文（記事タイプの場合のみ表示） */}
              {formData.contentType === 'article' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">記事本文</h2>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="useFullContent"
                        checked={useFullContent}
                        onChange={(e) => setUseFullContent(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="useFullContent" className="text-sm text-gray-700">
                        AI分析に本文を含める
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 text-sm">💡</span>
                      <div>
                        <p className="text-blue-800 text-sm font-medium">記事本文の活用について</p>
                        <p className="text-blue-700 text-xs leading-relaxed mt-1">
                          記事の本文をここに貼り付けることで、より詳細で正確なAI分析が可能になります。
                          文章構成、表現力、専門知識の活用度など、より深い観点から分析できます。
                          <br />
                          <strong>※ 著作権に配慮し、自分が執筆した記事のみ入力してください。</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <Textarea
                    placeholder="記事の本文をここに貼り付けてください（任意）&#10;&#10;より詳細なAI分析のために本文を入力すると、以下の分析が可能になります：&#10;• 文章構成と論理的な組み立ての評価&#10;• 専門用語の適切な使用度&#10;• 読者に分かりやすい表現の工夫&#10;• 情報の整理と伝達技術の分析"
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    className="min-h-[200px] resize-y"
                    disabled={!useFullContent}
                  />
                  
                  {articleContent && useFullContent && (
                    <div className="mt-2 text-sm text-gray-600">
                      文字数: {articleContent.length}文字
                      {articleContent.length > 3000 && (
                        <span className="text-amber-600 ml-2">
                          ※ 3,000文字以上の場合、分析時に一部省略されます
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 制作時期 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">制作時期</h2>
                <Input
                  type="date"
                  value={formData.productionDate}
                  onChange={(e) => handleInputChange('productionDate', e.target.value)}
                  className="h-12"
                />
              </div>

              {/* タグ */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">タグ</h2>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="タグを入力..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={addTag}
                    disabled={!newTag.trim()}
                    variant="outline"
                  >
                    追加
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* あなたの役割 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  あなたの役割は何でしたか？ <span className="text-red-500">*</span>
                </h2>
                <Input
                  placeholder="クレジットを書く"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="mb-3"
                />
                <div className="flex flex-wrap gap-2 mb-4">
                  {predefinedRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => addRole(role)}
                      disabled={formData.roles.includes(role)}
                      className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      {role} +
                    </button>
                  ))}
                  <button
                    onClick={addCustomRole}
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50"
                  >
                    ライター +
                  </button>
                </div>
                
                {formData.roles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.roles.map((role, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {role}
                        <button
                          onClick={() => removeRole(role)}
                          className="ml-2 text-blue-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 右カラム: AI分析 */}
            <div className="space-y-6">
              {/* AI分析セクション */}
              {(formData.description || articleContent) && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {formData.contentType === 'article' ? '記事AI分析エンジン' :
                           formData.contentType === 'design' ? 'デザインAI分析エンジン' :
                           formData.contentType === 'photo' ? '写真AI分析エンジン' :
                           formData.contentType === 'video' ? '動画AI分析エンジン' :
                           formData.contentType === 'podcast' ? 'ポッドキャストAI分析エンジン' :
                           formData.contentType === 'event' ? 'イベントAI分析エンジン' : 'AI分析エンジン'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {formData.contentType === 'article' ? '記事の専門性・文章力・読者への価値提供を多角的に分析' :
                           formData.contentType === 'design' ? 'デザインの美的センス・技術力・ブランド価値向上を多角的に分析' :
                           formData.contentType === 'photo' ? '写真の技術力・表現力・視覚的インパクトを多角的に分析' :
                           formData.contentType === 'video' ? '動画の演出力・技術力・視聴者エンゲージメントを多角的に分析' :
                           formData.contentType === 'podcast' ? 'ポッドキャストの企画力・音響技術・リスナー価値提供を多角的に分析' :
                           formData.contentType === 'event' ? 'イベントの企画力・運営力・参加者満足度を多角的に分析' : '作品の創造性・専門性・影響力を多角的に分析'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={analyzeWithAI}
                      disabled={isAnalyzing || (!formData.description && !articleContent)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 font-medium"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isAnalyzing ? '分析実行中...' : 'AI分析実行'}
                    </Button>
                  </div>
                  
                  {isAnalyzing && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <div>
                          <p className="text-purple-800 font-medium">高度AI分析を実行中...</p>
                          <p className="text-purple-600 text-sm">創造性・専門性・影響力の観点から詳細分析しています</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {analysisResult && (
                    <div className="space-y-6">
                      {/* 分析概要 */}
                      {analysisResult.summary && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-blue-600 text-lg">📊</span>
                            <h4 className="font-semibold text-blue-900">分析概要</h4>
                          </div>
                          <p className="text-blue-800 leading-relaxed">{analysisResult.summary}</p>
                        </div>
                      )}

                      {/* 分析結果 */}
                      {analysisResult.genre && analysisResult.genre.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">ジャンル</h3>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.genre?.map((genre, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.topic && analysisResult.topic.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">トピック</h3>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.topic?.map((topic, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.keyword && analysisResult.keyword.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">キーワード</h3>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.keyword?.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.sentiment && analysisResult.sentiment.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">感情分析</h3>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.sentiment?.map((sentiment, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                              >
                                {sentiment}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.style && analysisResult.style.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">文体</h3>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.style?.map((style, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                              >
                                {style}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.target && analysisResult.target.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">ターゲット読者</h3>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.target?.map((target, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {target}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 