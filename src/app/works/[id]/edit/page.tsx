'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
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
  
  const [, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAIAnalysisDetailOpen] = useState(false)
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

  // コンテンツタイプの定義
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

  // フォームデータの更新

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

  // タグ削除

  // 役割追加

  // カスタム役割追加

  // 役割削除

  // カテゴリ追加

  // カテゴリ削除

  // AI分析機能

  // フォーム送信処理

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
      {/* TODO: 共通フォーム化準備中 */}
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        編集フォームは準備中です。
      </div>
    </ProtectedRoute>
  )
} 