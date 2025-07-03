'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { AIAnalysisResult } from '@/types/work'
import { WorkForm } from '../../new/page'

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

// AI評価セクションコンポーネント
function AIEvaluationSection({ aiAnalysis }: { aiAnalysis: AIAnalysisResult }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (item: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(item)) {
      newExpanded.delete(item)
    } else {
      newExpanded.add(item)
    }
    setExpandedItems(newExpanded)
  }

  // 新しい形式のスコアがあるかチェック
  const hasNewFormat = aiAnalysis.evaluation?.scores
  // 古い形式のスコアがあるかチェック  
  const hasLegacyFormat = aiAnalysis.legacyEvaluation?.scores

  // 新しい形式を優先的に表示
  if (hasNewFormat) {
    const scores = aiAnalysis.evaluation!.scores
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-lg font-bold text-blue-900">AI評価スコア</h4>
        </div>
        
        {/* 総合評価 */}
        {scores.overall && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-blue-100">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpanded('overall')}
            >
              <span className="font-semibold text-gray-800">総合評価</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {scores.overall.score}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  scores.overall.score >= 90 ? 'bg-purple-100 text-purple-700' :
                  scores.overall.score >= 80 ? 'bg-blue-100 text-blue-700' :
                  scores.overall.score >= 70 ? 'bg-green-100 text-green-700' :
                  scores.overall.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {scores.overall.score >= 90 ? 'エキスパート' :
                   scores.overall.score >= 80 ? '上級者' :
                   scores.overall.score >= 70 ? '中級者' :
                   scores.overall.score >= 60 ? '初級者' : 'ビギナー'}
                </span>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    expandedItems.has('overall') ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {expandedItems.has('overall') && (
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                {scores.overall.reason}
              </p>
            )}
          </div>
        )}

        {/* 個別評価項目 */}
        <div className="grid grid-cols-2 gap-3">
          {scores.technology && (
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('technology')}
              >
                <span className="text-sm font-medium text-gray-700">技術力</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-gray-700">
                    {scores.technology.score}
                  </span>
                  <svg 
                    className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedItems.has('technology') ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedItems.has('technology') && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {scores.technology.reason}
                </p>
              )}
            </div>
          )}

          {scores.expertise && (
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('expertise')}
              >
                <span className="text-sm font-medium text-gray-700">専門性</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-purple-600">
                    {scores.expertise.score}
                  </span>
                  <svg 
                    className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedItems.has('expertise') ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedItems.has('expertise') && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {scores.expertise.reason}
                </p>
              )}
            </div>
          )}

          {scores.creativity && (
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('creativity')}
              >
                <span className="text-sm font-medium text-gray-700">創造性</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-purple-600">
                    {scores.creativity.score}
                  </span>
                  <svg 
                    className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedItems.has('creativity') ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedItems.has('creativity') && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {scores.creativity.reason}
                </p>
              )}
            </div>
          )}

          {scores.impact && (
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('impact')}
              >
                <span className="text-sm font-medium text-gray-700">影響力</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-orange-600">
                    {scores.impact.score}
                  </span>
                  <svg 
                    className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedItems.has('impact') ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedItems.has('impact') && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {scores.impact.reason}
                </p>
              )}
            </div>
          )}
        </div>

        {/* スコア基準の説明 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <h5 className="text-sm font-medium text-blue-800 mb-2">評価基準</h5>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            <div><span className="font-medium">90-100点:</span> エキスパート（プロレベル）</div>
            <div><span className="font-medium">80-89点:</span> 上級者（高品質）</div>
            <div><span className="font-medium">70-79点:</span> 中級者（標準品質）</div>
            <div><span className="font-medium">60-69点:</span> 初級者（基本品質）</div>
          </div>
        </div>
      </div>
    )
  }

  // 古い形式の表示（後方互換性）
  if (hasLegacyFormat) {
    const scores = aiAnalysis.legacyEvaluation!.scores
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-lg font-bold text-blue-900">AI評価スコア</h4>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">レガシー形式</span>
        </div>
        
        {/* 古い形式の総合評価と個別項目の展開機能を実装 */}
        {/* 実装は新しい形式と同様に行う */}
        <div className="text-blue-700 text-sm">
          古い形式のAI評価データです。再分析を実行すると最新の詳細評価が利用できます。
        </div>
      </div>
    )
  }

  return null
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
    productionNotes: '',
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
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
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
          // データ構造を統一
          const workData = {
            ...data.work,
            externalUrl: data.work.external_url || data.work.externalUrl,
            productionDate: data.work.production_date || data.work.productionDate,
            previewData: data.work.previewData || data.work.preview_data,
          }
          
          setFormData({
            title: workData.title || '',
            description: workData.description || '',
            externalUrl: workData.externalUrl || '',
            productionDate: workData.productionDate || '',
            productionNotes: workData.production_notes || '',
            tags: workData.tags || [],
            roles: workData.roles || [],
            categories: workData.categories || [],
            contentType: workData.contentType || workData.content_type || ''
          })

          // プレビューデータを設定
          if (workData.previewData) {
            setPreviewData(workData.previewData)
          }

          // AI分析データを設定
          if (workData.ai_analysis_result) {
            setAnalysisResult(workData.ai_analysis_result)
          }

          // URLがある場合はプレビューを取得
          if (workData.externalUrl && !workData.previewData) {
            fetchLinkPreview(workData.externalUrl)
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
      console.log('送信データ:', {
        ...formData,
        contentType: formData.contentType,
        productionNotes: formData.productionNotes,
        previewData: previewData,
        aiAnalysisResult: analysisResult
      })

      const response = await fetch(`/api/works/${workId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...formData,
          contentType: formData.contentType,
          productionNotes: formData.productionNotes,
          previewData: previewData,
          aiAnalysisResult: analysisResult
        }),
      })

      console.log('レスポンス状態:', response.status, response.statusText)

      let data
      try {
        data = await response.json()
        console.log('レスポンスデータ:', data)
      } catch (parseError) {
        console.error('JSONパースエラー:', parseError)
        throw new Error(`サーバーエラー: ${response.status} ${response.statusText}`)
      }

      if (!response.ok) {
        console.error('APIエラー詳細:', data)
        
        // エラーの詳細情報を含めたメッセージを作成
        let errorMessage = data.error || data.message || `更新に失敗しました (${response.status})`
        
        if (data.details) {
          console.error('エラー詳細:', data.details)
          errorMessage += `\n詳細: ${data.details}`
        }
        
        if (data.code) {
          console.error('エラーコード:', data.code)
          errorMessage += `\nエラーコード: ${data.code}`
        }
        
        throw new Error(errorMessage)
      }

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

  // 新共通フォームを使用
  return (
    <ProtectedRoute>
      <WorkForm initialData={formData} />
    </ProtectedRoute>
  )
} 