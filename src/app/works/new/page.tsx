'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { AIAnalysisDetailModal } from '@/features/work/components/AIAnalysisDetailModal'
import { ArticleForm, DesignForm, DefaultContentForm } from '@/features/work/components/ContentTypeForm'
import { ShareSuccessToast } from '@/components/social/ShareModal'
import { shareToTwitter } from '@/utils/socialShare'
import { ArrowLeft, Link2, Sparkles, Plus, X, Upload } from 'lucide-react'

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
        setAnalysisResult(result.analysis)
        
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
    if (!formData.title.trim()) {
      alert('タイトルを入力してください')
      return
    }

    if (formData.roles.length === 0) {
      alert('役割を少なくとも1つ選択してください')
      return
    }

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
        title: formData.title,
        description: formData.description,
        external_url: formData.externalUrl,
        production_date: formData.productionDate ? new Date(formData.productionDate).toISOString().split('T')[0] : null,
        tags: formData.tags,
        roles: formData.roles,
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
          .from('ai_analysis_results')
          .insert({
            work_id: data.id,
            user_id: user.id,
            analysis_type: 'work_analysis',
            result_data: analysisResult
          })

        if (analysisError) {
          console.error('Analysis save error:', analysisError)
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

        {/* 2カラム構成 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
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

            {/* AI分析セクション */}
            {(formData.description || previewData?.description) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contentType === 'article' ? '記事AI分析エンジン' :
                         contentType === 'design' ? 'デザインAI分析エンジン' :
                         contentType === 'photo' ? '写真AI分析エンジン' :
                         contentType === 'video' ? '動画AI分析エンジン' :
                         contentType === 'podcast' ? 'ポッドキャストAI分析エンジン' :
                         contentType === 'event' ? 'イベントAI分析エンジン' : 'AI分析エンジン'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {contentType === 'article' ? '記事の専門性・文章力・読者への価値提供を多角的に分析' :
                         contentType === 'design' ? 'デザインの美的センス・技術力・ブランド価値向上を多角的に分析' :
                         contentType === 'photo' ? '写真の技術力・表現力・視覚的インパクトを多角的に分析' :
                         contentType === 'video' ? '動画の演出力・技術力・視聴者エンゲージメントを多角的に分析' :
                         contentType === 'podcast' ? 'ポッドキャストの企画力・音響技術・リスナー価値提供を多角的に分析' :
                         contentType === 'event' ? 'イベントの企画力・運営力・参加者満足度を多角的に分析' : '作品の創造性・専門性・影響力を多角的に分析'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={analyzeWithAI}
                    disabled={isAnalyzing || (!formData.description && !previewData?.description)}
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

                    {/* 3つの核心分析 */}
                    {analysisResult.strengths && (
                      <div className="grid grid-cols-1 gap-4">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">📈 詳細分析レポート</h4>
                        
                        {/* 創造性分析 */}
                        {analysisResult.strengths.creativity && analysisResult.strengths.creativity.length > 0 && (
                          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">創</span>
                              </div>
                              <div>
                                <h5 className="font-semibold text-pink-900">創造性分析</h5>
                                <p className="text-pink-700 text-sm">独創性・革新性・表現力</p>
                              </div>
                            </div>
                                                         <ul className="space-y-2">
                               {analysisResult.strengths.creativity.map((point: string, idx: number) => (
                                 <li key={idx} className="flex items-start gap-2 text-pink-800">
                                   <span className="text-pink-500 mt-1">•</span>
                                   <span className="text-sm leading-relaxed">{point}</span>
                                 </li>
                               ))}
                             </ul>
                          </div>
                        )}

                        {/* 専門性分析 */}
                        {analysisResult.strengths.expertise && analysisResult.strengths.expertise.length > 0 && (
                          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">専</span>
                              </div>
                              <div>
                                <h5 className="font-semibold text-emerald-900">専門性分析</h5>
                                <p className="text-emerald-700 text-sm">技術力・知識・スキル</p>
                              </div>
                            </div>
                                                         <ul className="space-y-2">
                               {analysisResult.strengths.expertise.map((point: string, idx: number) => (
                                 <li key={idx} className="flex items-start gap-2 text-emerald-800">
                                   <span className="text-emerald-500 mt-1">•</span>
                                   <span className="text-sm leading-relaxed">{point}</span>
                                 </li>
                               ))}
                             </ul>
                          </div>
                        )}

                        {/* 影響力分析 */}
                        {analysisResult.strengths.impact && analysisResult.strengths.impact.length > 0 && (
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">影</span>
                              </div>
                              <div>
                                <h5 className="font-semibold text-amber-900">影響力分析</h5>
                                <p className="text-amber-700 text-sm">訴求力・価値創出・インパクト</p>
                              </div>
                            </div>
                            <ul className="space-y-2">
                              {analysisResult.strengths.impact.map((point: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-amber-800">
                                  <span className="text-amber-500 mt-1">•</span>
                                  <span className="text-sm leading-relaxed">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* タグ・キーワード分析 */}
                    <div className="space-y-4">
                      {/* 推奨タグ */}
                      {analysisResult.tags && analysisResult.tags.length > 0 && (
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-indigo-600 text-xl">🏷️</span>
                              <div>
                                <h5 className="font-semibold text-indigo-900">AI推奨タグ</h5>
                                <p className="text-indigo-700 text-sm">
                                  {analysisResult.tags.length}個のタグが生成されました
                                </p>
                              </div>
                            </div>
                            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                              高精度分析
                            </div>
                          </div>
                          
                          {/* タグの分類表示（分類情報がある場合） */}
                          {analysisResult.tagClassification && (
                            <div className="space-y-3 mb-4">
                              {Object.entries(analysisResult.tagClassification).map(([category, tags]: [string, any]) => (
                                tags && tags.length > 0 && (
                                  <div key={category} className="bg-white/60 rounded-lg p-3">
                                    <h6 className="text-xs font-medium text-indigo-800 mb-2 uppercase tracking-wide">
                                      {category === 'genre' ? 'ジャンル・分野' :
                                       category === 'style' ? '文体・表現' :
                                       category === 'audience' ? '対象読者' :
                                       category === 'format' ? '記事形式' :
                                       category === 'purpose' ? '機能・価値' :
                                       category === 'technique' ? '技術・手法' :
                                       category === 'quality' ? '品質・レベル' :
                                       category === 'unique' ? '個別特徴' : category}
                                    </h6>
                                    <div className="flex flex-wrap gap-1">
                                      {tags.map((tag: string, idx: number) => (
                                        <span key={idx} className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )
                              ))}
                            </div>
                          )}
                          
                          {/* 全タグ一覧 */}
                          <div className="bg-white/60 rounded-lg p-3">
                            <h6 className="text-xs font-medium text-indigo-800 mb-2 uppercase tracking-wide">
                              全タグ一覧（自動追加対象）
                            </h6>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.tags.map((tag: string, idx: number) => (
                                <span key={idx} className="inline-flex items-center px-3 py-1 bg-indigo-200 text-indigo-900 rounded-full text-sm font-medium border border-indigo-300">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-indigo-100/50 rounded-lg">
                            <p className="text-indigo-800 text-xs leading-relaxed">
                              <strong>💡 活用方法:</strong> これらのタグは作品保存時に自動で追加され、プロフィール分析・ランキング・詳細レポートでのパターン分析に活用されます。
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* キーワード分析 */}
                      {analysisResult.keywords && analysisResult.keywords.length > 0 && (
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-violet-600 text-lg">🔍</span>
                            <h5 className="font-semibold text-violet-900">関連キーワード</h5>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.keywords.map((keyword: string, idx: number) => (
                             <span key={idx} className="inline-flex items-center px-2 py-1 bg-violet-100 text-violet-800 rounded text-xs">
                               {keyword}
                             </span>
                           ))}
                         </div>
                                                   <p className="text-violet-700 text-xs mt-2">※ 詳細レポートでパターン分析に活用されます</p>
                        </div>
                      )}
                    </div>

                    {/* データ活用予告 */}
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-slate-600 text-sm">🎯</span>
                        <h6 className="font-medium text-slate-800 text-sm">データ活用</h6>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        この分析データは、プロフィール画面での<strong>タグランキング</strong>や、詳細レポート画面での
                        <strong>創造性・専門性・影響力の傾向分析</strong>、<strong>成長パターン学習</strong>に活用されます。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 右カラム: 入力項目 */}
          <div className="space-y-6">
            {/* 作品名 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                作品名 <span className="text-red-500">*</span>
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

            {/* 制作メモ */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span>
                制作メモ
              </h2>
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 text-sm">💡</span>
                  <div>
                    <p className="text-amber-800 text-sm font-medium">制作メモについて</p>
                    <p className="text-amber-700 text-xs leading-relaxed mt-1">
                      制作過程、作品の背景、狙い、こだわりポイントなどを記録できます。
                      <br />
                      クライアントや閲覧者に制作意図を伝える際に活用されます。
                    </p>
                  </div>
                </div>
              </div>
              <Textarea
                placeholder="制作過程や背景、狙い、こだわりなどを記入してください...&#10;&#10;例：&#10;• この記事では○○の課題に焦点を当て、実体験を交えて解決策を提示しました&#10;• 読者が最後まで読み進められるよう、見出し構成に特に配慮しました&#10;• 専門用語は分かりやすい表現に置き換え、初心者でも理解できるよう工夫しました"
                value={formData.productionNotes}
                onChange={(e) => handleInputChange('productionNotes', e.target.value)}
                className="min-h-[150px] resize-y"
              />
              {formData.productionNotes && (
                <div className="mt-2 text-sm text-gray-600">
                  文字数: {formData.productionNotes.length}文字
                </div>
              )}
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

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => router.back()}>
                キャンセル
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.title.trim() || formData.roles.length === 0}
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                作品を追加
              </Button>
            </div>
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