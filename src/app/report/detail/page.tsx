'use client'

import { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header, MobileBottomNavigation } from '@/components/layout/header'
import { TasteAnalysisSection } from '@/features/report/components/TasteAnalysisSection'
import { ThoughtProcessSection } from '@/features/report/components/ThoughtProcessSection'
import { MatchingAffinitySection } from '@/features/report/components/MatchingAffinitySection'
import { supabase } from '@/lib/supabase'
import type { WorkData } from '@/features/work/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/common'

function DetailedReportContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const targetUserId = searchParams.get('userId') // URLパラメータからuserIdを取得
  const [works, setWorks] = useState<WorkData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)

  // 表示するユーザーIDを決定（URLパラメータがあればそれを、なければログインユーザーを使用）
  const displayUserId = targetUserId || user?.id

  useEffect(() => {
    const fetchData = async () => {
      if (!displayUserId) return

      setLoading(true)
      setError(null)

      try {
        // プロフィール情報を取得
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', displayUserId)
          .maybeSingle()

        if (profileError) {
          console.error('プロフィール取得エラー:', profileError)
          // プロフィールエラーは非致命的なので継続
        } else if (profileData) {
          setProfile(profileData)
        } else {
          // プロフィールが存在しない場合
          console.log('プロフィールデータが存在しません。基本情報のみで動作します。')
          setProfile(null)
        }

        // 作品データを取得
        const { data: worksData, error: worksError } = await supabase
          .from('works')
          .select('*')
          .eq('user_id', displayUserId)
          .order('created_at', { ascending: false })

        if (worksError) {
          console.error('作品データ取得エラー:', worksError)
          // 作品データのエラーは致命的ではないが、ログは出力
          setWorks([])
        } else {
          setWorks(worksData || [])
        }
      } catch (err) {
        console.error('データ取得エラー:', err)
        setError('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [displayUserId])

  // 以前はここにPDF出力機能がありましたが、実装コストのため削除しました

  if (loading) {
    return (
      <div className="min-h-screen bg-base-light-gray">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-dark-blue mx-auto mb-4"></div>
            <p className="text-gray-600">詳細レポートを分析中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-light-gray">
        <Header />
        <main className="pt-20 pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            <EmptyState title="エラーが発生しました">
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                再読み込み
              </Button>
            </EmptyState>
          </div>
        </main>
        <MobileBottomNavigation />
      </div>
    )
  }

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'ユーザー'
  const isOwnProfile = !targetUserId || targetUserId === user?.id

  return (
    <div className="min-h-screen bg-base-light-gray">
      <Header />
      
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* ヘッダーセクション */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    Professional Report
                  </CardTitle>
                  <p className="text-gray-600">
                    {isOwnProfile ? 'あなた' : displayName}の専門性分析レポート
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>作品数: {works.length}</span>
                    <span>分析日: {new Date().toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>
                {/* PDF出力ボタンは仕様変更により削除 */}
              </div>
            </CardHeader>
          </Card>

          {/* 分析不可の場合の案内 */}
          {works.length === 0 && (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Portfolio Required
                  </h3>
                  <p className="text-gray-600 mb-4">
                    専門性分析には作品データが必要です
                  </p>
                  {isOwnProfile && (
                    <Button 
                      onClick={() => window.location.href = '/works/new'}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      作品を登録
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 分析コンテンツ */}
          <div className="space-y-8">
            {/* テイスト分析 */}
            <TasteAnalysisSection works={works} />

            {/* 思考プロセス言語化 */}
            <ThoughtProcessSection works={works} />

            {/* マッチング相性 */}
            <MatchingAffinitySection works={works} />
          </div>

          {/* フッター情報 */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="text-center text-xs text-gray-500">
                <p>
                  Generated from {displayName}&apos;s portfolio data • {new Date().toLocaleDateString('ja-JP')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileBottomNavigation />
    </div>
  )
}

export default function DetailedReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base-light-gray">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-dark-blue mx-auto mb-4"></div>
            <p className="text-gray-600">詳細レポートを準備中...</p>
          </div>
        </div>
      </div>
    }>
      <DetailedReportContent />
    </Suspense>
  )
}
