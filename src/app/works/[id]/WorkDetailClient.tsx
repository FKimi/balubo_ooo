'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WorkBanner } from '@/features/work/components/WorkBanner'
import LikeButton from '@/features/work/components/LikeButton'
import CommentsSection from '@/features/comment/components/CommentsSection'
import { ShareModal } from '@/features/social/components/ShareModal'
import { WorkData, AIAnalysisResult } from '@/features/work/types'
import { supabase } from '@/lib/supabase'

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
  const summariesObj = aiAnalysis.evaluation?.summaries
  if (summariesObj) {
    type SummaryKey = 'overall' | 'technology' | 'expertise' | 'creativity' | 'impact'
    const axisLabels: Record<SummaryKey, string> = {
      overall: '総合評価',
      technology: '技術力',
      expertise: '専門性',
      creativity: '創造性',
      impact: '影響力',
    }
    const axisOrder: SummaryKey[] = ['technology', 'expertise', 'creativity', 'impact']
    const colorMap: Record<SummaryKey, string> = {
      overall: 'border-green-300 bg-green-100',
      technology: 'border-sky-300 bg-sky-100',
      expertise: 'border-teal-300 bg-teal-100',
      creativity: 'border-violet-300 bg-violet-100',
      impact: 'border-amber-300 bg-amber-100',
    }

    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-lg font-bold text-green-900">AI評価サマリー</h4>
        </div>

        {/* 総合評価 */}
        {summariesObj.overall && (
          <div className={`mb-4 p-4 rounded-lg shadow-sm ${colorMap.overall}`}>
            <span className="block font-semibold text-gray-800 mb-1">{axisLabels.overall}</span>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{summariesObj.overall}</p>
          </div>
        )}

        {/* その他の4軸 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {axisOrder.map((key) => {
            const text = summariesObj[key]
            if (!text) return null
            return (
              <div key={key} className={`p-4 rounded-lg shadow-sm ${colorMap[key]}`}>
                <span className="block font-bold mb-1 text-gray-800">{axisLabels[key]}</span>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{text}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

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
        {scores?.overall && (
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
          {scores?.technology && (
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

          {scores?.expertise && (
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

          {scores?.creativity && (
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

          {scores?.impact && (
            <div className="p-3 bg-white rounded-lg border border-green-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded('impact')}
              >
                <span className="text-sm font-medium text-gray-700">影響力</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-red-600">
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
      </div>
    )
  }

  // 古い形式のスコアを表示
  if (hasLegacyFormat) {
    const scores = aiAnalysis.legacyEvaluation!.scores
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-lg font-bold text-green-900">AI評価スコア</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(scores).map(([key, score]) => (
            <div key={key} className="p-3 bg-white rounded-lg border border-green-100">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded(key)}
              >
                <span className="text-sm font-medium text-gray-700">
                  {key === 'overall' ? '総合評価' :
                   key === 'technology' ? '技術力' :
                   key === 'expertise' ? '専門性' :
                   key === 'creativity' ? '創造性' :
                   key === 'impact' ? '影響力' : key}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-green-600">
                    {score.score}
                  </span>
                  <svg 
                    className={`w-3 h-3 text-gray-400 transition-transform ${
                      expandedItems.has(key) ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedItems.has(key) && score.reason && (
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  {score.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export default function WorkDetailClient({ workId }: { workId: string }) {
  const [work, setWork] = useState<WorkDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    // 閲覧数をインクリメントする非同期関数
    const incrementViewCount = async () => {
      // 開発環境ではカウントアップしない（ホットリロードによる意図しないカウントを防ぐ）
      if (process.env.NODE_ENV === 'development') {
        console.log('開発環境のため、閲覧数のカウントアップをスキップしました。');
        return;
      }
      try {
        await fetch(`/api/works/${workId}/view`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('閲覧数の更新リクエストに失敗:', error);
      }
    };

    if (workId) {
      incrementViewCount();
    }
  }, [workId]);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        setLoading(true)
        setError(null)

        if (process.env.NODE_ENV === 'development') {
          console.log(`WorkDetailClient: 作品取得開始 - ID = ${workId}`)
        }

        // 認証トークンを取得
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token

        // 作品データを取得
        const { data: workData, error: workError } = await supabase
          .from('works')
          .select('*')
          .eq('id', workId)
          .single()

        if (workError) {
          // 開発環境でのみ詳細エラー情報を出力
          if (process.env.NODE_ENV === 'development') {
            console.error('WorkDetailClient: 作品取得エラー - 詳細情報:', {
              id: workId,
              error: workError.message,
              code: workError.code,
              details: workError.details,
              hint: workError.hint,
              // エラーオブジェクト全体も出力
              fullError: workError,
              // エラーオブジェクトのプロパティ一覧
              errorKeys: Object.keys(workError),
              // エラーオブジェクトの型情報
              errorType: typeof workError,
              errorConstructor: workError.constructor.name,
              // スタックトレース（利用可能な場合）
              stack: workError.stack,
            })
          } else {
            console.error('WorkDetailClient: 作品取得エラー:', workError.message)
          }

          // エラータイプに応じてメッセージを設定
          let errorMessage = '作品の取得に失敗しました'
          
          if (workError.code === 'PGRST116') {
            errorMessage = '指定された作品が見つかりません'
          } else if (workError.code === 'PGRST301') {
            errorMessage = '無効な作品IDです'
          } else if (workError.code?.startsWith('PGRST')) {
            errorMessage = 'データベースエラーが発生しました'
          }

          setError(errorMessage)
          return
        }

        if (!workData) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`WorkDetailClient: 作品が見つかりません - ID = ${workId}`)
          }
          setError('作品が見つかりません')
          return
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`WorkDetailClient: 作品取得成功 - ID = ${workId}, タイトル = ${workData.title}`)
        }

        // データを整形
        const formattedWork: WorkDetailData = {
          ...workData,
          externalUrl: workData.external_url,
          productionDate: workData.production_date,
          previewData: workData.preview_data,
          createdAt: workData.created_at,
          updatedAt: workData.updated_at,
        }

        setWork(formattedWork)

        // 現在のユーザー情報を取得
        if (token) {
          const { data: { user } } = await supabase.auth.getUser()
          setCurrentUser(user)
        }

      } catch (err) {
        console.error('WorkDetailClient: 作品詳細取得中に予期しないエラーが発生 - 詳細情報:', {
          id: workId,
          error: err instanceof Error ? err.message : 'Unknown error',
          errorType: typeof err,
          errorConstructor: err instanceof Error ? err.constructor.name : 'Unknown',
          // エラーオブジェクト全体
          fullError: err,
          // エラーオブジェクトのプロパティ一覧
          errorKeys: err && typeof err === 'object' ? Object.keys(err) : [],
          // スタックトレース（利用可能な場合）
          stack: err instanceof Error ? err.stack : undefined,
          // 追加のデバッグ情報
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        })
        setError('作品の取得中にエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchWork()
  }, [workId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded mb-8"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {error || '作品が見つかりません'}
              </h1>
              <p className="text-gray-600 mb-6">
                指定された作品は存在しないか、削除された可能性があります。
              </p>
              <Link href="/profile">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  ポートフォリオに戻る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // AI分析データの取得（previewDataまたはpreview_dataまたはai_analysis_resultから）
  const aiAnalysis = work.ai_analysis_result || work.previewData?.analysis || work.preview_data?.analysis

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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
                    {!!(aiAnalysis.evaluation?.scores || aiAnalysis.evaluation?.summaries || aiAnalysis.legacyEvaluation?.scores) && (
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
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <h6 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                専門性
                              </h6>
                              <ul className="space-y-1">
                                {aiAnalysis.strengths.expertise.map((strength: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-blue-700 text-sm">
                                    <span className="text-blue-500 mt-1 text-xs">●</span>
                                    <span className="leading-relaxed">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* 影響力 */}
                          {aiAnalysis.strengths.impact && aiAnalysis.strengths.impact.length > 0 && (
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                              <h6 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                影響力
                              </h6>
                              <ul className="space-y-1">
                                {aiAnalysis.strengths.impact.map((strength: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-green-700 text-sm">
                                    <span className="text-green-500 mt-1 text-xs">●</span>
                                    <span className="leading-relaxed">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* キーワード */}
                    {aiAnalysis.keywords && aiAnalysis.keywords.length > 0 && (
                      <div className="bg-white border border-blue-200 rounded-xl p-4">
                        <h5 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          キーワード
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.keywords.map((keyword: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* タグ */}
                    {aiAnalysis.tags && aiAnalysis.tags.length > 0 && (
                      <div className="bg-white border border-blue-200 rounded-xl p-4">
                        <h5 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          関連タグ
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.tags.map((tag: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* タグ（AI分析タグがない場合のみ表示） */}
              {(!aiAnalysis?.tags || aiAnalysis.tags.length === 0) && work.tags && work.tags.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="text-3xl">🏷️</span>
                    タグ
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag, index) => (
                      <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm rounded-full font-medium shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 外部リンク */}
              {work.external_url && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="text-3xl">🔗</span>
                    外部リンク
                  </h2>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <a 
                      href={work.external_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium text-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      作品を確認する
                    </a>
                  </div>
                </div>
              )}

              {/* アクションボタン */}
              <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200">
                <LikeButton workId={work.id} />
                
                <Button 
                  onClick={() => setShowShareModal(true)}
                  variant="outline" 
                  className="flex items-center gap-2 hover:bg-blue-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  共有
                </Button>
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
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)}
        type="work"
        data={work}
      />
    </div>
  )
} 