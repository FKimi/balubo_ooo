'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { supabase } from '@/lib/supabase'
import { AIAnalysisDetailModal } from '@/features/work/components/AIAnalysisDetailModal'
import { ShareSuccessToast } from '@/features/social/components/ShareModal'
import { shareToTwitter } from '@/utils/socialShare'
import { ArrowLeft, Sparkles, X } from 'lucide-react'
import { AIAnalysisResult } from '@/types/work'

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

          {scores.impact && (
            <div className="p-3 bg-white rounded-lg border border-green-100">
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
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
          <h5 className="text-sm font-medium text-green-800 mb-2">評価基準</h5>
          <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
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
            {expandedItems.has('overall') && scores.overall.reason && (
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                {scores.overall.reason}
              </p>
            )}
          </div>
        )}

        {/* 古い形式の個別評価項目 */}
        <div className="grid grid-cols-2 gap-3">
          {scores.logic && (
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('logic')}
              >
                <span className="text-sm font-medium text-gray-700">論理性</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-blue-600">
                    {scores.logic.score}
                  </span>
                  <svg 
                    className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedItems.has('logic') ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedItems.has('logic') && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {scores.logic.reason || '論理的な構成や文章の組み立てが評価されています。'}
                </p>
              )}
            </div>
          )}

          {scores.practicality && (
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('practicality')}
              >
                <span className="text-sm font-medium text-gray-700">実用性</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-green-600">
                    {scores.practicality.score}
                  </span>
                  <svg 
                    className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedItems.has('practicality') ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedItems.has('practicality') && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {scores.practicality.reason || '実際の活用場面での価値や有用性が評価されています。'}
                </p>
              )}
            </div>
          )}

          {scores.readability && (
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('readability')}
              >
                <span className="text-sm font-medium text-gray-700">読みやすさ</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-purple-600">
                    {scores.readability.score}
                  </span>
                  <svg 
                    className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedItems.has('readability') ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedItems.has('readability') && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {scores.readability.reason || '文章の分かりやすさや読者にとっての理解しやすさが評価されています。'}
                </p>
              )}
            </div>
          )}

          {scores.originality && (
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('originality')}
              >
                <span className="text-sm font-medium text-gray-700">独自性</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-orange-600">
                    {scores.originality.score}
                  </span>
                  <svg 
                    className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedItems.has('originality') ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedItems.has('originality') && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {scores.originality.reason || 'オリジナリティや他にはない独特な視点・アプローチが評価されています。'}
                </p>
              )}
            </div>
          )}

          {scores.clarity && (
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('clarity')}
              >
                <span className="text-sm font-medium text-gray-700">明確性</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-indigo-600">
                    {scores.clarity.score}
                  </span>
                  <svg 
                    className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedItems.has('clarity') ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedItems.has('clarity') && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {scores.clarity.reason || 'メッセージや目的の明確さ、読者への伝達力が評価されています。'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* レガシー形式の説明 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <h5 className="text-sm font-medium text-blue-800 mb-2">レガシー評価形式について</h5>
          <p className="text-xs text-blue-700">
            この評価は旧形式で記録されたデータです。最新のAI分析を実行すると、より詳細な4軸評価（技術力、専門性、創造性、影響力）を受けることができます。
          </p>
        </div>
      </div>
    )
  }

  return null
}

function NewWorkForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URLパラメータからコンテンツタイプを取得
  const contentType = searchParams.get('type') || 'article' // デフォルトは記事
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    externalUrl: '',
    productionDate: '',
    productionNotes: '',
    tags: [] as string[],
    roles: [] as string[]
  })
  
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newRole, setNewRole] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAIAnalysisDetailOpen, setIsAIAnalysisDetailOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [articleContent, setArticleContent] = useState('')
  const [useFullContent, setUseFullContent] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const [savedWorkData, setSavedWorkData] = useState<any>(null)

  // 定義済みの役割
  const predefinedRoles = ['編集', '撮影', '企画', '取材', '執筆', 'デザイン']
  
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
      
      // 自動でフォームに反映
      if (data.title && !formData.title) {
        setFormData(prev => ({ ...prev, title: data.title }))
      }
      if (data.description && !formData.description) {
        setFormData(prev => ({ ...prev, description: data.description }))
      }

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
    if (url.trim()) {
      try {
        new URL(url.trim())
        fetchLinkPreview(url.trim())
      } catch {
        // 無効なURLの場合はプレビューをクリア
        setPreviewData(null)
        setPreviewError('')
      }
    } else {
      // 空の場合もプレビューをクリア
      setPreviewData(null)
      setPreviewError('')
    }
  }

  // ファイルアップロード処理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    const validFiles = files.filter(file => allowedTypes.includes(file.type))
    if (validFiles.length < files.length) {
      alert('PDFまたはテキストファイルのみアップロード可能です')
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles])
  }

  // ファイル削除
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
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

  const addCustomRole = () => {
    if (newRole.trim() && !formData.roles.includes(newRole.trim())) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, newRole.trim()]
      }))
      setNewRole('')
    }
  }

  // 役割入力でエンターキー処理
  const handleRoleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCustomRole()
    }
  }

  // 役割削除
  const removeRole = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role !== roleToRemove)
    }))
  }

  // AI分析
  const analyzeWithAI = async () => {
    if (!formData.description && !previewData?.description && !articleContent) {
      alert('分析するための説明文または記事本文を入力してください')
      return
    }

    setIsAnalyzing(true)
    try {
      const apiUrl = contentType === 'article' ? '/api/ai-analyze/article' : '/api/ai-analyze'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title || previewData?.title || '',
          description: formData.description || previewData?.description || '',
          url: formData.externalUrl || '',
          contentType: contentType,
          // 記事本文が入力されている場合は含める
          fullContent: useFullContent && articleContent ? articleContent : undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.analysis) {
        // AI分析結果と評価スコアの両方を設定
        const completeAnalysisResult = {
          ...result.analysis,
          evaluation: result.evaluation // 評価スコアを追加
        }
        
        setAnalysisResult(completeAnalysisResult)
        
        // 推奨タグを自動追加（重複は除外）
        if (result.analysis.tags && result.analysis.tags.length > 0) {
          const newTags = result.analysis.tags.filter((tag: string) => 
            !formData.tags.includes(tag)
          )
          if (newTags.length > 0) {
            setFormData(prev => ({
              ...prev,
              tags: [...prev.tags, ...newTags]
            }))
          }
        }
      } else {
        throw new Error('分析結果の取得に失敗しました')
      }
    } catch (error) {
      console.error('AI分析エラー:', error)
      alert(error instanceof Error ? error.message : 'AI分析に失敗しました')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // フォーム送信
  const handleSubmit = async () => {

    console.log('Submitting form data:', formData)
    
    try {
      // ファイルアップロード処理
      const fileUrls: string[] = []
      
      for (const file of uploadedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('work-files')
          .upload(fileName, file)
        
        if (uploadError) {
          console.error('File upload error:', uploadError)
          continue
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('work-files')
          .getPublicUrl(fileName)
        
        fileUrls.push(publicUrl)
      }

      // コンテンツタイプに応じたカテゴリ設定
      const getContentTypeCategory = (type: string) => {
        switch (type) {
          case 'article': return ["article"]
          case 'design': return ["design"]
          case 'photo': return ["photo"]
          case 'video': return ["video"]
          case 'podcast': return ["podcast"]
          case 'event': return ["event"]
          default: return ["article"]
        }
      }

      // 記事の文字数計算（記事タイプで本文が入力されている場合）
      const calculateArticleStats = () => {
        const isArticle = contentType === 'article'
        const hasContent = useFullContent && articleContent && articleContent.trim().length > 0
        const wordCount = hasContent ? articleContent.trim().length : 0
        
        return {
          article_word_count: isArticle ? wordCount : 0,
          article_has_content: isArticle ? hasContent : false
        }
      }

      const articleStats = calculateArticleStats()

      // 作品データの保存（データベース構造に合わせて最適化）
      const workData = {
        title: formData.title || '無題の作品',
        description: formData.description,
        external_url: formData.externalUrl,
        production_date: formData.productionDate ? new Date(formData.productionDate).toISOString().split('T')[0] : null,
        tags: formData.tags,
        roles: formData.roles.length > 0 ? formData.roles : [],
        categories: getContentTypeCategory(contentType),
        content_type: contentType,
        banner_image_url: previewData?.image || null,
        preview_data: previewData ? {
          title: previewData.title,
          description: previewData.description,
          image: previewData.image,
          siteName: previewData.siteName
        } : null,
        ai_analysis_result: analysisResult ? {
          ...analysisResult,
          analysis_metadata: {
            analysis_date: new Date().toISOString(),
            analysis_version: "v1.0",
            creativity_score: analysisResult.strengths?.creativity?.length || 0,
            expertise_score: analysisResult.strengths?.expertise?.length || 0,
            impact_score: analysisResult.strengths?.impact?.length || 0,
            total_tags: analysisResult.tags?.length || 0,
            total_keywords: analysisResult.keywords?.length || 0
          }
        } : null,
        // 文字数統計を追加
        ...articleStats
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('ログインが必要です')
        return
      }

      const { data, error } = await supabase
        .from('works')
        .insert({
          ...workData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        alert('作品の保存に失敗しました')
        return
      }

      console.log('Work saved successfully:', data)
      
      // 記事の場合、文字数も表示
      if (contentType === 'article' && articleStats.article_word_count > 0) {
        console.log(`記事文字数: ${articleStats.article_word_count}文字`)
      }

      // AI分析の保存（分析結果がある場合）
      if (analysisResult && data.id) {
        const { error: analysisError } = await supabase
          .from('works')
          .update({ ai_analysis_result: analysisResult })
          .eq('id', data.id)

        if (analysisError) {
          console.error('AI分析結果の保存エラー:', analysisError)
          console.error('エラー詳細:', {
            code: analysisError.code,
            message: analysisError.message,
            details: analysisError.details,
            hint: analysisError.hint
          })
        } else {
          console.log('AI分析結果を正常に保存しました')
        }
      }

      // 共有トーストを表示（保存したデータを設定）
      setSavedWorkData(data)
      setShowShareToast(true)

      // 3秒後にプロフィールページに遷移
      setTimeout(() => {
        router.push('/profile')
      }, 3000)

    } catch (error) {
      console.error('Submit error:', error)
      alert('エラーが発生しました')
    }
  }

  return (
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
              {contentType === 'article' ? '記事作品を追加' : 
               contentType === 'design' ? 'デザイン作品を追加' :
               contentType === 'photo' ? '写真作品を追加' :
               contentType === 'video' ? '動画作品を追加' :
               contentType === 'podcast' ? 'ポッドキャスト作品を追加' :
               contentType === 'event' ? 'イベント作品を追加' : '作品を追加'}
            </h1>
            <p className="text-gray-600">
              {contentType === 'article' ? 'あなたの記事・ライティング作品をポートフォリオに追加しましょう' :
               contentType === 'design' ? 'あなたのデザイン作品をポートフォリオに追加しましょう' :
               contentType === 'photo' ? 'あなたの写真作品をポートフォリオに追加しましょう' :
               contentType === 'video' ? 'あなたの動画・映像作品をポートフォリオに追加しましょう' :
               contentType === 'podcast' ? 'あなたのポッドキャスト作品をポートフォリオに追加しましょう' :
               contentType === 'event' ? 'あなたのイベント作品をポートフォリオに追加しましょう' : 'あなたの作品をポートフォリオに追加しましょう'}
            </p>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* 左カラム: URL入力とプレビュー */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {contentType === 'article' ? '記事のURL' :
                 contentType === 'design' ? 'デザインのURL' :
                 contentType === 'photo' ? '写真のURL' :
                 contentType === 'video' ? '動画のURL' :
                 contentType === 'podcast' ? 'ポッドキャストのURL' :
                 contentType === 'event' ? 'イベントのURL' : '作品のURL'}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                💡 {contentType === 'article' ? '記事のURLを入力すると、作品名・詳細・バナー画像を自動で取得します' :
                     contentType === 'design' ? 'デザインのURLを入力すると、作品名・詳細・バナー画像を自動で取得します' :
                     contentType === 'photo' ? '写真のURLを入力すると、作品名・詳細・バナー画像を自動で取得します' :
                     contentType === 'video' ? '動画のURLを入力すると、作品名・詳細・バナー画像を自動で取得します' :
                     contentType === 'podcast' ? 'ポッドキャストのURLを入力すると、作品名・詳細・バナー画像を自動で取得します' :
                     contentType === 'event' ? 'イベントのURLを入力すると、作品名・詳細・バナー画像を自動で取得します' : '作品のURLを入力すると、作品名・詳細・バナー画像を自動で取得します'}
              </p>
              
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="https://example.com/your-article"
                    value={formData.externalUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="h-12"
                  />
                </div>
                
                {isLoadingPreview && (
                  <div className="flex items-center text-gray-600">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    情報を取得中...
                  </div>
                )}
                
                {previewError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{previewError}</p>
                  </div>
                )}
                
                {previewData && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    {/* バナー画像 */}
                    {previewData.image && (
                      <div className="relative aspect-video bg-gray-100">
                        <Image
                          src={previewData.image}
                          alt={previewData.title}
                          fill
                          sizes="100vw"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* 作品情報 */}
                    <div className="p-4">
                      <div className="flex items-center text-green-600 mb-2">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">作品情報を取得しました</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{previewData.title}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">{previewData.description}</p>
                      
                      {previewData.siteName && (
                        <div className="flex items-center text-gray-500 text-xs">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          {previewData.siteName}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

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
          </div>

          {/* 右カラム: 入力項目 */}
          <div className="space-y-6">
            {/* 作品名 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                作品名
              </h2>
              <Input
                placeholder="ここにタイトルが入ります"
                value={formData.title || previewData?.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="h-12"
              />
            </div>

            {/* 詳細 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">詳細</h2>
              <Textarea
                placeholder={previewData?.description || "詳細説明を入力..."}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* 記事本文（記事タイプの場合のみ表示） */}
            {contentType === 'article' && (
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

            {/* あなたの役割 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                あなたの役割は何でしたか？
              </h2>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="クレジットを書く（例：ライター、編集者など）"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={handleRoleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={addCustomRole}
                  disabled={!newRole.trim()}
                  variant="outline"
                  className="px-4"
                >
                  追加
                </Button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">よく使われる役割：</p>
                <div className="flex flex-wrap gap-2">
                  {predefinedRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => addRole(role)}
                      disabled={formData.roles.includes(role)}
                      className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              
              {formData.roles.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">選択済みの役割：</p>
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI分析エンジン - フル幅で下部に配置 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          {/* ヘッダーセクション */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white">
                    {contentType === 'article' ? '記事AI分析エンジン' :
                     contentType === 'design' ? 'デザインAI分析エンジン' :
                     contentType === 'photo' ? '写真AI分析エンジン' :
                     contentType === 'video' ? '動画AI分析エンジン' :
                     contentType === 'podcast' ? 'ポッドキャストAI分析エンジン' :
                     contentType === 'event' ? 'イベントAI分析エンジン' : 'AI分析エンジン'}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1 leading-relaxed">
                    {contentType === 'article' ? '記事の専門性・文章力・読者への価値提供を多角的に分析' :
                     contentType === 'design' ? 'デザインの美的センス・技術力・ブランド価値向上を多角的に分析' :
                     contentType === 'photo' ? '写真の技術力・表現力・視覚的インパクトを多角的に分析' :
                     contentType === 'video' ? '動画の演出力・技術力・視聴者エンゲージメントを多角的に分析' :
                     contentType === 'podcast' ? 'ポッドキャストの企画力・音響技術・リスナー価値提供を多角的に分析' :
                     contentType === 'event' ? 'イベントの企画力・運営力・参加者満足度を多角的に分析' : '作品の創造性・専門性・影響力を多角的に分析'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-end gap-2">
                <Button 
                  onClick={analyzeWithAI}
                  disabled={isAnalyzing}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-8 py-3 font-medium min-w-[140px] whitespace-nowrap backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isAnalyzing ? '分析実行中...' : 'AI分析実行'}
                </Button>
                <p className="text-blue-100 text-sm text-center lg:text-right">
                  作品の強みと特徴を自動分析
                </p>
              </div>
            </div>
          </div>

          {/* コンテンツエリア */}
          <div className="p-6 lg:p-8">
            {/* AI分析の説明（分析結果がない場合のみ表示） */}
            {!analysisResult && !isAnalyzing && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-blue-900 mb-3">AI分析でできること</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-white/80 rounded-xl p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <div className="font-semibold text-blue-800">プロレベル評価</div>
                        </div>
                        <div className="text-blue-700 text-sm">技術力・専門性・創造性・影響力の4軸で100点満点評価</div>
                      </div>
                      <div className="bg-white/80 rounded-xl p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <div className="font-semibold text-blue-800">スマートタグ生成</div>
                        </div>
                        <div className="text-blue-700 text-sm">作品の特徴に合った最適なタグを自動提案</div>
                      </div>
                      <div className="bg-white/80 rounded-xl p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div className="font-semibold text-blue-800">詳細レポート</div>
                        </div>
                        <div className="text-blue-700 text-sm">作品の概要・強み・ターゲット層を詳細分析</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <p className="text-blue-900 font-bold text-lg">高度AI分析を実行中...</p>
                    <p className="text-blue-700">技術力・専門性・創造性・影響力の観点から詳細分析しています</p>
                  </div>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="grid grid-cols-1 gap-8">
                
                {/* 左カラム：概要・強み分析・AI推奨タグ */}
                <div className="space-y-6">
                  {/* 分析概要 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-blue-900">コンテンツ概要</h4>
                    </div>
                    <p className="text-blue-800 leading-relaxed">{analysisResult.summary}</p>
                  </div>

                  {/* AI評価スコア */}
                  {(analysisResult.evaluation?.scores || analysisResult.legacyEvaluation?.scores) && (
                    <AIEvaluationSection aiAnalysis={analysisResult} />
                  )}

                  {/* 強み分析 */}
                  {false && analysisResult.strengths && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h5 className="font-bold text-blue-900 mb-3">強み分析</h5>
                      <div className="space-y-3 text-sm text-blue-800">
                        {analysisResult.strengths.creativity && analysisResult.strengths.creativity.length > 0 && (
                          <div>
                            <div className="font-medium text-purple-700 mb-1">創造性</div>
                            <div className="text-purple-600">{analysisResult.strengths.creativity[0]}</div>
                          </div>
                        )}
                        {analysisResult.strengths.expertise && analysisResult.strengths.expertise.length > 0 && (
                          <div>
                            <div className="font-medium text-emerald-700 mb-1">専門性</div>
                            <div className="text-emerald-600">{analysisResult.strengths.expertise[0]}</div>
                          </div>
                        )}
                        {analysisResult.strengths.impact && analysisResult.strengths.impact.length > 0 && (
                          <div>
                            <div className="font-medium text-orange-700 mb-1">影響力</div>
                            <div className="text-orange-600">{analysisResult.strengths.impact[0]}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI推奨タグ */}
                  {false && analysisResult.tags && analysisResult.tags.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-bold text-blue-900 mb-3">AI推奨タグ</h5>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 右カラム：読者・ファン傾向分析 */}
                <div>
                  {/* 読者・ファン傾向分析 */}
                  {false && (analysisResult.detailedAnalysis?.targetAndPurpose || analysisResult.tagClassification) && (
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
                      <h5 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        この作品を好む人の傾向
                      </h5>
                      
                      <div className="space-y-3">
                        {/* ターゲット層分析 */}
                        {analysisResult.detailedAnalysis?.targetAndPurpose && (
                          <div className="bg-white/70 rounded-lg p-3">
                            <h6 className="font-semibold text-emerald-800 mb-2 text-sm">対象者・用途</h6>
                            <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded leading-relaxed">
                              {analysisResult.detailedAnalysis.targetAndPurpose}
                            </div>
                          </div>
                        )}

                        {/* ジャンル・専門分野タグ */}
                        {analysisResult.tagClassification?.genre && analysisResult.tagClassification.genre.length > 0 && (
                          <div className="bg-white/70 rounded-lg p-3">
                            <h6 className="font-semibold text-emerald-800 mb-2 text-sm">興味分野</h6>
                            <div className="flex flex-wrap gap-1.5">
                              {analysisResult.tagClassification.genre.map((genre: string, index: number) => (
                                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* 手動タグ追加セクション（AI分析結果の外側） */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="text-sm font-bold text-blue-900 mb-3">タグを追加</h5>
              
              {/* タグ入力エリア */}
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="タグを入力..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleTagKeyPress}
                  className="flex-1 h-8 text-sm bg-white"
                />
                <Button 
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 h-8 text-xs"
                >
                  追加
                </Button>
              </div>
              
              {/* 追加されたタグ表示 */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 作品を保存ボタン */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="px-8 py-3 text-lg"
            >
              キャンセル
            </Button>
            <Button 
              onClick={handleSubmit}
              className="px-12 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              作品を保存
            </Button>
          </div>
        </div>
      </div>

      {/* AI分析詳細モーダル */}
      <AIAnalysisDetailModal
        isOpen={isAIAnalysisDetailOpen}
        onClose={() => setIsAIAnalysisDetailOpen(false)}
        contentType="article"
      />

      {/* 共有トースト */}
      <ShareSuccessToast
        isOpen={showShareToast}
        onClose={() => setShowShareToast(false)}
        type="work"
        onShare={() => {
          if (savedWorkData) {
            shareToTwitter('work', savedWorkData)
            setShowShareToast(false)
            router.push('/profile')
          }
        }}
      />
    </div>
  )
}

export default function NewWorkPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <NewWorkForm />
        </Suspense>
      </div>
    </ProtectedRoute>
  )
} 