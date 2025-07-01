'use client'

import { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header, MobileBottomNavigation } from '@/components/layout/header'
import { useWorkStatistics } from '@/hooks/useWorkStatistics'
import { WorksSection } from '@/features/report/components/WorksSection'
import { InputsSection } from '@/features/report/components/InputsSection'
import { ActivitySection } from '@/features/report/components/ActivitySection'
import { exportToPDF, exportScreenshotToPDF, exportComprehensiveReportToPDF } from '@/utils/pdfExport'
import { supabase } from '@/lib/supabase'
import type { WorkData } from '@/types/work'
import type { InputData } from '@/types/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { calculateMonthlyProgress, generateTimeline } from '@/utils/activityStats'
import { OverallScoreGauge } from '@/features/report/components/OverallScoreGauge'

function ReportContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const targetUserId = searchParams.get('userId') // URLパラメータからuserIdを取得
  const [activeSection, setActiveSection] = useState<string>('outputs')
  const [works, setWorks] = useState<WorkData[]>([])
  const [inputs, setInputs] = useState<InputData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [showDetailedCards, setShowDetailedCards] = useState(false)

  // 各作品のAI分析結果から創造性、専門性、影響力を抽出
  const generateComprehensiveAnalysis = () => {
    const analysisData = {
      creativity: { scores: [] as number[], insights: [] as string[], topWorks: [] as any[] },
      expertise: { scores: [] as number[], insights: [] as string[], topWorks: [] as any[] },
      impact: { scores: [] as number[], insights: [] as string[], topWorks: [] as any[] },
      technology: { scores: [] as number[], insights: [] as string[], topWorks: [] as any[] }
    }

    // 各作品のAI分析結果から評価スコアを抽出
    works.forEach(work => {
      if (work.ai_analysis_result) {
        const analysis = typeof work.ai_analysis_result === 'string' 
          ? JSON.parse(work.ai_analysis_result) 
          : work.ai_analysis_result

        // 新しい評価スコア（evaluation.scores）を優先使用
        if (analysis.evaluation?.scores) {
          const scores = analysis.evaluation.scores

          // 技術力スコア
          if (scores.technology?.score) {
            analysisData.technology.scores.push(scores.technology.score)
            analysisData.technology.topWorks.push({
              title: work.title,
              score: scores.technology.score,
              reason: scores.technology.reason,
              highlights: [scores.technology.reason]
            })
          }

          // 専門性スコア
          if (scores.expertise?.score) {
            analysisData.expertise.scores.push(scores.expertise.score)
            analysisData.expertise.topWorks.push({
              title: work.title,
              score: scores.expertise.score,
              reason: scores.expertise.reason,
              highlights: [scores.expertise.reason]
            })
          }

          // 創造性スコア
          if (scores.creativity?.score) {
            analysisData.creativity.scores.push(scores.creativity.score)
            analysisData.creativity.topWorks.push({
              title: work.title,
              score: scores.creativity.score,
              reason: scores.creativity.reason,
              highlights: [scores.creativity.reason]
            })
          }

          // 影響力スコア
          if (scores.impact?.score) {
            analysisData.impact.scores.push(scores.impact.score)
            analysisData.impact.topWorks.push({
              title: work.title,
              score: scores.impact.score,
              reason: scores.impact.reason,
              highlights: [scores.impact.reason]
            })
          }
        }
        // フォールバック：旧形式の場合は従来の計算を使用
        else if (analysis.strengths) {
          // 創造性分析
          if (analysis.strengths.creativity && analysis.strengths.creativity.length > 0) {
            const creativityScore = Math.min(analysis.strengths.creativity.length * 20 + 
              (analysis.tagClassification?.technique?.length || 0) * 10, 100)
            analysisData.creativity.scores.push(creativityScore)
            analysisData.creativity.insights.push(...analysis.strengths.creativity)
            analysisData.creativity.topWorks.push({
              title: work.title,
              score: creativityScore,
              highlights: analysis.strengths.creativity.slice(0, 2)
            })
          }

          // 専門性分析
          if (analysis.strengths.expertise && analysis.strengths.expertise.length > 0) {
            const expertiseScore = Math.min(analysis.strengths.expertise.length * 20 + 
              (analysis.keywords?.length || 0) * 5, 100)
            analysisData.expertise.scores.push(expertiseScore)
            analysisData.expertise.insights.push(...analysis.strengths.expertise)
            analysisData.expertise.topWorks.push({
              title: work.title,
              score: expertiseScore,
              highlights: analysis.strengths.expertise.slice(0, 2)
            })
          }

          // 影響力分析
          if (analysis.strengths.impact && analysis.strengths.impact.length > 0) {
            const impactScore = Math.min(analysis.strengths.impact.length * 20 + 
              (analysis.tagClassification?.purpose?.length || 0) * 15, 100)
            analysisData.impact.scores.push(impactScore)
            analysisData.impact.insights.push(...analysis.strengths.impact)
            analysisData.impact.topWorks.push({
              title: work.title,
              score: impactScore,
              highlights: analysis.strengths.impact.slice(0, 2)
            })
          }
        }
      }
    })

    // 各分野の総合スコアと統計を計算
    const processAnalysisData = (data: typeof analysisData.creativity, fieldName: string) => {
      const avgScore = data.scores.length > 0 ? 
        Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length) : 0
      
      const uniqueInsights = [...new Set(data.insights)].slice(0, 10)
      const topWorksRanked = data.topWorks
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)

      // スコアレベルの判定
      const getScoreLevel = (score: number) => {
        if (score >= 90) return { level: 'エキスパート', color: 'text-purple-600', bgColor: 'bg-purple-50', description: 'プロフェッショナルレベル' }
        if (score >= 80) return { level: '上級者', color: 'text-blue-600', bgColor: 'bg-blue-50', description: '高い品質' }
        if (score >= 70) return { level: '中級者', color: 'text-green-600', bgColor: 'bg-green-50', description: '標準的な品質' }
        if (score >= 60) return { level: '初級者', color: 'text-yellow-600', bgColor: 'bg-yellow-50', description: '基本的な品質' }
        return { level: 'ビギナー', color: 'text-gray-600', bgColor: 'bg-gray-50', description: '改善が必要' }
      }

      return {
        averageScore: avgScore,
        scoreLevel: getScoreLevel(avgScore),
        totalInsights: uniqueInsights.length,
        insights: uniqueInsights,
        topWorks: topWorksRanked,
        trend: data.scores.length >= 3 ? 
          (data.scores.slice(-3).reduce((sum, score) => sum + score, 0) / 3) - 
          (data.scores.slice(0, 3).reduce((sum, score) => sum + score, 0) / 3) : 0,
        fieldName
      }
    }

    return {
      creativity: processAnalysisData(analysisData.creativity, '創造性'),
      expertise: processAnalysisData(analysisData.expertise, '専門性'),
      impact: processAnalysisData(analysisData.impact, '影響力'),
      technology: processAnalysisData(analysisData.technology, '技術力'),
      overall: {
        totalWorks: works.length,
        analyzedWorks: works.filter(w => w.ai_analysis_result).length,
        comprehensiveScore: Math.round(
          (analysisData.creativity.scores.reduce((sum, score) => sum + score, 0) +
           analysisData.expertise.scores.reduce((sum, score) => sum + score, 0) +
           analysisData.impact.scores.reduce((sum, score) => sum + score, 0) +
           analysisData.technology.scores.reduce((sum, score) => sum + score, 0)) / 
          Math.max(
            analysisData.creativity.scores.length + 
            analysisData.expertise.scores.length + 
            analysisData.impact.scores.length + 
            analysisData.technology.scores.length, 1
          )
        )
      }
    }
  }

  // 作品統計を計算
  const workStats = useWorkStatistics(works)
  const hasInputs = inputs.length > 0
  const comprehensiveAnalysis = generateComprehensiveAnalysis()

  // タブの定義
  const tabs = [
    {
      id: 'outputs',
      label: 'アウトプット',
      icon: '🎨',
      disabled: works.length === 0
    },
    {
      id: 'inputs',
      label: 'インプット',
      icon: '📚',
      disabled: !hasInputs
    },
    {
      id: 'activity',
      label: 'アクティビティ',
      icon: '📈',
      disabled: false
    },
    {
      id: 'analysis',
      label: '総合分析',
      icon: '🔍',
      disabled: works.filter(w => w.ai_analysis_result).length === 0
    }
  ]
  
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
      
      const inputsWithNotes = inputs.filter(input => input.notes && input.notes.length > 20)
      const inputQualityRate = inputs.length > 0 ? (inputsWithNotes.length / inputs.length) * 100 : 0

      const uniqueRoles = new Set()
      works.forEach(work => {
        if (work.roles && Array.isArray(work.roles)) {
          work.roles.forEach(role => uniqueRoles.add(role))
        }
      })

      // 100点満点で計算
      const contentScore = Math.min((contentQualityRate / 100) * 30, 30)
      const inputScore = Math.min((inputQualityRate / 100) * 20, 20)
      const roleScore = Math.min((uniqueRoles.size / 10) * 25, 25)
      const worksScore = Math.min((works.length / 20) * 25, 25)

      return Math.round(contentScore + inputScore + roleScore + worksScore)
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

    const favoriteInputs = inputs.filter(input => input.favorite)
    const favoriteRate = inputs.length > 0 ? (favoriteInputs.length / inputs.length) * 100 : 0

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
        favoriteRate,
        avgInputRating: favoriteRate,
        availableRoles: new Set(works.flatMap(w => w.roles || [])).size,
        strengths: [
          `実績豊富（${works.length}作品の制作経験）`,
          `学習意欲旺盛（${inputs.length}件のインプット記録）`,
          favoriteRate > 20 ? '厳選したコンテンツ（お気に入り率20%以上）' : '幅広いコンテンツ摂取',
          workStats.totalWordCount > 20000 ? '豊富な文章力（2万文字以上の執筆）' : '継続的な創作活動',
          topTags.length > 5 ? '多様なスキルセット' : '専門分野への集中'
        ]
      },
      worksAnalysis: {
        works: works.slice(0, 12),
        genreDistribution: {},
        tagDistribution,
        monthlyProgress: calculateMonthlyProgress(works, inputs).map(m => ({ month: m.month, count: m.works })),
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
        monthlyInputs: calculateMonthlyProgress(works, inputs).map(m => ({ month: m.month, count: m.inputs })),
        learningInsights: {
          totalInputs: inputs.length,
          favoriteRate,
          avgRating: favoriteRate,
          topGenres
        }
      },
      growthInsights: {
        timeline: generateTimeline(works, inputs),
        productivityTrends: calculateMonthlyProgress(works, inputs),
        skillEvolution: topTags.slice(0, 8).map(tag => ({
          skill: tag,
          frequency: tagDistribution[tag] || 0,
          trend: 'stable' as const
        }))
      },
      comprehensiveAnalysis: generateComprehensiveAnalysis()
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

        const favoriteInputs = inputs.filter(input => input.favorite)
        const favoriteRate = inputs.length > 0 ? (favoriteInputs.length / inputs.length) * 100 : 0

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
            favoriteRate,
            avgRating: favoriteRate,
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

  // 総合分析セクションをレンダリング
  const renderComprehensiveAnalysisSection = () => {
    if (works.length === 0 && inputs.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <p>データがありません。</p>
          </CardContent>
        </Card>
      )
    }

    // タグを統合集計
    const tagCount: Record<string, number> = {}
    ;[...works, ...inputs].forEach((item: any) => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })

    const topTags = Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    // 傾向文生成
    const tendencySentences = () => {
      if (topTags.length === 0) return ['データ不足のため傾向を特定できません']
      return topTags.slice(0, 5).map(([tag]) => `「${tag}」に強い関心・専門性が見られます`)
    }

    return (
      <Card>
        <CardContent className="space-y-8">
          {/* 総合評価 */}
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="col-span-1 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200 flex items-center justify-center">
              <OverallScoreGauge score={comprehensiveAnalysis.overall.comprehensiveScore} />
            </div>
            <div className="col-span-2 text-sm text-indigo-800">
              <p className="mb-1 font-semibold text-gray-900">総合スコア</p>
              <p className="text-3xl font-bold text-indigo-700 mb-2">{comprehensiveAnalysis.overall.comprehensiveScore}</p>
              <p>
                分析対象作品 {comprehensiveAnalysis.overall.analyzedWorks} 件 / 全{comprehensiveAnalysis.overall.totalWorks} 件の平均スコアです。
              </p>
            </div>
          </div>

          {/* 傾向 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9c.828 0 1.5.895 1.5 2s-.672 2-1.5 2-1.5-.895-1.5-2 .672-2 1.5-2zM5 9c.828 0 1.5.895 1.5 2S5.828 13 5 13s-1.5-.895-1.5-2S4.172 9 5 9z" />
              </svg>
              クリエイターの傾向
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              {tendencySentences().map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>

          {/* top tags (バッジ表示) */}
          {topTags.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
                </svg>
                頻出タグ Top10
              </h3>
              <div className="flex flex-wrap gap-2">
                {topTags.map(([name, count]) => (
                  <span key={name} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    #{name}
                    <span className="ml-1 text-xs text-gray-600">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
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
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {targetUserId ? `${profile?.display_name || 'クリエイター'}の活動レポート` : '活動レポート'}
                </h1>
                <p className="text-gray-600 mt-1">
                  作品制作とインプットデータを基にした詳細分析
                </p>
              </div>

            </div>
          </div>

          {/* ナビゲーション */}
          <div className="mb-6 sm:mb-8">
            {/* デスクトップ用タブナビゲーション */}
            <div className="hidden sm:block">
              <div className="hidden md:flex space-x-1 bg-gray-100 rounded-lg p-1">
                {tabs.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    disabled={section.disabled}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : section.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span className="hidden md:inline">{section.label}</span>
                    {section.disabled && <span className="text-xs">(データなし)</span>}
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
                {tabs.map((section) => (
                  <option key={section.id} value={section.id} disabled={section.disabled}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div id="report-content" className="space-y-6">
            {activeSection === 'outputs' && <WorksSection works={works} workStats={workStats} analysis={comprehensiveAnalysis} />}
            {activeSection === 'inputs' && <InputsSection inputs={inputs} />}
            {activeSection === 'activity' && (
              <ActivitySection works={works} inputs={inputs} />
            )}
            {activeSection === 'analysis' && renderComprehensiveAnalysisSection()}
          </div>


        </div>
      </main>

      <MobileBottomNavigation />
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base-light-gray">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-dark-blue mx-auto mb-4"></div>
            <p className="text-gray-600">レポートを読み込み中...</p>
          </div>
        </div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  )
} 