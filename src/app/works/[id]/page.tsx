'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Head from 'next/head'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WorkBanner } from '@/components/WorkBanner'
import LikeButton from '@/features/work/components/LikeButton'
import CommentsSection from '@/features/comment/components/CommentsSection'
import { ShareModal } from '@/features/social/components/ShareModal'
import { WorkData, AIAnalysisResult } from '@/types/work'
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface WorkDetailData extends WorkData {
  user_id: string
  externalUrl?: string
  productionDate?: string
  previewData?: any
  preview_data?: any
  createdAt: string
  updatedAt: string
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
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-lg font-bold text-green-900">AI評価スコア</h4>
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

export default function WorkDetailPage() {
  const params = useParams()
  const workId = params.id as string
  const [work, setWork] = useState<WorkDetailData | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    const fetchWork = async () => {
      try {
        // workIdの検証
        if (!workId || typeof workId !== 'string') {
          console.error('無効な作品ID:', workId)
          setError('無効な作品IDです')
          return
        }

        console.log('作品詳細を取得中...', { workId })

        // 認証トークンを取得
        const { supabase } = await import('@/lib/supabase')
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        
        // 現在のユーザー情報を取得
        if (session?.user) {
          setCurrentUser(session.user)
          console.log('ユーザーが認証されています:', session.user.id)
        } else {
          console.log('ユーザーは未認証です')
        }

        const response = await fetch(`/api/works/${workId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        })

        // レスポンスの詳細情報を取得
        const contentType = response.headers.get('content-type')
        const responseText = await response.text() // レスポンス本文をテキストとして取得
        
        console.log('APIレスポンスの詳細:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          contentType,
          responseLength: responseText.length,
          responsePreview: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
          headers: Object.fromEntries(response.headers.entries())
        })

        // レスポンスがJSONかどうかをチェック
        if (!contentType || !contentType.includes('application/json')) {
          console.error('APIがJSON以外のレスポンスを返しました:', {
            contentType,
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            responseBody: responseText.substring(0, 500) // 最初の500文字を表示
          })
          
          // HTMLレスポンスの場合、404ページの可能性が高い
          if (response.status === 404 || contentType?.includes('text/html')) {
            setError('作品が見つかりません。この作品は削除されたか、非公開設定になっている可能性があります。')
          } else if (response.status === 0 || !response.status) {
            setError('サーバーに接続できません。ネットワーク接続を確認してください。')
          } else {
            setError(`APIエラー: サーバーが不正なレスポンスを返しました (${response.status})`)
          }
          return
        }

        // JSONとしてパース
        let data
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error('JSONパースエラー:', {
            error: parseError,
            responseText: responseText.substring(0, 500)
          })
          setError('APIレスポンスの解析に失敗しました')
          return
        }

        if (response.ok && data.work) {
          console.log('作品データを正常に取得:', data.work.title)
          
          // データ構造を統一（APIから返されるデータをフロントエンド用に変換）
          const workData = {
            ...data.work,
            // external_url -> externalUrl への変換
            externalUrl: data.work.external_url || data.work.externalUrl,
            // preview_data -> previewData への変換（既存のpreviewDataがない場合）
            previewData: data.work.previewData || data.work.preview_data,
            // production_date -> productionDate への変換
            productionDate: data.work.production_date || data.work.productionDate,
          }
          
          console.log('Work detail data received:', {
            id: workData.id,
            title: workData.title,
            user_id: workData.user_id,
            externalUrl: workData.externalUrl,
            banner_image_url: workData.banner_image_url,
            hasPreviewData: !!workData.previewData,
            hasPreview_data: !!workData.preview_data,
            previewDataImage: workData.previewData?.image,
            preview_dataImage: workData.preview_data?.image,
            hasAiAnalysis: !!workData.ai_analysis_result,
            hasProductionNotes: !!workData.production_notes
          })
          setWork(workData)
        } else {
          console.error('作品データの取得に失敗:', {
            status: response.status,
            error: data.error,
            details: data.details
          })
          
          if (response.status === 404) {
            setError('作品が見つかりません。削除されたか、非公開設定になっている可能性があります。')
          } else if (response.status === 401) {
            setError('この作品を閲覧する権限がありません。')
          } else {
            setError(data.details || data.error || '作品データの取得に失敗しました')
          }
        }
      } catch (error) {
        console.error('作品取得エラー:', error)
        setError(`作品データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
      } finally {
        setIsLoading(false)
      }
    }

    if (workId) {
      fetchWork()
    }
  }, [workId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 animate-spin text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-gray-600">作品を読み込み中...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">作品が見つかりません</h3>
              <p className="text-gray-600 mb-2">{error}</p>
              <p className="text-gray-500 text-sm mb-6">作品ID: {workId}</p>
              <div className="flex gap-3 justify-center">
                <Link href="/profile">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                    ポートフォリオに戻る
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  再読み込み
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // AI分析データの取得（previewDataまたはpreview_dataまたはai_analysis_resultから）
  const aiAnalysis = work.ai_analysis_result || work.previewData?.analysis || work.preview_data?.analysis

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Head>
        <title>{work.title} - 作品詳細</title>
        <meta name="description" content={work.description || `${work.title}の作品詳細ページです。`} />
        <meta property="og:title" content={work.title} />
        <meta property="og:description" content={work.description || `${work.title}の作品詳細ページです。`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/works/${work.id}`} />
        {work.banner_image_url && (
          <meta property="og:image" content={work.banner_image_url} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={work.title} />
        <meta name="twitter:description" content={work.description || `${work.title}の作品詳細ページです。`} />
        {work.banner_image_url && (
          <meta name="twitter:image" content={work.banner_image_url} />
        )}
      </Head>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/profile">
              <Button variant="outline" className="flex items-center gap-2 hover:bg-white/70">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ポートフォリオに戻る
              </Button>
            </Link>
            
            {/* 編集ボタンは作品の所有者のみに表示 */}
            {currentUser && work.user_id === currentUser.id && (
              <div className="flex gap-3">
                <Link href={`/works/${work.id}/edit`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    編集
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* 作品詳細 */}
          <Card className="overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            {/* バナー画像 */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
              {work.external_url || work.banner_image_url || work.previewData?.image || work.preview_data?.image ? (
                <WorkBanner 
                  url={work.external_url || ''} 
                  title={work.title}
                  previewData={work.previewData || work.preview_data}
                  bannerImageUrl={work.banner_image_url || ''}
                  useProxy={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-white rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-gray-600 text-lg font-medium">作品</div>
                  </div>
                </div>
              )}
            </div>

            <CardContent className="p-8">
              {/* タイトルと基本情報 */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    {work.title}
                  </h1>
                  {work.productionDate && (
                    <span className="text-gray-500 text-sm font-medium bg-gray-100 px-4 py-2 rounded-full whitespace-nowrap ml-4">
                      {new Date(work.productionDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
                    </span>
                  )}
                </div>

                {/* 役割 */}
                {work.roles && work.roles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {work.roles.map((role, index) => (
                      <span key={index} className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm rounded-full font-medium shadow-sm">
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 説明文 */}
              {work.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="text-3xl">💬</span>
                    作品について
                  </h2>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                      {work.description}
                    </p>
                  </div>
                </div>
              )}

              {/* 制作メモ */}
              {work.production_notes && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="text-3xl">📝</span>
                    制作メモ
                  </h2>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                    <div className="mb-3">
                      <span className="text-sm text-amber-700 font-medium bg-amber-100 px-3 py-1 rounded-full">
                        制作過程・背景・こだわり
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                      {work.production_notes}
                    </p>
                  </div>
                </div>
              )}

              {/* AI分析結果 */}
              {aiAnalysis && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    AI分析結果
                  </h2>
                  
                  <div className="space-y-6">
                    {/* 作品概要・要約 */}
                    {aiAnalysis.summary && (
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <h4 className="text-lg font-bold text-blue-900">コンテンツ概要</h4>
                        </div>
                        <p className="text-blue-800 leading-relaxed text-sm">{aiAnalysis.summary}</p>
                      </div>
                    )}

                    {/* AI評価スコア */}
                    {(aiAnalysis.evaluation?.scores || aiAnalysis.legacyEvaluation?.scores) && (
                      <AIEvaluationSection aiAnalysis={aiAnalysis} />
                    )}

                    {/* 強み分析 */}
                    {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 && (
                      <div className="bg-white border border-blue-200 rounded-xl p-4">
                        <h5 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          この作品の強み
                        </h5>
                        <div className="space-y-4">
                          
                          {/* 創造性 */}
                          {aiAnalysis.strengths.creativity && aiAnalysis.strengths.creativity.length > 0 && (
                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                              <h6 className="font-medium text-purple-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                                </svg>
                                創造性
                              </h6>
                              <ul className="space-y-1">
                                {aiAnalysis.strengths.creativity.map((strength: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-purple-700 text-sm">
                                    <span className="text-purple-500 mt-1 text-xs">●</span>
                                    <span className="leading-relaxed">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 専門性 */}
                          {aiAnalysis.strengths.expertise && aiAnalysis.strengths.expertise.length > 0 && (
                            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                              <h6 className="font-medium text-emerald-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                専門性
                              </h6>
                              <ul className="space-y-1">
                                {aiAnalysis.strengths.expertise.map((strength: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-emerald-700 text-sm">
                                    <span className="text-emerald-500 mt-1 text-xs">●</span>
                                    <span className="leading-relaxed">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 影響力 */}
                          {aiAnalysis.strengths.impact && aiAnalysis.strengths.impact.length > 0 && (
                            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                              <h6 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                影響力
                              </h6>
                              <ul className="space-y-1">
                                {aiAnalysis.strengths.impact.map((strength: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-orange-700 text-sm">
                                    <span className="text-orange-500 mt-1 text-xs">●</span>
                                    <span className="leading-relaxed">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI推奨タグ */}
                    {aiAnalysis.tags && aiAnalysis.tags.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          AI推奨タグ
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.tags.map((tag: string, idx: number) => (
                            <span key={idx} className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* タグ */}
              {work.tags && work.tags.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    タグ
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {work.tags.map((tag, index) => (
                      <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* カテゴリ */}
              {work.categories && work.categories.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M7 13h10" />
                    </svg>
                    カテゴリ
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {work.categories.map((category, index) => (
                      <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm rounded-lg font-medium shadow-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 外部リンク */}
              {work.external_url && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    作品を見る
                  </h2>
                  <a 
                    href={work.external_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="text-lg">実際の作品を確認する</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {/* いいねボタンと共有ボタン */}
              <div className="mb-8">
                <div className="flex items-center gap-4">
                  <LikeButton workId={work.id} />
                  <Button
                    onClick={() => setIsShareModalOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 border border-gray-300 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    共有
                  </Button>
                </div>
              </div>

              {/* メタ情報 */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>作成日: {new Date(work.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  {work.updatedAt !== work.createdAt && (
                    <span>更新日: {new Date(work.updatedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* コメントセクション */}
          <div className="mt-8">
            <CommentsSection workId={work.id} />
          </div>
        </div>
      </main>

      {/* 共有モーダル */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        type="work"
        data={work as WorkData}
        userDisplayName={currentUser?.user_metadata?.display_name || 'クリエイター'}
      />
    </div>
  )
} 