'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { AIAnalysisResult } from '@/features/work/types'
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

  const [, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [, setPreviewError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [] = useState(false)
  const [, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [, setShowShareSuccess] = useState(false)

  // Tag and role state
  const [] = useState('')
  const [] = useState('')
  const [] = useState('')

  // Predefined options

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

  // Form data update handler

  // Tag management



  // Role management



  // Category management
  // eslint-disable-next-line unused-imports/no-unused-vars


  // AI Analysis

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
  const handleUpdate = async (formData: any, analysisResult: any) => {
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
            workId={workId}
            onSubmit={handleUpdate}
          />
        </div>
      </div>
    </ProtectedRoute>
  )
} 