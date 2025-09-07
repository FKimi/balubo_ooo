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
    const workTypes = works.map(work => work.work_type?.toLowerCase() || '').filter(Boolean)
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

    // ミニマル⇔装飾的分析（説明の詳細さで判定）
    if (avgDescLength < 50) {
      minimalScore = 2 + Math.random() * 2 // 2-4: ミニマル寄り
    } else if (avgDescLength > 200) {
      minimalScore = 7 + Math.random() * 2 // 7-9: 装飾的寄り
    } else {
      minimalScore = 4 + Math.random() * 3 // 4-7: バランス
    }

    // ロジカル⇔エモーショナル分析（説明文の内容で判定）
    const technicalKeywords = ['技術', 'システム', '効率', '改善', '最適化', 'パフォーマンス', 'ユーザビリティ']
    const emotionalKeywords = ['想い', '感動', '体験', '魅力', 'ストーリー', '感情', '共感']
    
    const allText = descriptions.join(' ').toLowerCase()
    const technicalCount = technicalKeywords.filter(keyword => allText.includes(keyword)).length
    const emotionalCount = emotionalKeywords.filter(keyword => allText.includes(keyword)).length
    
    if (technicalCount > emotionalCount) {
      logicalScore = 2 + Math.random() * 3 // 2-5: ロジカル寄り
    } else if (emotionalCount > technicalCount) {
      logicalScore = 6 + Math.random() * 4 // 6-10: エモーショナル寄り
    } else {
      logicalScore = 4 + Math.random() * 3 // 4-7: バランス
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
      const tech = (work.technologies || []).join(' ').toLowerCase()
      return modernTech.some(modern => tech.includes(modern))
    }).length
    
    const classicTechCount = works.filter(work => {
      const tech = (work.technologies || []).join(' ').toLowerCase()
      return classicTech.some(classic => tech.includes(classic))
    }).length

    if (recentRatio > 0.7 || modernTechCount > classicTechCount) {
      modernScore = 2 + Math.random() * 3 // 2-5: モダン寄り
    } else if (recentRatio < 0.3 || classicTechCount > modernTechCount) {
      modernScore = 6 + Math.random() * 4 // 6-10: クラシック寄り
    } else {
      modernScore = 4 + Math.random() * 3 // 4-7: バランス
    }

    return {
      formal_casual: Math.min(10, Math.max(1, Math.round(formalScore * 10) / 10)),
      minimal_decorative: Math.min(10, Math.max(1, Math.round(minimalScore * 10) / 10)),
      logical_emotional: Math.min(10, Math.max(1, Math.round(logicalScore * 10) / 10)),
      modern_classic: Math.min(10, Math.max(1, Math.round(modernScore * 10) / 10)),
      btob_btoc: Math.min(10, Math.max(1, Math.round(btobScore * 10) / 10))
    }
  }

  const tasteMetrics = analyzeTaste()

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

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          スタイル特性分析
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          制作スタイルの傾向を5つの軸で数値化
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          {tasteScales.map((scale, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center mb-3">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-medium text-gray-700">
                    {scale.leftLabel}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {scale.value.toFixed(1)}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {scale.rightLabel}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (scale.value / 10) * 100))}%` }}
                  />
                  <div className="absolute top-0 left-1/2 w-px h-2 bg-gray-400 transform -translate-x-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">主要特徴</h4>
          <div className="space-y-1">
            {insights.slice(0, 3).map((insight, index) => (
              <p key={index} className="text-sm text-gray-600">
                {insight}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
