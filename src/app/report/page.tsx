'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header, MobileBottomNavigation } from '@/components/layout/header'
import { useWorkStatistics } from '@/hooks/useWorkStatistics'
import { OverviewSection } from '@/components/report/OverviewSection'
import { WorksSection } from '@/components/report/WorksSection'
import { InputsSection } from '@/components/report/InputsSection'
import { InsightsSection } from '@/components/report/InsightsSection'
import { exportToPDF, exportScreenshotToPDF, exportComprehensiveReportToPDF } from '@/utils/pdfExport'
import { supabase } from '@/lib/supabase'
import type { WorkData } from '@/types/work'
import type { InputData } from '@/types/input'

export default function ReportPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const targetUserId = searchParams.get('userId') // URLパラメータからuserIdを取得
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [works, setWorks] = useState<WorkData[]>([])
  const [inputs, setInputs] = useState<InputData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  // 作品統計を計算
  const workStats = useWorkStatistics(works)
  const hasInputs = inputs.length > 0
  
  // デバッグ用：統計を確認
  console.log('レポートページ統計:', {
    works: works.length,
    inputs: inputs.length,
    workStats: {
      totalWorks: workStats.totalWorks,
      totalWordCount: workStats.totalWordCount,
      roleDistribution: workStats.roleDistribution.length
    }
  })

  // 認証ヘッダーを取得するヘルパー関数
  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    try {
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
  }

  // プロフィール情報の取得
  const fetchProfile = async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/profile', { headers })
      if (response.ok) {
        const profileData = await response.json()
        setProfile(profileData)
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      // targetUserIdが指定されている場合は公開プロフィールデータを取得
      if (targetUserId) {
        try {
          setLoading(true)
          setError(null)

          const response = await fetch(`/api/public-profile?userId=${targetUserId}`)
          
          if (!response.ok) {
            throw new Error('公開プロフィールデータの取得に失敗しました')
          }

          const data = await response.json()
          setProfile(data.profile)
          setWorks(data.works || [])
          setInputs(data.inputs || [])

        } catch (error) {
          console.error('公開プロフィールデータ取得エラー:', error)
          setError(error instanceof Error ? error.message : '公開プロフィールデータの取得に失敗しました')
        } finally {
          setLoading(false)
        }
        return
      }

      // 通常の認証ユーザー向けデータ取得
      if (!user) return

      try {
        setLoading(true)
        setError(null)

        // プロフィール情報を取得
        await fetchProfile()

        // 認証ヘッダーを取得
        const headers = await getAuthHeaders()

        // 作品データと作品分析を並行取得
        const [worksResponse, inputsResponse] = await Promise.all([
          fetch('/api/works', { headers }),
          fetch('/api/inputs', { headers })
        ])

        if (!worksResponse.ok) {
          throw new Error('作品データの取得に失敗しました')
        }

        const worksData = await worksResponse.json()
        console.log('取得した作品データ:', worksData)
        // APIレスポンスの構造に応じて配列を抽出
        const worksArray = Array.isArray(worksData) ? worksData : (worksData?.works || [])
        setWorks(worksArray)
        console.log('設定した作品配列:', worksArray.length, '件')

        if (inputsResponse.ok) {
          const inputsData = await inputsResponse.json()
          console.log('取得したインプットデータ:', inputsData)
          // APIレスポンスの構造に応じて配列を抽出
          const inputsArray = Array.isArray(inputsData) ? inputsData : (inputsData?.inputs || [])
          setInputs(inputsArray)
          console.log('設定したインプット配列:', inputsArray.length, '件')
        }

      } catch (error) {
        console.error('データ取得エラー:', error)
        setError(error instanceof Error ? error.message : 'データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, targetUserId])

  // 包括的なレポートデータを準備する関数
  const prepareComprehensiveReportData = () => {
    // エキスパートレベル判定
    const getExpertLevel = () => {
      if (works.length >= 10 && workStats.totalWordCount >= 50000) {
        return 'エキスパート'
      } else if (works.length >= 5 && workStats.totalWordCount >= 20000) {
        return 'プロフェッショナル'
      } else if (works.length >= 3 && workStats.totalWordCount >= 5000) {
        return '経験者'
      } else {
        return '新進クリエイター'
      }
    }

    // 品質スコア計算
    const calculateQualityScore = () => {
      const worksWithContent = works.filter(work => work.description && work.description.length > 50)
      const contentQualityRate = works.length > 0 ? (worksWithContent.length / works.length) * 100 : 0
      
      const inputsWithRating = inputs.filter(input => input.rating && input.rating > 0)
      const avgInputRating = inputsWithRating.length > 0 
        ? inputsWithRating.reduce((sum, input) => sum + (input.rating || 0), 0) / inputsWithRating.length 
        : 0

      const uniqueRoles = new Set()
      works.forEach(work => {
        if (work.roles && Array.isArray(work.roles)) {
          work.roles.forEach(role => uniqueRoles.add(role))
        }
      })

      // 100点満点で計算
      const contentScore = Math.min((contentQualityRate / 100) * 25, 25)
      const ratingScore = Math.min((avgInputRating / 5) * 25, 25)
      const roleScore = Math.min((uniqueRoles.size / 10) * 25, 25)
      const worksScore = Math.min((works.length / 20) * 25, 25)

      return Math.round(contentScore + ratingScore + roleScore + worksScore)
    }

    // タグ分布
    const getTagDistribution = () => {
      const tagCount: { [key: string]: number } = {}
      works.forEach(work => {
        if (work.tags && Array.isArray(work.tags)) {
          work.tags.forEach(tag => {
            tagCount[tag] = (tagCount[tag] || 0) + 1
          })
        }
      })
      return tagCount
    }

    // ジャンル分布
    const getGenreDistribution = () => {
      const genreCount: { [key: string]: number } = {}
      inputs.forEach(input => {
        if (input.genres && Array.isArray(input.genres)) {
          input.genres.forEach(genre => {
            genreCount[genre] = (genreCount[genre] || 0) + 1
          })
        }
      })
      return genreCount
    }

    // 月別活動量
    const getMonthlyProgress = () => {
      const monthlyData: { [key: string]: { works: number, inputs: number } } = {}
      
      works.forEach(work => {
        if (work.production_date) {
          const month = new Date(work.production_date).toISOString().slice(0, 7)
          if (!monthlyData[month]) monthlyData[month] = { works: 0, inputs: 0 }
          monthlyData[month].works++
        }
      })

      inputs.forEach(input => {
        if (input.consumptionDate) {
          const month = new Date(input.consumptionDate).toISOString().slice(0, 7)
          if (!monthlyData[month]) monthlyData[month] = { works: 0, inputs: 0 }
          monthlyData[month].inputs++
        }
      })

      return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12) // 最新12ヶ月
        .map(([month, data]) => ({ month, works: data.works, inputs: data.inputs }))
    }

    // タイムライン作成
    const getTimeline = () => {
      const events: { date: string; event: string; type: 'work' | 'input' }[] = []
      
      works.forEach(work => {
        if (work.production_date) {
          events.push({
            date: new Date(work.production_date).toLocaleDateString('ja-JP'),
            event: `作品「${work.title}」を制作`,
            type: 'work'
          })
        }
      })

      inputs.forEach(input => {
        if (input.consumptionDate) {
          events.push({
            date: new Date(input.consumptionDate).toLocaleDateString('ja-JP'),
            event: `「${input.title}」を学習`,
            type: 'input'
          })
        }
      })

      return events
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20) // 最新20件
    }

    const inputsWithRating = inputs.filter(input => input.rating && input.rating > 0)
    const avgInputRating = inputsWithRating.length > 0 
      ? inputsWithRating.reduce((sum, input) => sum + (input.rating || 0), 0) / inputsWithRating.length 
      : 0

    const tagDistribution = getTagDistribution()
    const genreDistribution = getGenreDistribution()
    const topTags = Object.entries(tagDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([tag]) => tag)

    const topGenres = Object.entries(genreDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([genre]) => genre)

    return {
      profile: {
        displayName: profile?.display_name || user?.user_metadata?.display_name || 'ユーザー',
        bio: profile?.bio,
        skills: profile?.skills || [],
        location: profile?.location,
        website: profile?.website
      },
      overview: {
        expertLevel: getExpertLevel(),
        qualityScore: calculateQualityScore(),
        totalWorks: works.length,
        totalWordCount: workStats.totalWordCount,
        avgWordCount: works.length > 0 ? Math.round(workStats.totalWordCount / works.length) : 0,
        contentQualityRate: works.length > 0 ? (works.filter(w => w.description && w.description.length > 50).length / works.length) * 100 : 0,
        avgInputRating,
        availableRoles: new Set(works.flatMap(w => w.roles || [])).size,
        strengths: [
          `実績豊富（${works.length}作品の制作経験）`,
          `学習意欲旺盛（${inputs.length}件のインプット記録）`,
          avgInputRating > 4 ? '高い評価基準（平均評価4点以上）' : '客観的な評価能力',
          workStats.totalWordCount > 20000 ? '豊富な文章力（2万文字以上の執筆）' : '継続的な創作活動',
          topTags.length > 5 ? '多様なスキルセット' : '専門分野への集中'
        ]
      },
      worksAnalysis: {
        works: works.slice(0, 12),
        genreDistribution: {},
        tagDistribution,
        monthlyProgress: getMonthlyProgress().map(m => ({ month: m.month, count: m.works })),
        qualityMetrics: {
          avgWordCount: works.length > 0 ? Math.round(workStats.totalWordCount / works.length) : 0,
          completionRate: works.length > 0 ? (works.filter(w => w.description && w.description.length > 20).length / works.length) * 100 : 0,
          tagVariety: topTags.length
        }
      },
      inputsAnalysis: {
        inputs: inputs.slice(0, 10),
        genrePreferences: genreDistribution,
        ratingDistribution: {},
        monthlyInputs: getMonthlyProgress().map(m => ({ month: m.month, count: m.inputs })),
        learningInsights: {
          totalInputs: inputs.length,
          avgRating: avgInputRating,
          topGenres
        }
      },
      growthInsights: {
        timeline: getTimeline(),
        productivityTrends: getMonthlyProgress(),
        skillEvolution: topTags.slice(0, 8).map(tag => ({
          skill: tag,
          frequency: tagDistribution[tag] || 0,
          trend: 'stable' as const
        }))
      }
    }
  }

  // PDF出力機能
  const handleExportPDF = async (type: 'structured' | 'screenshot' | 'comprehensive' = 'comprehensive') => {
    try {
      setIsExporting(true)

      if (type === 'comprehensive') {
        // 包括的なレポートPDF出力（4セクション統合）
        const comprehensiveData = prepareComprehensiveReportData()
        await exportComprehensiveReportToPDF(comprehensiveData)
      } else if (type === 'structured') {
        // 従来の構造化されたPDF出力
        const topTags = () => {
          const tagCount: { [key: string]: number } = {}
          works.forEach(work => {
            if (work.tags && Array.isArray(work.tags)) {
              work.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1
              })
            }
          })
          return Object.entries(tagCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([tag]) => tag)
        }

        const topGenres = () => {
          const genreCount: { [key: string]: number } = {}
          inputs.forEach(input => {
            if (input.genres && Array.isArray(input.genres)) {
              input.genres.forEach(genre => {
                genreCount[genre] = (genreCount[genre] || 0) + 1
              })
            }
          })
          return Object.entries(genreCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([genre]) => genre)
        }

        const inputsWithRating = inputs.filter(input => input.rating && input.rating > 0)
        const avgRating = inputsWithRating.length > 0 
          ? inputsWithRating.reduce((sum, input) => sum + (input.rating || 0), 0) / inputsWithRating.length 
          : 0

        const exportData = {
          profile: {
            displayName: profile?.display_name || user?.user_metadata?.display_name || 'ユーザー',
            bio: profile?.bio,
            skills: profile?.skills || [],
            location: profile?.location,
            website: profile?.website
          },
          works: works.slice(0, 10), // 最新10件
          inputs,
          stats: {
            totalWorks: works.length,
            totalWordCount: workStats.totalWordCount,
            avgRating,
            topGenres: topGenres(),
            topTags: topTags()
          }
        }

        await exportToPDF(exportData)
      } else {
        // スクリーンショット型PDF出力
        await exportScreenshotToPDF('report-content')
      }

    } catch (error) {
      console.error('PDF出力エラー:', error)
      alert(error instanceof Error ? error.message : 'PDF出力に失敗しました')
    } finally {
      setIsExporting(false)
    }
  }

  // 認証チェック（他のユーザーのレポートを見る場合は認証不要）
  if (!user && !targetUserId) {
    return (
      <div className="min-h-screen bg-base-light-gray">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">ログインが必要です</h2>
            <p className="text-gray-500">レポート機能を利用するにはログインしてください。</p>
          </div>
        </div>
        <MobileBottomNavigation />
      </div>
    )
  }

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen bg-base-light-gray">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-dark-blue mx-auto mb-4"></div>
            <p className="text-gray-600">レポートを作成中...</p>
          </div>
        </div>
        <MobileBottomNavigation />
      </div>
    )
  }

  // エラー状態
  if (error) {
    return (
      <div className="min-h-screen bg-base-light-gray">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">エラーが発生しました</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>再読み込み</Button>
          </div>
        </div>
        <MobileBottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-light-gray">
      <Header />
      
      <main className="pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* ヘッダー */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  📊 {targetUserId ? `${profile?.display_name || 'クリエイター'}の活動レポート` : '活動レポート'}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {targetUserId 
                    ? `${profile?.display_name || 'このクリエイター'}の創作活動とインプットの総合分析`
                    : `${profile?.display_name || user?.user_metadata?.display_name || 'あなた'}の創作活動とインプットの総合分析`
                  }
                </p>
              </div>
              
              {/* PDF出力ボタン（実装中） */}
              <Button
                disabled={true}
                className="bg-gray-300 text-gray-500 px-4 py-2 text-sm cursor-not-allowed"
                title="現在PDF出力機能を改善中です"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                全レポートPDF出力（実装中...）
              </Button>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="mb-6 sm:mb-8">
            {/* デスクトップ用タブナビゲーション */}
            <div className="hidden sm:block">
              <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
                {[
                  { id: 'overview', label: '概要', icon: '📊' },
                  { id: 'works', label: '作品分析', icon: '🎨' },
                  { id: 'inputs', label: 'インプット分析', icon: '📚', disabled: !hasInputs },
                  { id: 'insights', label: '成長の軌跡', icon: '📈' }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    disabled={section.disabled}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                      activeSection === section.id
                        ? 'bg-accent-dark-blue text-white'
                        : section.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={section.disabled ? 'インプットデータがありません' : ''}
                  >
                    <span>{section.icon}</span>
                    <span className="hidden md:inline">{section.label}</span>
                    {section.disabled && (
                      <span className="hidden md:inline text-xs text-gray-400 ml-1">(0件)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* モバイル用ドロップダウン */}
            <div className="sm:hidden">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 shadow-sm focus:border-accent-dark-blue focus:ring-1 focus:ring-accent-dark-blue"
              >
                <option value="overview">📊 概要</option>
                <option value="works">🎨 作品分析</option>
                <option value="inputs" disabled={!hasInputs}>
                  📚 インプット分析{!hasInputs ? ' (0件)' : ''}
                </option>
                <option value="insights">📈 成長の軌跡</option>
              </select>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div id="report-content" className="space-y-6">
            {activeSection === 'overview' && <OverviewSection works={works} inputs={inputs} workStats={workStats} />}
            {activeSection === 'works' && <WorksSection works={works} workStats={workStats} />}
            {activeSection === 'inputs' && <InputsSection inputs={inputs} />}
            {activeSection === 'insights' && <InsightsSection works={works} inputs={inputs} workStats={workStats} />}
          </div>

          {/* クライアント向け推薦セクション */}
          {works.length >= 3 && (
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 sm:p-8">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                  🎯 クリエイター推薦レポート
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  このレポートは、{targetUserId 
                    ? (profile?.display_name || 'このクリエイター')
                    : (profile?.display_name || user?.user_metadata?.display_name || 'このクリエイター')
                  }の実績と能力をデータに基づいて分析したものです。
                  {targetUserId ? 'プロジェクトやコラボレーションのご参考にご活用ください。' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{works.length}</div>
                    <div className="text-sm text-gray-600">実績作品数</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {workStats.totalWordCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">総執筆文字数</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {workStats.roleDistribution.length}
                    </div>
                    <div className="text-sm text-gray-600">対応可能役割</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNavigation />
    </div>
  )
} 