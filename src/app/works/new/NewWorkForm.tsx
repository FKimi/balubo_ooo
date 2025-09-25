'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AIAnalysisDetailModal } from '@/features/work/components/AIAnalysisDetailModal'
import { ShareModal } from '@/features/social/components/ShareModal'
import { EnhancedAnalysisProgress } from '@/components/works/EnhancedAnalysisProgress'
import { BtoBAnalysisSection } from '@/components/works/BtoBAnalysisSection'
import { ArrowLeft, Sparkles, X } from 'lucide-react'
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

// AI評価セクションコンポーネント - 削除済み

interface WorkFormProps {
  initialData?: {
    title?: string
    description?: string
    externalUrl?: string
    productionDate?: string
    productionNotes?: string
    tags?: string[]
    roles?: string[]
    // デザイン用フィールド
    designTools?: string[]
    colorPalette?: string[]
    targetPlatform?: string[]
  },
  mode?: 'create' | 'edit',
  workId?: string, // 編集モード時の作品ID
  // eslint-disable-next-line unused-imports/no-unused-vars
  onSubmit?: (formData: any, analysisResult: any, previewData: any) => Promise<void>
}

function NewWorkForm({ initialData, mode, workId, onSubmit }: WorkFormProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URLパラメータからコンテンツタイプを取得
  const contentType = searchParams.get('type') || 'article' // デフォルトは記事
  
  // 削除機能の状態管理
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    externalUrl: initialData?.externalUrl ?? '',
    productionDate: initialData?.productionDate ?? '',
    productionNotes: initialData?.productionNotes ?? '',
    tags: initialData?.tags ?? ([] as string[]),
    roles: initialData?.roles ?? ([] as string[]),
    // デザイン用フィールド
    designTools: initialData?.designTools ?? ([] as string[])
  })
  
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newRole, setNewRole] = useState('')
  // デザイン用の状態変数
  const [newDesignTool, setNewDesignTool] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isActive: boolean
    message: string
    retryAfter?: number
  } | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAIAnalysisDetailOpen, setIsAIAnalysisDetailOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [_uploadProgress, _setUploadProgress] = useState<{ [key: string]: number }>({})
  const [_uploadedFileUrls, _setUploadedFileUrls] = useState<string[]>([])
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null)
  const [articleContent, setArticleContent] = useState('')
  const [useFullContent, setUseFullContent] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [savedWorkData, setSavedWorkData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('description')
  const [userDisplayName, setUserDisplayName] = useState<string>('')

  // 定義済みの役割（コンテンツタイプ別）
  const getPredefinedRoles = (type: string) => {
    switch (type) {
      case 'design':
        return ['UI/UXデザイン', 'グラフィックデザイン', 'ロゴデザイン', 'Webデザイン', 'アプリデザイン', 'ブランディング', 'イラスト', 'アニメーション']
      case 'photo':
        return ['撮影', '編集', 'レタッチ', 'カラーグレーディング', '構図設計', 'ライティング', 'スタイリング']
      case 'video':
        return ['撮影', '編集', 'カラーグレーディング', 'モーショングラフィックス', '音響', 'ライティング', '演出']
      case 'podcast':
        return ['企画', '構成', '収録', '編集', '音響', 'ナレーション', 'インタビュー']
      case 'event':
        return ['企画', '運営', '司会', '演出', '音響', '照明', '会場設営']
      case 'article':
      default:
        return ['編集', '撮影', '企画', '取材', '執筆', 'デザイン']
    }
  }

  const predefinedRoles = getPredefinedRoles(contentType)
  
  // デザイン用の選択肢
  const designToolOptions = [
    'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe XD', 'Sketch', 
    'InVision', 'Principle', 'Framer', 'Canva', 'Procreate', 'Affinity Designer',
    'Blender', 'Cinema 4D', 'After Effects', 'Premiere Pro'
  ]
  
  const _platformOptions = [
    'Web', 'iOS', 'Android', 'Desktop', 'Tablet', 'Print', 'Social Media',
    'Email', 'Presentation', 'Branding'
  ]
  
  // URLプレビューを取得する関数
  const fetchLinkPreview = async (url: string) => {
    if (!url.trim()) return

    console.log('Fetching link preview for URL:', url)
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

      console.log('Link preview response status:', response.status)

      const data = await response.json()
      console.log('Link preview response data:', data)

      if (!response.ok) {
        // APIキーが設定されていない場合（503エラー）は、基本的なURL情報のみ表示
        if (response.status === 503) {
          const basicPreview = {
            title: url.split('/').pop() || url,
            description: 'リンクプレビュー機能は現在利用できません',
            url: url,
            image: '',
            siteName: new URL(url).hostname,
            // その他のフィールドは空文字列で初期化
            imageWidth: 0,
            imageHeight: 0,
            imageSize: 0,
            imageType: '',
            icon: '',
            iconWidth: 0,
            iconHeight: 0,
            iconSize: 0,
            iconType: '',
            locale: ''
          }
          setPreviewData(basicPreview)
          return
        }
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
      let errorMessage = 'プレビューの取得に失敗しました'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message)
      }
      
      setPreviewError(errorMessage)
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
  const handleFileUpload = (files: FileList | File[]) => {
    if (uploadedFiles.length >= 1) {
      alert('すでにファイルがアップロードされています。削除してから再度アップロードしてください。')
      return
    }

    const file = files[0]
    if (!file) return

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name}のサイズが10MBを超えています`)
      return
    }

    // AI分析用のサイズ制限（5MB）を警告
    if (file.type.startsWith('image/') && file.size > 5 * 1024 * 1024) {
      const confirmed = confirm(`${file.name}のサイズが5MBを超えています。AI分析では画像の内容が含まれませんが、アップロードを続行しますか？`)
      if (!confirmed) {
        return
      }
    }

    // ファイル形式チェック
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/psd', 'application/ai',
      'image/tiff', 'image/bmp', 'image/svg+xml'
    ]
    if (!allowedTypes.includes(file.type)) {
      alert(`${file.name}のファイル形式がサポートされていません`)
      return
    }

    setUploadedFiles([file])
  }

  // ファイル削除
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    _setUploadedFileUrls(prev => prev.filter((_, i) => i !== index))
  }

  // ドラッグ&ドロップ処理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (uploadedFiles.length >= 1) return
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
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

  // 削除処理
  const handleDelete = async () => {
    if (!workId) return

    try {
      setIsDeleting(true)
      
      // 認証トークンを取得
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/works/${workId}`, {
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        throw new Error('作品の削除に失敗しました')
      }

      // 削除成功後、プロフィールページにリダイレクト
      window.location.href = '/profile'
    } catch (error) {
      console.error('作品削除エラー:', error)
      alert('作品の削除に失敗しました')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  // 役割削除
  const removeRole = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role !== roleToRemove)
    }))
  }

  // デザインツール管理
  const addDesignTool = (tool: string) => {
    if (tool && !formData.designTools.includes(tool)) {
      setFormData(prev => ({
        ...prev,
        designTools: [...prev.designTools, tool]
      }))
    }
  }

  const addCustomDesignTool = () => {
    if (newDesignTool.trim() && !formData.designTools.includes(newDesignTool.trim())) {
      setFormData(prev => ({
        ...prev,
        designTools: [...prev.designTools, newDesignTool.trim()]
      }))
      setNewDesignTool('')
    }
  }

  const removeDesignTool = (toolToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      designTools: prev.designTools.filter(tool => tool !== toolToRemove)
    }))
  }

  // クールダウン開始
  const startCooldown = (seconds: number) => {
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current)
      cooldownTimerRef.current = null
    }

    setIsCooldown(true)
    setCooldownRemaining(seconds)

    cooldownTimerRef.current = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) {
            clearInterval(cooldownTimerRef.current)
            cooldownTimerRef.current = null
          }
          setIsCooldown(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // アンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current)
        cooldownTimerRef.current = null
      }
    }
  }, [])

  // AI分析
  const analyzeWithAI = async () => {
    if (isAnalyzing || isCooldown) return
    // デザイン作品の場合は、ファイルがアップロードされていれば分析可能
    const hasContent = formData.description || previewData?.description || articleContent || uploadedFiles.length > 0
    
    if (!hasContent) {
      alert('分析するための説明文、記事本文、またはファイルを入力してください')
      return
    }

    setIsAnalyzing(true)
    try {
      // コンテンツタイプに応じて適切なAPIを呼び出し
      const apiUrl = '/api/ai-analyze'
      
      // デザイン作品の場合、アップロードされたファイルの情報も含める
      const requestBody: any = {
          title: formData.title || previewData?.title || '',
          description: formData.description || previewData?.description || '',
          url: formData.externalUrl || '',
          contentType: contentType,
          fullContent: articleContent || undefined,
        productionNotes: formData.productionNotes,
        // デザイン用フィールド
        designTools: formData.designTools
      }

      // デザイン作品でファイルがアップロードされている場合、ファイル情報と内容を追加
      if ((contentType === 'design' || contentType === 'photo') && uploadedFiles.length > 0) {
        // ファイルのメタデータ
        requestBody.uploadedFiles = uploadedFiles.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        }))
        requestBody.fileCount = uploadedFiles.length

        // 画像ファイルの内容をBase64エンコードして追加（厳格なサイズ制限付き）
        const imageFiles = uploadedFiles.filter(file => file.type.startsWith('image/'))
        if (imageFiles.length > 0) {
          const imageDataPromises = imageFiles.map(async (file) => {
            return new Promise<{name: string, data: string, size: number, type: string}>((resolve) => {
              // ファイルサイズを1MBに制限（トークン数削減のため）
              const maxSize = 1 * 1024 * 1024 // 1MB
              
              if (file.size > maxSize) {
                console.warn(`画像ファイル ${file.name} が大きすぎます (${(file.size / 1024 / 1024).toFixed(1)}MB)。メタデータのみ送信します。`)
                resolve({
                  name: file.name,
                  data: `[ファイルサイズが大きすぎるため、内容は送信されませんでした。サイズ: ${(file.size / 1024 / 1024).toFixed(1)}MB、形式: ${file.type}]`,
                  size: file.size,
                  type: file.type
                })
                return
              }

              const reader = new FileReader()
              reader.onload = () => {
                const base64Data = reader.result as string
                // Base64データのサイズをチェック（約100KBに制限）
                const estimatedTokens = Math.ceil(base64Data.length / 4) // 概算トークン数
                const maxTokens = 100000 // 約100KB相当
                
                if (estimatedTokens > maxTokens) {
                  console.warn(`画像ファイル ${file.name} のトークン数が多すぎます (推定: ${estimatedTokens})。メタデータのみ送信します。`)
                  resolve({
                    name: file.name,
                    data: `[トークン数が多すぎるため、内容は送信されませんでした。推定トークン数: ${estimatedTokens}]`,
                    size: file.size,
                    type: file.type
                  })
                  return
                }
                
                resolve({
                  name: file.name,
                  data: base64Data,
                  size: file.size,
                  type: file.type
                })
              }
              reader.onerror = () => {
                console.error(`画像ファイル ${file.name} の読み込みに失敗しました`)
                resolve({
                  name: file.name,
                  data: `[ファイル読み込みエラー]`,
                  size: file.size,
                  type: file.type
                })
              }
              reader.readAsDataURL(file)
            })
          })

          const imageData = await Promise.all(imageDataPromises)
          requestBody.imageFiles = imageData
        }
      }
      
      console.log('AI分析リクエスト送信:', {
        url: apiUrl,
        contentType: contentType,
        hasDescription: !!requestBody.description,
        hasTitle: !!requestBody.title,
        hasUrl: !!requestBody.url,
        hasFullContent: !!requestBody.fullContent,
        hasUploadedFiles: !!requestBody.uploadedFiles,
        fileCount: requestBody.fileCount,
        hasImageFiles: !!requestBody.imageFiles,
        imageFileCount: requestBody.imageFiles ? requestBody.imageFiles.length : 0,
        requestBody: {
          ...requestBody,
          // 大きなデータは省略
          imageFiles: requestBody.imageFiles ? `${requestBody.imageFiles.length}個の画像ファイル` : undefined
        }
      })

      // テスト用: まずテストエンドポイントでAPIの動作を確認
      try {
        console.log('=== テストAPI呼び出し開始 ===')
        console.log('リクエストボディ:', requestBody)
        console.log('リクエストボディ型:', typeof requestBody)
        console.log('リクエストボディキー:', Object.keys(requestBody))
        
        const testResponse = await fetch('/api/ai-analyze/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
        
        console.log('=== テストAPIレスポンス ===')
        console.log('ステータス:', testResponse.status)
        console.log('ステータステキスト:', testResponse.statusText)
        console.log('OK:', testResponse.ok)
        console.log('ヘッダー:', Object.fromEntries(testResponse.headers.entries()))
        console.log('==========================')
        
        if (testResponse.ok) {
          const testResult = await testResponse.json()
          console.log('=== テストAPI結果 ===')
          console.log('結果:', testResult)
          console.log('結果型:', typeof testResult)
          console.log('結果キー:', testResult ? Object.keys(testResult) : 'null/undefined')
          console.log('====================')
        } else {
          const testErrorText = await testResponse.text()
          console.warn('=== テストAPIエラー ===')
          console.warn('ステータス:', testResponse.status)
          console.warn('ステータステキスト:', testResponse.statusText)
          console.warn('エラーテキスト:', testErrorText)
          console.warn('====================')
        }
      } catch (testError) {
        console.warn('=== テストAPI呼び出し失敗 ===')
        console.warn('エラー:', testError)
        console.warn('エラー型:', typeof testError)
        console.warn('=======================')
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      // レスポンスボディを一度だけ読み取る
      let result
      let responseText = ''
      try {
        responseText = await response.text()
        console.log('=== APIレスポンス生データ ===')
        console.log('レスポンステキスト:', responseText)
        console.log('レスポンステキスト長:', responseText.length)
        console.log('レスポンステキスト型:', typeof responseText)
        console.log('============================')
        
        if (!responseText.trim()) {
          throw new Error('APIから空のレスポンスが返されました')
        }
        
        result = JSON.parse(responseText)
        console.log('=== JSONパース成功 ===')
        console.log('パース結果:', result)
        console.log('パース結果型:', typeof result)
        console.log('パース結果キー:', result ? Object.keys(result) : 'null/undefined')
        console.log('=====================')
      } catch (parseError) {
        console.error('=== JSONパースエラー ===')
        console.error('パースエラー:', parseError)
        console.error('パースエラー型:', typeof parseError)
        console.error('レスポンスステータス:', response.status, response.statusText)
        console.error('レスポンステキスト:', responseText)
        console.error('======================')
        throw new Error(`AI分析結果の解析に失敗しました: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
      }

      if (!response.ok) {
        console.error('=== AI分析APIエラー詳細 ===')
        console.error('ステータス:', response.status)
        console.error('ステータステキスト:', response.statusText)
        console.error('URL:', apiUrl)
        console.error('コンテンツタイプ:', contentType)
        console.error('レスポンスヘッダー:', Object.fromEntries(response.headers.entries()))
        console.error('エラーデータ:', result)
        console.error('エラーデータ型:', typeof result)
        console.error('エラーデータキー:', result ? Object.keys(result) : 'null/undefined')
        if (result && typeof result === 'object') {
          Object.keys(result).forEach(key => {
            console.error(`エラーデータ.${key}:`, result[key])
            console.error(`エラーデータ.${key}型:`, typeof result[key])
          })
        }
        console.error('リクエストデータ:', {
          hasDescription: !!requestBody.description,
          hasTitle: !!requestBody.title,
          hasUrl: !!requestBody.url,
          hasFullContent: !!requestBody.fullContent,
          hasUploadedFiles: !!requestBody.uploadedFiles,
          fileCount: requestBody.fileCount,
          hasImageFiles: !!requestBody.imageFiles,
          imageFileCount: requestBody.imageFiles ? requestBody.imageFiles.length : 0
        })
        console.error('========================')
        // エラーメッセージの適切な処理
        console.log('=== エラー処理詳細 ===')
        console.log('result:', result)
        console.log('result型:', typeof result)
        console.log('resultキー:', result ? Object.keys(result) : 'null/undefined')
        console.log('hasError:', !!result?.error)
        console.log('error:', result?.error)
        console.log('error型:', typeof result?.error)
        console.log('errorキー:', result?.error ? Object.keys(result.error) : 'null/undefined')
        console.log('hasMessage:', !!result?.message)
        console.log('message:', result?.message)
        console.log('message型:', typeof result?.message)
        console.log('========================')
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        if (result && typeof result === 'object') {
          if (typeof result.error === 'string') {
            errorMessage = result.error
          } else if (result.error && typeof result.error === 'object') {
            // オブジェクトの場合は、messageプロパティを探すか、安全にJSON化
            if (result.error.message && typeof result.error.message === 'string') {
              errorMessage = result.error.message
            } else {
              try {
                errorMessage = JSON.stringify(result.error, null, 2)
              } catch (stringifyError) {
                errorMessage = 'エラーオブジェクトの解析に失敗しました'
              }
            }
          } else if (result.message && typeof result.message === 'string') {
            errorMessage = result.message
          }
        }
        
        console.log('最終エラーメッセージ:', errorMessage)
        throw new Error(errorMessage)
      }
      
      if (result.success && result.analysis) {
        // レート制限情報をリセット
        setRateLimitInfo(null)
        
        // AI分析結果と評価スコアの両方を設定
        const completeAnalysisResult = {
          ...result.analysis,
          evaluation: result.evaluation // 評価スコアを追加
        }
        
        setAnalysisResult(completeAnalysisResult)
        console.log('AI分析結果:', completeAnalysisResult)
        console.log('btobAnalysis:', completeAnalysisResult.btobAnalysis)
        
        // 作品名と概要の自動生成（デザイン作品でファイルがアップロードされている場合）
        if ((contentType === 'design' || contentType === 'photo') && uploadedFiles.length > 0 && result.analysis) {
          let titleGenerated = false
          let descriptionGenerated = false
          
          // 作品名の自動生成
          if (!formData.title || formData.title.trim() === '') {
            const suggestedTitle = result.analysis.summary || result.analysis.oneLinerSummary || 'デザイン作品'
            setFormData(prev => ({
              ...prev,
              title: suggestedTitle
            }))
            titleGenerated = true
          }
          
          // 作品概要の自動生成
          if (!formData.description || formData.description.trim() === '') {
            let suggestedDescription = ''
            
            // 詳細分析から概要を生成
            if (result.analysis.detailedAnalysis) {
              const analysis = result.analysis.detailedAnalysis
              const parts = []
              
              if (analysis.genreClassification) {
                parts.push(analysis.genreClassification)
              }
              if (analysis.styleCharacteristics) {
                parts.push(analysis.styleCharacteristics)
              }
              if (analysis.uniqueValueProposition) {
                parts.push(analysis.uniqueValueProposition)
              }
              
              if (parts.length > 0) {
                suggestedDescription = parts.join('。') + '。'
              }
            }
            
            // 詳細分析がない場合は、summaryやcontentTypeAnalysisを使用
            if (!suggestedDescription) {
              suggestedDescription = result.analysis.contentTypeAnalysis || result.analysis.summary || 'デザイン作品です。'
            }
            
            // 概要が長すぎる場合は短縮
            if (suggestedDescription.length > 200) {
              suggestedDescription = suggestedDescription.substring(0, 200) + '...'
            }
            
            setFormData(prev => ({
              ...prev,
              description: suggestedDescription
            }))
            descriptionGenerated = true
          }
          
          // 自動生成された項目を通知
          const generatedItems = []
          if (titleGenerated) generatedItems.push('作品名')
          if (descriptionGenerated) generatedItems.push('作品概要')
          
          if (generatedItems.length > 0) {
            console.log(`AI分析により自動生成されました: ${generatedItems.join('、')}`)
          }
        }
        
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
      console.error('=== AI分析エラー ===')
      console.error('エラー:', error)
      console.error('エラー型:', typeof error)
      console.error('Errorインスタンス:', error instanceof Error)
      console.error('エラーキー:', error && typeof error === 'object' ? Object.keys(error) : 'not an object')
      console.error('hasMessage:', !!(error as any)?.message)
      console.error('message:', (error as any)?.message)
      console.error('message型:', typeof (error as any)?.message)
      console.error('====================')
      
      // エラーメッセージの適切な処理
      let errorMessage = 'AI分析に失敗しました'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        const errorObj = error as any
        if (errorObj.message && typeof errorObj.message === 'string') {
          errorMessage = errorObj.message
        } else {
          try {
            errorMessage = JSON.stringify(errorObj, null, 2)
          } catch (stringifyError) {
            errorMessage = 'エラーオブジェクトの解析に失敗しました'
          }
        }
      }
      
      // レート制限・クオータ超過のときは丁寧なメッセージに差し替え
      const msgLower = (errorMessage || '').toLowerCase()
      const isRateLimit =
        errorMessage.includes('上限に達しています') ||
        msgLower.includes('rate limit') ||
        msgLower.includes('quota') ||
        msgLower.includes('429')

      const finalMessage = isRateLimit
        ? '現在AI分析の上限に達しています。数分〜10分ほど待ってから再度お試しください。継続するにはGeminiのプラン/課金設定もご確認ください。'
        : errorMessage

      console.log('表示するエラーメッセージ:', finalMessage)
      
      // レート制限の場合はより詳細な情報を表示
      if (isRateLimit) {
        const detailedMessage = `🚨 AI分析の上限に達しています

現在、Google Cloud Platformの無料トライアル終了により、AI分析の利用制限に達しています。

【根本原因】
• Google Cloud Platformの無料トライアルが終了（2025年10月9日までにアップグレード必要）
• OAuth トークン付与レートの制限（1日10,000件）
• Gemini APIの無料枠制限

【対処方法】
• 数分〜10分ほど待ってから再度お試しください
• Google Cloud Platformの有料プランにアップグレード
• Gemini APIの有料プランにアップグレード
• OAuth トークン付与レートの上限増加申請

【代替手段】
• 手動でタグを追加することも可能です
• 作品の保存は通常通り行えます

しばらくお待ちいただくか、手動での入力をお試しください。`
        
        // レート制限情報を状態に保存
        setRateLimitInfo({
          isActive: true,
          message: 'AI分析の上限に達しています。しばらくお待ちください。',
          retryAfter: 30 // 30秒後に再試行可能
        })
        
        alert(detailedMessage)
      } else {
        alert(finalMessage)
      }
    } finally {
      setIsAnalyzing(false)
      // レート制限の場合はクールダウン時間を延長
      const cooldownTime = 10 // デフォルトは10秒
      startCooldown(cooldownTime)
    }
  }

  // フォーム送信
  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      alert('タイトルと説明を入力してください')
      return
    }

    if (onSubmit) {
      // 親から保存処理が渡された場合（編集モードなど）
      await onSubmit(formData, analysisResult, previewData)
      return
    }

    // 追加（insert）処理（従来通り）
    try {
      // ファイルアップロード処理
      const fileUrls: string[] = []
      let newBannerImageUrl = bannerImageUrl; // UI表示用のstateで初期化
      
      // Supabaseクライアントの確認
      console.log('=== Supabaseクライアント確認 ===')
      console.log('supabase object:', typeof supabase)
      console.log('supabase.storage:', typeof supabase.storage)
      console.log('supabase.storage.from:', typeof supabase.storage.from)
      console.log('===============================')
      
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
        
          console.log('=== ファイルアップロード開始 ===')
          console.log('ファイル名:', fileName)
          console.log('ファイルサイズ:', file.size)
          console.log('ファイルタイプ:', file.type)
          console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定')
          console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定')
        
          let { data: uploadData, error: uploadError } = await supabase.storage
            .from('work-files')
            .upload(fileName, file)
        
          // バケットが無い場合は自動作成して1度だけリトライ
          if (uploadError && uploadError.message?.includes('Bucket not found')) {
            console.warn('work-files バケットが存在しないため作成を試みます')
            const { error: bucketErr } = await supabase.storage.createBucket('work-files', { public: true })
            if (bucketErr) {
              console.error('バケット作成に失敗', bucketErr)
            } else {
              // リトライ
              ;({ data: uploadData, error: uploadError } = await supabase.storage
                .from('work-files')
                .upload(fileName, file))
            }
          }
        
          console.log('アップロード結果:', uploadData)
          console.log('アップロードエラー:', uploadError)
          console.log('=======================')
        
          if (uploadError) {
            console.error('=== File upload error ===')
            console.error('ファイル名:', file.name)
            console.error('ファイルサイズ:', file.size)
            console.error('ファイルタイプ:', file.type)
            console.error('エラー:', uploadError)
            console.error('エラー型:', typeof uploadError)
            console.error('エラーメッセージ:', uploadError.message)
            console.error('エラー詳細:', uploadError)
            console.error('=======================')
          
            let errorMessage = `ファイル ${file.name} のアップロードに失敗しました`
            if (uploadError.message) {
              errorMessage += `: ${uploadError.message}`
            }
            alert(errorMessage)
            continue
          }
        
          const { data: { publicUrl } } = supabase.storage
            .from('work-files')
            .getPublicUrl(fileName)
        
          fileUrls.push(publicUrl)
        
          // 最初の画像ファイルをバナー画像として設定
          if (file.type.startsWith('image/') && !newBannerImageUrl) {
            newBannerImageUrl = publicUrl; // ローカル変数を更新
            setBannerImageUrl(publicUrl) // UIプレビュー用にStateも更新
          }
        }
      }

      // カテゴリはユーザーが後で整理するため初期値は空にする
      const getContentTypeCategory = (_type: string) => {
        return []
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
        production_date: formData.productionDate ? new Date(formData.productionDate).toISOString().split('T')[0]! : null,
        tags: formData.tags,
        roles: formData.roles.length > 0 ? formData.roles : [],
        categories: getContentTypeCategory(contentType),
        content_type: contentType,
        banner_image_url: newBannerImageUrl || previewData?.image || null,
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
        // デザイン用フィールド
        design_tools: formData.designTools,
        // アップロードされたファイルのURL
        file_urls: fileUrls.length > 0 ? fileUrls : null,
        // 文字数統計を追加
        ...articleStats
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('ログインが必要です')
        return
      }

      // ユーザー名を取得
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, full_name')
        .eq('id', user.id)
        .single()
      
      const displayName = profileData?.display_name || profileData?.full_name || user.email?.split('@')[0] || 'ユーザー'
      setUserDisplayName(displayName)

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
      console.log(`記事文字数: ${articleStats.article_word_count}文字`)
      
      // 保存されたデータを設定
      setSavedWorkData(data)
      
      // 保存後にさりげなく共有トーストを表示
      setShowShareModal(true)

    } catch (error) {
      console.error('Work save error:', error)
      alert('作品の保存に失敗しました')
    } finally {
      setIsAnalyzing(false)
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

          {/* オンボーディング説明文 */}
          <div className="mt-6 mb-4 max-w-2xl mx-auto text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 text-blue-900 text-base leading-relaxed">
              <p className="mb-2">
                <span className="font-bold">
                  {contentType === 'article' ? 'URLを入力するだけで、作品概要などの情報は自動で取得されます。' :
                   contentType === 'design' ? 'URLを入力するだけで、デザイン作品の情報は自動で取得されます。' :
                   contentType === 'photo' ? 'URLを入力するだけで、写真作品の情報は自動で取得されます。' :
                   contentType === 'video' ? 'URLを入力するだけで、動画作品の情報は自動で取得されます。' :
                   contentType === 'podcast' ? 'URLを入力するだけで、ポッドキャスト作品の情報は自動で取得されます。' :
                   contentType === 'event' ? 'URLを入力するだけで、イベント作品の情報は自動で取得されます。' :
                   'URLを入力するだけで、作品概要などの情報は自動で取得されます。'}
                </span><br />
                {contentType === 'article' ? 'そのまま保存してもOKですし、AI分析で作品の魅力を可視化するのもおすすめです。' :
                 contentType === 'design' ? 'そのまま保存してもOKですし、AI分析でデザインの魅力を可視化するのもおすすめです。' :
                 contentType === 'photo' ? 'そのまま保存してもOKですし、AI分析で写真の魅力を可視化するのもおすすめです。' :
                 contentType === 'video' ? 'そのまま保存してもOKですし、AI分析で動画の魅力を可視化するのもおすすめです。' :
                 contentType === 'podcast' ? 'そのまま保存してもOKですし、AI分析でポッドキャストの魅力を可視化するのもおすすめです。' :
                 contentType === 'event' ? 'そのまま保存してもOKですし、AI分析でイベントの魅力を可視化するのもおすすめです。' :
                 'そのまま保存してもOKですし、AI分析で作品の魅力を可視化するのもおすすめです。'}
              </p>
              <p className="mb-0 text-blue-700 text-sm">
                {contentType === 'article' ? '制作メモや記事本文の入力は' :
                 contentType === 'design' ? '制作メモやデザイン詳細の入力は' :
                 contentType === 'photo' ? '制作メモや写真詳細の入力は' :
                 contentType === 'video' ? '制作メモや動画詳細の入力は' :
                 contentType === 'podcast' ? '制作メモやポッドキャスト詳細の入力は' :
                 contentType === 'event' ? '制作メモやイベント詳細の入力は' :
                 '制作メモや作品詳細の入力は'}<strong>完全に任意</strong>です。<br />
                「もっと詳しく残したい」「AI分析を深めたい」ときだけ、気軽にご活用ください。
              </p>
            </div>
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

            {/* ファイルアップロード - 記事以外の作品タイプのみ */}
            {contentType !== 'article' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">ファイル・画像アップロード</h2>
              <p className="text-gray-600 text-sm mb-4">
                デザインファイルや画像をアップロードできます。JPEG、PNG、GIFの他に PSD、AI、PDF、TIFF、WEBPもサポートしています。
              </p>
              
              {/* ドラッグ&ドロップエリア */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">アップロード</p>
                  <p className="text-sm text-gray-500 mb-4">
                    ファイルをドラッグ&ドロップするか、クリックして選択してください
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf,.psd,.ai,.tiff,.bmp,.svg"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                    disabled={uploadedFiles.length >= 1}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`px-4 py-2 rounded-lg transition-colors text-white ${uploadedFiles.length>=1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
                  >
                    {uploadedFiles.length>=1 ? 'アップロード済み' : 'ファイルを選択'}
                  </label>

                  {/* 画像プレビュー */}
                  {uploadedFiles.filter(f => f.type.startsWith('image/')).length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                      {uploadedFiles.filter(f => f.type.startsWith('image/')).map((file, idx) => (
                        <Image
                          key={idx}
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          width={192}
                          height={192}
                          className="w-48 h-48 object-cover rounded-lg shadow"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* アップロードされたファイル一覧 */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">アップロードされたファイル</h3>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            {file.type.startsWith('image/') ? (
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* バナー画像プレビュー */}
              {bannerImageUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">バナー画像（作品一覧に表示）</h3>
                  <div className="relative">
                    <Image
                      src={bannerImageUrl}
                      alt="バナー画像"
                      width={800}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      バナー画像
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    この画像が作品一覧のバナーとして表示されます
                  </p>
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
                作品名
              </h2>
              <Input
                placeholder="ここにタイトルが入ります"
                value={formData.title || previewData?.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="h-12"
              />
            </div>

            {/* 詳細説明・制作メモ・記事本文（タブUI） */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* タブボタン */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'description'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  作品概要
                </button>
                <button
                  onClick={() => setActiveTab('productionNotes')}
                  className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === 'productionNotes'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  制作メモ（任意）
                </button>
                {contentType === 'article' && (
                  <button
                    onClick={() => setActiveTab('articleContent')}
                    className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'articleContent'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    記事本文（任意）
                  </button>
                )}
              </div>

              {/* 詳細説明タブ */}
              {activeTab === 'description' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">作品概要</h2>
                  <Textarea
                    placeholder={previewData?.description || "作品概要を入力..."}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>
              )}

              {/* 制作メモタブ */}
              {activeTab === 'productionNotes' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">制作メモ</h2>
                  <p className="text-sm text-gray-600 mb-3">
                    制作背景、目的、こだわったポイントなどを記録できます。AI分析にも活用されます。<br />
                    <strong>※ この項目は任意です。入力しなくても作品を保存できます。</strong>
                  </p>
                  <Textarea
                    placeholder="制作背景、目的、こだわったポイントなどを入力..."
                    value={formData.productionNotes}
                    onChange={(e) => handleInputChange('productionNotes', e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>
              )}

              {/* 記事本文タブ（記事タイプの場合のみ表示） */}
              {activeTab === 'articleContent' && contentType === 'article' && (
                <div>
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
                          <br />
                          <strong>※ この項目は任意です。入力しなくても作品を保存できます。</strong>
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
            </div>

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
                    <Button
                      key={role}
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="役割追加"
                      onClick={() => addRole(role)}
                      disabled={formData.roles.includes(role)}
                      className="border border-gray-300 rounded-full hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 px-3 py-1 text-sm"
                    >
                      {role}
                    </Button>
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="役割削除"
                          onClick={() => removeRole(role)}
                          className="ml-2 text-blue-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* デザイン詳細（デザインタイプの場合のみ表示） */}
            {contentType === 'design' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">デザイン詳細</h2>
                
                {/* デザインツール */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使用ツール
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {designToolOptions.map((tool) => (
                        <button
                          key={tool}
                          onClick={() => addDesignTool(tool)}
                          disabled={formData.designTools.includes(tool)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            formData.designTools.includes(tool)
                              ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newDesignTool}
                        onChange={(e) => setNewDesignTool(e.target.value)}
                        placeholder="その他のツール"
                        className="flex-1"
                      />
                      <Button onClick={addCustomDesignTool} variant="outline">
                        追加
                      </Button>
                    </div>
                    {formData.designTools.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.designTools.map((tool) => (
                          <span
                            key={tool}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {tool}
                            <button
                              onClick={() => removeDesignTool(tool)}
                              className="hover:text-blue-900"
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
            )}
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
                     contentType === 'design' ? 'デザインの美的センス・技術力・ブランド価値向上を多角的に分析（画像ファイルの視覚的内容も詳細分析・作品名・概要も自動生成）' :
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
                  disabled={isAnalyzing || isCooldown}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-8 py-3 font-medium min-w-[140px] whitespace-nowrap backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isAnalyzing ? '分析実行中...' : isCooldown ? `待機中 (${cooldownRemaining}s)` : 'AI分析実行'}
                </Button>
                <p className="text-blue-100 text-sm text-center lg:text-right">
                  作品の強みと特徴を自動分析
                </p>
                {/* レート制限情報の表示 */}
                {rateLimitInfo?.isActive && (
                  <div className="mt-2 p-2 bg-orange-100 border border-orange-200 rounded-lg">
                    <p className="text-orange-800 text-xs text-center">
                      ⚠️ {rateLimitInfo.message}
                    </p>
                  </div>
                )}
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
                        <div className="text-blue-700 text-sm">
                          {contentType === 'design' ? '作品の概要・強み・ターゲット層を詳細分析（画像ファイルの視覚的内容も含む・作品名・概要も自動生成）' : '作品の概要・強み・ターゲット層を詳細分析'}
                      </div>
                    </div>
                      {contentType === 'design' && (
                        <div className="bg-white/80 rounded-xl p-4 border border-blue-100 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                            <div className="font-semibold text-blue-800">自動生成機能</div>
                  </div>
                          <div className="text-blue-700 text-sm">作品名・概要・タグを画像内容から自動生成</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <EnhancedAnalysisProgress 
                contentType={contentType}
                contentLength={(formData.description || previewData?.description || articleContent || '').length}
                hasImages={uploadedFiles.length > 0}
                onCancel={() => setIsAnalyzing(false)}
              />
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
                    <p className="text-blue-800 leading-relaxed">
                      {analysisResult.contentTypeAnalysis || analysisResult.summary}
                    </p>
                  </div>

                  {/* AI評価スコア - 削除済み */}

                  {/* 専門性分析 */}
                  <BtoBAnalysisSection aiAnalysis={analysisResult || {}} />

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
            {mode === 'edit' && workId && (
              <Button 
                variant="outline"
                onClick={() => setShowDeleteModal(true)}
                className="px-8 py-3 text-lg border-red-300 text-red-600 hover:bg-red-50"
              >
                削除
              </Button>
            )}
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

      {/* 共有モーダル */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false)
          // 共有ポップアップを閉じた時にプロフィールページに遷移
          router.push('/profile')
        }}
        type="work"
        data={savedWorkData || {}}
        userDisplayName={userDisplayName}
        variant="toast"
      />

      {/* 削除確認モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">作品を削除</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              「{formData.title}」を削除しますか？この操作は取り消すことができません。
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? '削除中...' : '削除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewWorkForm; 