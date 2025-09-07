'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WorkData } from '@/features/work/types'

interface MatchingAffinityProps {
  works: WorkData[]
}

interface ProjectMatch {
  title: string
  description: string
  matchReason: string
  compatibility: number // 1-100
  icon: string
}

interface CompanyMatch {
  companyType: string
  industry: string
  description: string
  matchReason: string
  compatibility: number // 1-100
  icon: string
}

interface MatchingAnalysis {
  projectMatches: ProjectMatch[]
  companyMatches: CompanyMatch[]
  topStrengths: string[]
  recommendedSkills: string[]
}

export function MatchingAffinitySection({ works }: MatchingAffinityProps) {
  // ポートフォリオ内容からマッチング分析を行う（実際のデータベースに基づく分析）
  const analyzeMatching = (): MatchingAnalysis => {
    if (works.length === 0) {
      return {
        projectMatches: [
          {
            title: 'ポートフォリオ制作プロジェクト',
            description: '個人や企業のブランディングサイト制作',
            matchReason: 'まずはポートフォリオを充実させることから始めましょう',
            compatibility: 85,
            icon: '📁'
          }
        ],
        companyMatches: [
          {
            companyType: 'スタートアップ企業',
            industry: 'IT・Web',
            description: '成長意欲の高い少数精鋭チーム',
            matchReason: '新しいチャレンジを積極的に取り組める環境',
            compatibility: 75,
            icon: '🚀'
          }
        ],
        topStrengths: ['学習意欲', '成長ポテンシャル', '柔軟性'],
        recommendedSkills: ['作品説明力', 'プレゼンテーション', 'ポートフォリオ構築']
      }
    }

    // 実際の作品データを詳細分析
    const workTypes = works.map(work => work.work_type?.toLowerCase() || '').filter(Boolean)
    const uniqueTypes = new Set(workTypes)
    const descriptions = works.map(work => work.description || '').filter(Boolean)
    const allDescription = descriptions.join(' ')
    const avgDescLength = descriptions.length > 0 ? allDescription.length / descriptions.length : 0
    const technologies = works.flatMap(work => work.technologies || []).filter(Boolean)
    const uniqueTechnologies = new Set(technologies.map(tech => tech.toLowerCase()))

    // 業界キーワード分析
    const industryKeywords = {
      ecommerce: ['ec', 'shop', 'ショップ', '通販', 'オンライン', '販売'],
      finance: ['金融', '銀行', '投資', 'finance', '資産', '保険'],
      healthcare: ['医療', '病院', 'health', '健康', 'クリニック'],
      education: ['教育', '学習', 'education', '学校', 'スクール'],
      entertainment: ['エンタメ', 'ゲーム', '音楽', '映画', 'entertainment'],
      corporate: ['企業', 'コーポレート', '会社', 'business', 'btob'],
      startup: ['スタートアップ', 'ベンチャー', 'startup', '新規']
    }

    const experiencedIndustries = Object.entries(industryKeywords).filter(([industry, keywords]) => 
      keywords.some(keyword => allDescription.toLowerCase().includes(keyword))
    ).map(([industry]) => industry)

    const analysis: MatchingAnalysis = {
      projectMatches: [],
      companyMatches: [],
      topStrengths: [],
      recommendedSkills: []
    }

    // 作品タイプに基づくプロジェクトマッチング（より詳細）
    const webTypes = ['web', 'サイト', 'website', 'landing', 'lp']
    const uiTypes = ['ui', 'ux', 'app', 'アプリ', 'interface', 'dashboard']
    const graphicTypes = ['graphic', 'logo', 'ロゴ', 'poster', 'ポスター', 'flyer']
    const brandingTypes = ['branding', 'ブランド', 'identity', 'ci', 'vi']

    if (workTypes.some(type => webTypes.some(web => type.includes(web)))) {
      const compatibility = 88 + (technologies.filter(tech => 
        ['react', 'vue', 'next', 'typescript'].includes(tech.toLowerCase())
      ).length * 2)
      
      analysis.projectMatches.push({
        title: 'Webサイト・ランディングページ制作',
        description: 'コーポレートサイト、ECサイト、プロモーションサイトの制作',
        matchReason: 'Web制作の豊富な実績から、多様なWebプロジェクトに対応できます',
        compatibility: Math.min(98, compatibility),
        icon: '🌐'
      })
    }

    if (workTypes.some(type => uiTypes.some(ui => type.includes(ui)))) {
      const hasModernTech = technologies.filter(tech => 
        ['figma', 'sketch', 'adobe xd', 'react', 'vue'].includes(tech.toLowerCase())
      ).length > 0
      
      analysis.projectMatches.push({
        title: 'モバイルアプリ・WebアプリUI/UX設計',
        description: 'ユーザー体験を重視したデジタルプロダクトの設計・開発',
        matchReason: 'UI/UXの専門知識と実践経験から、優れたユーザビリティを実現できます',
        compatibility: hasModernTech ? 94 : 87,
        icon: '📱'
      })
    }

    if (workTypes.some(type => graphicTypes.some(graphic => type.includes(graphic)))) {
      analysis.projectMatches.push({
        title: 'グラフィックデザイン・印刷物制作',
        description: 'ポスター、パンフレット、名刺、パッケージデザイン等',
        matchReason: 'グラフィックデザインの技術で、印象的な視覚表現を提供できます',
        compatibility: 90,
        icon: '🎨'
      })
    }

    if (workTypes.some(type => brandingTypes.some(brand => type.includes(brand)))) {
      analysis.projectMatches.push({
        title: 'ブランドアイデンティティ構築',
        description: 'ロゴ設計からトータルブランディングまでの一貫したデザイン',
        matchReason: 'ブランディングの経験から、企業価値を視覚化するスキルがあります',
        compatibility: 92,
        icon: '🏆'
      })
    }

    // 経験値と多様性に基づくマッチング
    if (works.length >= 8 && uniqueTypes.size >= 3) {
      analysis.projectMatches.push({
        title: 'クリエイティブディレクション・プロジェクト統括',
        description: '複数のクリエイター・デザイナーを統括するディレクター職',
        matchReason: '豊富な制作経験と多分野への対応力から、プロジェクト全体を管理できます',
        compatibility: 89,
        icon: '🎯'
      })
    }

    // デフォルトマッチング
    if (analysis.projectMatches.length === 0) {
      analysis.projectMatches.push({
        title: 'デジタルコンテンツ制作',
        description: 'SNS投稿、バナー、プレゼン資料等の制作業務',
        matchReason: 'クリエイティブスキルを活かして多様なコンテンツ制作に貢献できます',
        compatibility: 82,
        icon: '✨'
      })
    }

    // 企業タイプマッチング（実績に基づく）
    if (experiencedIndustries.includes('finance') || experiencedIndustries.includes('corporate')) {
      analysis.companyMatches.push({
        companyType: '大手企業・金融機関',
        industry: '金融・保険・コンサルティング',
        description: '信頼性と品質を重視する大規模組織',
        matchReason: '金融・企業分野での実績から、高い信頼性が求められる環境に適応できます',
        compatibility: 93,
        icon: '🏢'
      })
    }

    if (experiencedIndustries.includes('startup') || uniqueTechnologies.size >= 3) {
      analysis.companyMatches.push({
        companyType: 'テック系スタートアップ',
        industry: 'IT・SaaS・フィンテック',
        description: '技術革新と迅速な成長を目指すベンチャー企業',
        matchReason: '多様な技術への対応力と柔軟性から、変化の激しい環境で活躍できます',
        compatibility: 90,
        icon: '🚀'
      })
    }

    if (experiencedIndustries.includes('ecommerce') || experiencedIndustries.includes('entertainment')) {
      analysis.companyMatches.push({
        companyType: 'EC・エンタメ関連企業',
        industry: 'Eコマース・ゲーム・メディア',
        description: 'ユーザー体験を重視するBtoC向けサービス',
        matchReason: 'EC・エンタメ分野での経験から、消費者向けサービスの魅力を伝えられます',
        compatibility: 88,
        icon: '🛍️'
      })
    }

    if (uniqueTypes.size >= 4) {
      analysis.companyMatches.push({
        companyType: 'クリエイティブエージェンシー',
        industry: '広告・マーケティング・デザイン',
        description: '多様なクライアントの課題解決を行うクリエイティブ集団',
        matchReason: '幅広い制作スキルから、様々な業界・案件に対応できる汎用性があります',
        compatibility: 95,
        icon: '💡'
      })
    }

    // デフォルト企業マッチング
    if (analysis.companyMatches.length === 0) {
      analysis.companyMatches.push({
        companyType: '中小企業・地域企業',
        industry: '製造業・サービス業・小売業',
        description: '地域密着型で人とのつながりを大切にする企業',
        matchReason: '柔軟性とコミュニケーション力で、様々な業種の課題解決に貢献できます',
        compatibility: 85,
        icon: '🏪'
      })
    }

    // 強みの特定（実績ベース）
    analysis.topStrengths = ['視覚的表現力', 'クリエイティブ思考']

    if (works.length >= 10) {
      analysis.topStrengths.push('継続的な制作力')
    }
    if (avgDescLength > 100) {
      analysis.topStrengths.push('詳細な企画・説明力')
    }
    if (uniqueTypes.size >= 3) {
      analysis.topStrengths.push('多分野への適応力')
    }
    if (uniqueTechnologies.size >= 5) {
      analysis.topStrengths.push('技術的多様性')
    }
    if (experiencedIndustries.length >= 2) {
      analysis.topStrengths.push('業界理解力')
    }

    // 推奨スキル（不足分野の提案）
    analysis.recommendedSkills = []

    if (!technologies.some(tech => ['figma', 'sketch', 'adobe xd'].includes(tech.toLowerCase()))) {
      analysis.recommendedSkills.push('最新デザインツールの習得（Figma等）')
    }
    if (!workTypes.some(type => uiTypes.some(ui => type.includes(ui)))) {
      analysis.recommendedSkills.push('UI/UXデザインスキル')
    }
    if (avgDescLength < 50) {
      analysis.recommendedSkills.push('企画書・提案書作成スキル')
    }
    if (uniqueTypes.size <= 2) {
      analysis.recommendedSkills.push('他分野デザインへの挑戦')
    }

    // 基本的な推奨スキル
    analysis.recommendedSkills.push('クライアントコミュニケーション')
    analysis.recommendedSkills.push('プロジェクト管理')

    return analysis
  }

  const analysis = analyzeMatching()

  const getCompatibilityColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-blue-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const getCompatibilityBgColor = (score: number): string => {
    if (score >= 90) return 'bg-green-50 border-green-200'
    if (score >= 80) return 'bg-blue-50 border-blue-200'
    if (score >= 70) return 'bg-yellow-50 border-yellow-200'
    return 'bg-gray-50 border-gray-200'
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          適性評価
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          専門性に基づく適合プロジェクトと企業タイプ
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">適合プロジェクト</h4>
          <div className="space-y-3">
            {analysis.projectMatches.slice(0, 2).map((project, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{project.title}</h5>
                  <span className="text-sm font-semibold text-blue-600">{project.compatibility}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-1 mb-3">
                  <div 
                    className="bg-blue-600 h-1 rounded transition-all duration-300"
                    style={{ width: `${project.compatibility}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">{project.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">適合企業タイプ</h4>
          <div className="space-y-3">
            {analysis.companyMatches.slice(0, 2).map((company, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-gray-900">{company.companyType}</h5>
                    <span className="text-xs text-gray-500">{company.industry}</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{company.compatibility}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-1 mb-3">
                  <div 
                    className="bg-blue-600 h-1 rounded transition-all duration-300"
                    style={{ width: `${company.compatibility}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">{company.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">主要スキル</h4>
            <div className="space-y-2">
              {analysis.topStrengths.slice(0, 3).map((strength, index) => (
                <div key={index} className="text-sm text-gray-600 border-l-2 border-blue-600 pl-3">
                  {strength}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">発展領域</h4>
            <div className="space-y-2">
              {analysis.recommendedSkills.slice(0, 3).map((skill, index) => (
                <div key={index} className="text-sm text-gray-600 border-l-2 border-gray-300 pl-3">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
