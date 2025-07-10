'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { AIAnalysisResult } from '@/types/work'
import NewWorkForm from '@/app/works/new/NewWorkForm'

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
          <div className="mb-4 p-3 bg-white rounded-lg border border-green-100">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpanded('overall')}
            >
              <span className="font-semibold text-gray-800">総合評価</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
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
            <div className="p-3 bg-white rounded-lg border border-green-100">
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
            <div className="p-3 bg-white rounded-lg border border-green-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('expertise')}
              >
                <span className="text-sm font-medium text-gray-700">専門性</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-blue-600">
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
            <div className="p-3 bg-white rounded-lg border border-green-100">
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
        </div>
      </div>
    )
  }

  // 古い形式のスコアを表示
  if (hasLegacyFormat) {
    const legacyScores = aiAnalysis.legacyEvaluation!.scores
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-lg font-bold text-blue-900">AI評価スコア</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(legacyScores).map(([key, value]) => (
            <div key={key} className="p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{key}</span>
                <span className="text-lg font-bold text-blue-600">{value}</span>
              </div>
            </div>
          ))}
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

  // New work form state
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
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [isAIAnalysisDetailOpen, setIsAIAnalysisDetailOpen] = useState(false)
  const [showShareSuccess, setShowShareSuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Form refs
  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)
  const productionDateRef = useRef<HTMLInputElement>(null)
  const productionNotesRef = useRef<HTMLTextAreaElement>(null)
  const newTagRef = useRef<HTMLInputElement>(null)
  const newRoleRef = useRef<HTMLInputElement>(null)
  const newCategoryRef = useRef<HTMLInputElement>(null)

  // Tag and role state
  const [newTag, setNewTag] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newCategory, setNewCategory] = useState('')

  // Predefined options
  const predefinedRoles = ['ライター', '編集者', 'ディレクター', 'デザイナー', 'カメラマン', 'プログラマー']
  const contentTypes = [
    { value: 'article', label: '記事' },
    { value: 'video', label: '動画' },
    { value: 'image', label: '画像' },
    { value: 'audio', label: '音声' },
    { value: 'other', label: 'その他' }
  ]

  // Auth headers helper
  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  }

  // Fetch work data
  const fetchWork = useCallback(async () => {
    if (!workId) return

    try {
      setIsLoading(true)
      setError(null)

      const headers = await getAuthHeaders()
      const response = await fetch(`/api/works/${workId}`, {
        headers
      })

      if (!response.ok) {
        throw new Error('作品の取得に失敗しました')
      }

      // 修正: レスポンスを { work } で受け取る
      const { work } = await response.json()

      // Check if user owns this work
      if (work.user_id !== user?.id) {
        setError('この作品を編集する権限がありません')
        return
      }

      setFormData({
        title: work.title || '',
        description: work.description || '',
        externalUrl: work.external_url || '',
        productionDate: work.production_date || '',
        productionNotes: work.production_notes || '',
        tags: work.tags || [],
        roles: work.roles || [],
        categories: work.categories || [],
        contentType: work.content_type || ''
      })

      // Set AI analysis result if exists
      if (work.ai_analysis_result) {
        setAnalysisResult(work.ai_analysis_result)
      }

      // Fetch link preview if external URL exists
      if (work.external_url) {
        await fetchLinkPreview(work.external_url)
      }

    } catch (error) {
      console.error('作品取得エラー:', error)
      setError('作品の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [workId, user?.id])

  useEffect(() => {
    fetchWork()
  }, [fetchWork])

  // Link preview functionality
  const fetchLinkPreview = async (url: string) => {
    if (!url.trim()) {
      setPreviewData(null)
      setPreviewError(null)
      return
    }

    try {
      setPreviewError(null)
      const response = await fetch('/api/link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        throw new Error('プレビューの取得に失敗しました')
      }

      const data = await response.json()
      setPreviewData(data)
    } catch (error) {
      console.error('リンクプレビューエラー:', error)
      setPreviewError('プレビューの取得に失敗しました')
      setPreviewData(null)
    }
  }

  // URL change handler
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData(prev => ({ ...prev, externalUrl: url }))
    
    // Debounce link preview fetch
    const timeoutId = setTimeout(() => {
      fetchLinkPreview(url)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }

  // Form data update handler
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Tag management
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Role management
  const addRole = (role: string) => {
    if (role && !formData.roles.includes(role)) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, role]
      }))
    }
  }

  const addCustomRole = () => {
    if (newRole.trim() && !formData.roles.includes(newRole.trim())) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, newRole.trim()]
      }))
      setNewRole('')
    }
  }

  const removeRole = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role !== roleToRemove)
    }))
  }

  // Category management
  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }))
      setNewCategory('')
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    }))
  }

  // AI Analysis
  const handleAIAnalysis = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('タイトルと説明を入力してください')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          contentType: formData.contentType || 'article'
        })
      })

      if (!response.ok) {
        throw new Error('AI分析に失敗しました')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('AI分析エラー:', error)
      alert('AI分析に失敗しました')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 作品データ取得後の初期値セット
  const initialData = {
    title: formData.title,
    description: formData.description,
    externalUrl: formData.externalUrl,
    productionDate: formData.productionDate,
    productionNotes: formData.productionNotes,
    tags: formData.tags,
    roles: formData.roles,
    // 必要に応じて他の項目も
  }

  // 保存処理（PUT更新）
  const handleUpdate = async (formData: any, analysisResult: any, previewData: any) => {
    try {
      const headers = await getAuthHeaders()
      const workData = {
        ...formData,
        ai_analysis_result: analysisResult,
        // 必要に応じてpreviewDataや他の項目も
      }
      const response = await fetch(`/api/works/${workId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(workData)
      })
      if (!response.ok) throw new Error('作品の更新に失敗しました')
      setShowShareSuccess(true)
      setTimeout(() => { router.push('/profile') }, 3000)
    } catch (error) {
      alert('作品の更新に失敗しました')
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">認証が必要です</h2>
            <p className="text-gray-600">作品を編集するにはログインが必要です。</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <NewWorkForm
            initialData={initialData}
            mode="edit"
            onSubmit={handleUpdate}
          />
        </div>
      </div>
    </ProtectedRoute>
  )
} 