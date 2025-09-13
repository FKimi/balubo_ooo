'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WorkData } from '@/features/work/types'

interface TasteAnalysisProps {
  works: WorkData[]
}

interface TasteMetrics {
  formal_casual: number      // フォーマル ⇔ カジュアル (1-10)
  minimal_decorative: number // ミニマル ⇔ 装飾的 (1-10)  
  logical_emotional: number  // ロジカル ⇔ エモーショナル (1-10)
  modern_classic: number     // モダン ⇔ クラシック (1-10)
  btob_btoc: number         // BtoB向け ⇔ BtoC向け (1-10)
}

export function TasteAnalysisSection({ works }: TasteAnalysisProps) {
  // 作品データからテイスト分析を行う（実際のデータベースに基づく分析）
  const analyzeTaste = (): TasteMetrics => {
    if (works.length === 0) {
      return {
        formal_casual: 5,
        minimal_decorative: 5,
        logical_emotional: 5,
        modern_classic: 5,
        btob_btoc: 5
      }
    }

    // 実際の作品データを分析
    let formalScore = 5  // 1(フォーマル) ～ 10(カジュアル)
    let minimalScore = 5 // 1(ミニマル) ～ 10(装飾的)
    let logicalScore = 5 // 1(ロジカル) ～ 10(エモーショナル)
    let modernScore = 5  // 1(モダン) ～ 10(クラシック)
    let btobScore = 5    // 1(BtoB) ～ 10(BtoC)

    // 作品タイプによる分析
    const workTypes = works.map(work => work.content_type?.toLowerCase() || '').filter(Boolean)
    const typeCount = workTypes.length

    if (typeCount > 0) {
      // フォーマル⇔カジュアル分析
      const formalTypes = ['corporate', 'business', '企業サイト', 'コーポレート', 'ビジネス']
      const casualTypes = ['sns', 'game', 'entertainment', 'ゲーム', 'エンタメ', 'イラスト']
      
      const formalTypeCount = workTypes.filter(type => 
        formalTypes.some(formal => type.includes(formal))
      ).length
      const casualTypeCount = workTypes.filter(type => 
        casualTypes.some(casual => type.includes(casual))
      ).length
      
      if (formalTypeCount > casualTypeCount) {
        formalScore = 3 + (formalTypeCount / typeCount) * 2 // 3-5範囲でフォーマル寄り
      } else if (casualTypeCount > formalTypeCount) {
        formalScore = 6 + (casualTypeCount / typeCount) * 3 // 6-9範囲でカジュアル寄り
      }

      // BtoB⇔BtoC分析
      const btobTypes = ['web', 'system', 'tool', 'dashboard', 'システム', 'ツール', 'ダッシュボード']
      const btocTypes = ['app', 'game', 'sns', 'shop', 'アプリ', 'ゲーム', 'ショップ']
      
      const btobTypeCount = workTypes.filter(type => 
        btobTypes.some(btob => type.includes(btob))
      ).length
      const btocTypeCount = workTypes.filter(type => 
        btocTypes.some(btoc => type.includes(btoc))
      ).length
      
      if (btobTypeCount > btocTypeCount) {
        btobScore = 2 + (btobTypeCount / typeCount) * 3 // 2-5範囲でBtoB寄り
      } else if (btocTypeCount > btobTypeCount) {
        btobScore = 6 + (btocTypeCount / typeCount) * 4 // 6-10範囲でBtoC寄り
      }
    }

    // 説明文による分析
    const descriptions = works.map(work => work.description || '').filter(Boolean)
    const totalDescLength = descriptions.join('').length
    const avgDescLength = descriptions.length > 0 ? totalDescLength / descriptions.length : 0

    // ミニマル⇔装飾的分析（説明の詳細さで判定・決定論的）
    if (avgDescLength <= 50) {
      minimalScore = 3 // ミニマル寄り
    } else if (avgDescLength >= 200) {
      minimalScore = 9 // 装飾的寄り
    } else {
      // 50〜200文字を 4〜7 に線形マップ
      const t = (avgDescLength - 50) / (200 - 50)
      minimalScore = 4 + t * 3
    }

    // ロジカル⇔エモーショナル分析（説明文の内容で判定）
    const technicalKeywords = ['技術', 'システム', '効率', '改善', '最適化', 'パフォーマンス', 'ユーザビリティ']
    const emotionalKeywords = ['想い', '感動', '体験', '魅力', 'ストーリー', '感情', '共感']
    
    const allText = descriptions.join(' ').toLowerCase()
    const technicalCount = technicalKeywords.filter(keyword => allText.includes(keyword)).length
    const emotionalCount = emotionalKeywords.filter(keyword => allText.includes(keyword)).length
    
    if (technicalCount > emotionalCount) {
      const dominance = Math.min(1, (technicalCount - emotionalCount) / Math.max(technicalCount, 1))
      logicalScore = 2 + dominance * 3 // 2-5: ロジカル寄り
    } else if (emotionalCount > technicalCount) {
      const dominance = Math.min(1, (emotionalCount - technicalCount) / Math.max(emotionalCount, 1))
      logicalScore = 6 + dominance * 4 // 6-10: エモーショナル寄り
    } else {
      logicalScore = 5 // バランス
    }

    // モダン⇔クラシック分析（作成日と技術スタックで判定）
    const recentWorks = works.filter(work => {
      const createdAt = new Date(work.created_at || '')
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      return createdAt > oneYearAgo
    }).length

    const recentRatio = works.length > 0 ? recentWorks / works.length : 0
    
    const modernTech = ['react', 'vue', 'next', 'typescript', 'ai', 'ml']
    const classicTech = ['jquery', 'php', 'html', 'css']
    
    const modernTechCount = works.filter(work => {
      const tech = (work.design_tools || []).join(' ').toLowerCase()
      return modernTech.some(modern => tech.includes(modern))
    }).length
    
    const classicTechCount = works.filter(work => {
      const tech = (work.design_tools || []).join(' ').toLowerCase()
      return classicTech.some(classic => tech.includes(classic))
    }).length

    // モダン⇔クラシック（決定論的スコア）
    const techTotal = modernTechCount + classicTechCount
    const modernTechRatio = techTotal > 0 ? modernTechCount / techTotal : 0.5
    const modernIndex = Math.min(1, Math.max(0, 0.6 * recentRatio + 0.4 * modernTechRatio)) // 0=クラシック,1=モダン
    // 2(モダン)〜10(クラシック)へ反転マッピング
    modernScore = 2 + (1 - modernIndex) * 8

    return {
      formal_casual: Math.min(10, Math.max(1, Math.round(formalScore * 10) / 10)),
      minimal_decorative: Math.min(10, Math.max(1, Math.round(minimalScore * 10) / 10)),
      logical_emotional: Math.min(10, Math.max(1, Math.round(logicalScore * 10) / 10)),
      modern_classic: Math.min(10, Math.max(1, Math.round(modernScore * 10) / 10)),
      btob_btoc: Math.min(10, Math.max(1, Math.round(btobScore * 10) / 10))
    }
  }

  const tasteMetrics = analyzeTaste()
  const [showDecimal, setShowDecimal] = React.useState(false)

  // リニアスケール用のデータ構造
  const tasteScales = [
    {
      leftLabel: 'フォーマル',
      rightLabel: 'カジュアル',
      value: tasteMetrics.formal_casual,
      description: 'デザインの堅さ・親しみやすさ'
    },
    {
      leftLabel: 'ミニマル',
      rightLabel: '装飾的',
      value: tasteMetrics.minimal_decorative,
      description: 'デザインのシンプルさ・複雑さ'
    },
    {
      leftLabel: 'ロジカル',
      rightLabel: 'エモーショナル',
      value: tasteMetrics.logical_emotional,
      description: '論理性・感情への訴求力'
    },
    {
      leftLabel: 'モダン',
      rightLabel: 'クラシック',
      value: tasteMetrics.modern_classic,
      description: '現代性・伝統性'
    },
    {
      leftLabel: 'BtoB向け',
      rightLabel: 'BtoC向け',
      value: tasteMetrics.btob_btoc,
      description: 'ビジネス・コンシューマー指向'
    }
  ]

  // スコアに基づく解釈テキスト生成
  const generateInsights = () => {
    const insights: string[] = []
    
    if (tasteMetrics.formal_casual > 7) {
      insights.push('カジュアルで親しみやすいアプローチを好む傾向があります。')
    } else if (tasteMetrics.formal_casual < 4) {
      insights.push('フォーマルで信頼感のあるデザインを重視する傾向があります。')
    }

    if (tasteMetrics.minimal_decorative > 7) {
      insights.push('装飾的で表現豊かなスタイルを得意とします。')
    } else if (tasteMetrics.minimal_decorative < 4) {
      insights.push('ミニマルで洗練されたデザインを追求する傾向があります。')
    }

    if (tasteMetrics.logical_emotional > 7) {
      insights.push('感情に訴えかける表現力に長けています。')
    } else if (tasteMetrics.logical_emotional < 4) {
      insights.push('論理的で構造化されたアプローチを重視します。')
    }

    if (tasteMetrics.modern_classic > 7) {
      insights.push('クラシックで時代を超越したデザインを好みます。')
    } else if (tasteMetrics.modern_classic < 4) {
      insights.push('モダンで先進的なトレンドを取り入れるのが得意です。')
    }

    if (tasteMetrics.btob_btoc > 7) {
      insights.push('BtoC向けの親しみやすいコミュニケーションが得意です。')
    } else if (tasteMetrics.btob_btoc < 4) {
      insights.push('BtoB向けの専門的で信頼性の高い表現を得意とします。')
    }

    return insights.length > 0 ? insights : ['バランスの取れた多様な表現力を持っています。']
  }

  const insights = generateInsights()

  const SummaryChips = () => (
    <div className="flex flex-wrap gap-2">
      {insights.slice(0, 3).map((insight, index) => (
        <span
          key={index}
          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700"
        >
          {insight}
        </span>
      ))}
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-gray-900">スタイル特性</CardTitle>
            <p className="text-xs text-gray-500 mt-1">5軸の傾向スコア</p>
          </div>
          <div className="flex items-center gap-2">
            <SummaryChips />
            <button
              type="button"
              onClick={() => setShowDecimal(v => !v)}
              className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-1 text-[11px] text-gray-700"
              aria-label="スコア表示切替"
              title="スコア表示切替"
            >
              {showDecimal ? '小数1桁' : '整数'}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasteScales.map((scale, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{scale.leftLabel}</span>
              <span className="text-gray-900 font-medium">{showDecimal ? scale.value.toFixed(1) : Math.round(scale.value)}</span>
              <span>{scale.rightLabel}</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, (scale.value / 10) * 100))}%` }}
                />
                <div className="absolute top-0 left-1/2 w-px h-1.5 bg-gray-400 transform -translate-x-1/2" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
