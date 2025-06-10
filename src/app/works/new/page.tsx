'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { AIAnalysisDetailModal } from '@/components/works/AIAnalysisDetailModal'
import { ArticleForm, DesignForm, DefaultContentForm } from '@/components/works/ContentTypeForm'

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

export default function NewWorkPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    externalUrl: '',
    productionDate: '',
    tags: [] as string[],
    roles: [] as string[],
    categories: [] as string[],
    contentType: '' as string,
    // 記事専用フィールド
    wordCount: '',
    targetAudience: '',
    // デザイン専用フィールド
    tools: '',
    duration: ''
  })
  
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAIAnalysisDetailOpen, setIsAIAnalysisDetailOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

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

  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam && contentTypes.some(ct => ct.id === typeParam)) {
      setFormData(prev => ({
        ...prev,
        contentType: typeParam
      }))
    }
  }, [searchParams, contentTypes])
  
  // URLプレビューを取得する関数
  const fetchLinkPreview = async (url: string) => {
    if (!url.trim()) return

    console.log('Fetching link preview for:', url)
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

      console.log('Link preview received:', {
        hasImage: !!data.image,
        imageUrl: data.image,
        title: data.title,
        description: data.description,
        siteName: data.siteName
      })

      setPreviewData(data)
      
      // 自動でフォームに反映
      if (data.title && !formData.title) {
        console.log('Auto-filling title:', data.title)
        setFormData(prev => ({ ...prev, title: data.title }))
      }
      if (data.description && !formData.description) {
        console.log('Auto-filling description:', data.description)
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
        console.log('Valid URL detected, fetching preview...')
        fetchLinkPreview(url.trim())
      } catch {
        // 無効なURLの場合はプレビューをクリア
        console.log('Invalid URL, clearing preview')
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

  // AI分析実行
  const analyzeWithAI = async () => {
    if (!formData.description && !previewData?.description) {
      alert('説明文を入力するか、URLから情報を取得してください')
      return
    }

    setIsAnalyzing(true)
    try {
      const analysisText = formData.description || previewData?.description || ''
      const response = await fetch('/api/works/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title || previewData?.title || '',
          description: analysisText,
          contentType: formData.contentType,
        }),
      })

      if (!response.ok) {
        throw new Error('AI分析に失敗しました')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('AI analysis error:', error)
      alert('AI分析中にエラーが発生しました')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 作品保存
  const handleSubmit = async () => {
    if (!formData.title) {
      alert('タイトルは必須です')
      return
    }

    // 保存処理の実装
    try {
      console.log('Saving work with data:', formData)
      // ここで実際の保存処理を行う
      
      router.push('/works')
    } catch (error) {
      console.error('Save error:', error)
      alert('保存中にエラーが発生しました')
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Header />
        
        {/* メインコンテンツ */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          
          {/* ヘッダーセクション - LinkedIn風 */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">新しい作品を追加</h1>
                    <p className="text-gray-600 text-sm mt-1">ポートフォリオに新しい作品を簡単に追加できます</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 text-sm font-medium">準備完了</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 左側：メイン入力エリア（2/3幅） */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* URL入力 - 最優先 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">作品URL</h2>
                      <p className="text-sm text-gray-600">URLを入力すると自動で情報を取得します</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="relative">
                    <Input
                      type="url"
                      placeholder="https://example.com/your-work"
                      value={formData.externalUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="h-14 text-base bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl pl-12"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {isLoadingPreview && (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {previewData && !isLoadingPreview && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {previewError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{previewError}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 自動取得プレビュー */}
              {previewData && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-top-5 duration-300">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-800">情報を自動取得しました</h3>
                          <p className="text-sm text-green-600">フォームに反映してください</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (previewData.title && !formData.title) {
                            setFormData(prev => ({ ...prev, title: previewData.title }))
                          }
                          if (previewData.description && !formData.description) {
                            setFormData(prev => ({ ...prev, description: previewData.description }))
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                      >
                        フォームに反映
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 text-lg mb-2">{previewData.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{previewData.description}</p>
                  </div>
                </div>
              )}

              {/* 基本情報グループ */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">基本情報</h2>
                  <p className="text-sm text-gray-600 mt-1">作品の基本的な情報を入力してください</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* タイトル */}
                  <div>
                    <Label htmlFor="title" className="text-base font-medium text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      タイトル <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="作品のタイトルを入力してください"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="h-12 text-base bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg"
                    />
                  </div>

                  {/* 説明文 */}
                  <div>
                    <Label htmlFor="description" className="text-base font-medium text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      説明文
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="この作品について詳しく説明してください..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="min-h-[120px] bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg resize-none"
                    />
                  </div>

                  {/* 制作時期 */}
                  <div>
                    <Label htmlFor="productionDate" className="text-base font-medium text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      制作時期
                    </Label>
                    <Input
                      id="productionDate"
                      type="month"
                      value={formData.productionDate}
                      onChange={(e) => handleInputChange('productionDate', e.target.value)}
                      className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* ファイルアップロード */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">追加資料</h2>
                  <p className="text-sm text-gray-600 mt-1">より詳細なAI分析のためのファイル（オプション）</p>
                </div>
                
                <div className="p-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 hover:bg-blue-50/20 transition-all duration-200">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-base font-medium text-gray-700 mb-1">ファイルをドラッグ&ドロップ</p>
                        <p className="text-sm text-gray-500">PDF、Word、テキストファイル対応</p>
                      </div>
                    </label>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h4 className="font-medium text-gray-900 text-sm">アップロード済みファイル</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                              <p className="text-xs text-gray-500">{Math.round(file.size / 1024)}KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 右側：AI分析・タグ管理（1/3幅） */}
            <div className="space-y-6">
              
              {/* AI分析セクション */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">AI分析</h3>
                      <p className="text-purple-100 text-sm">スマート分析でタグ提案</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <Button
                    onClick={analyzeWithAI}
                    disabled={isAnalyzing || (!formData.description && !previewData?.description)}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>分析中...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>AI分析を開始</span>
                      </div>
                    )}
                  </Button>
                  
                  {analysisResult ? (
                    <div className="mt-6 space-y-4">
                      {analysisResult.tags && analysisResult.tags.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            推奨タグ
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.tags.slice(0, 6).map((tag: string, index: number) => (
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
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                  formData.tags.includes(tag)
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200 cursor-default'
                                    : 'bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-300 cursor-pointer'
                                }`}
                                disabled={formData.tags.includes(tag)}
                              >
                                {formData.tags.includes(tag) ? '✓ ' : '+ '}{tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {analysisResult.summary && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            要約
                          </h4>
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                            <p className="text-sm text-gray-700 leading-relaxed">{analysisResult.summary}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-6 text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">AIが作品を分析します</p>
                      <p className="text-xs text-gray-500 mt-1">URLまたは説明文を入力してください</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 選択されたタグ表示 */}
              {formData.tags.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      選択中のタグ
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{formData.tags.length}個のタグが選択されています</p>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 rounded-lg text-sm font-medium"
                        >
                          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 w-4 h-4 flex items-center justify-center text-blue-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* アクションバー */}
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-slate-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">作品の準備が完了しました</p>
                    <p className="text-sm text-gray-600">ポートフォリオに追加する準備ができています</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/works">
                    <Button variant="outline" className="px-6 h-12 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                      キャンセル
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleSubmit}
                    className="px-8 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={!formData.title}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    作品を保存
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI分析詳細モーダル */}
        {analysisResult && (
          <AIAnalysisDetailModal
            isOpen={isAIAnalysisDetailOpen}
            onClose={() => setIsAIAnalysisDetailOpen(false)}
            contentType={formData.contentType}
          />
        )}
      </div>
    </ProtectedRoute>
  )
} 