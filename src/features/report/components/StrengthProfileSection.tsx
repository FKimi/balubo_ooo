'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WorkData } from '@/features/work/types'

interface StrengthProfileProps {
  works: WorkData[]
}

export function StrengthProfileSection({ works }: StrengthProfileProps) {
  const totalWorks = works.length
  const types = works.map(w => (w.content_type || '').toLowerCase()).filter(Boolean)
  const uniqueTypes = new Set(types).size
  const tools = works.flatMap(w => (w.design_tools || []).map(t => String(t).toLowerCase())).filter(Boolean)
  const uniqueTools = new Set(tools).size
  const totalViews = works.reduce((sum, w) => sum + (typeof w.view_count === 'number' ? w.view_count : 0), 0)
  const avgViews = totalWorks > 0 ? Math.round(totalViews / totalWorks) : 0
  const descriptions = works.map(w => w.description || '').filter(Boolean)
  const avgDescLen = descriptions.length > 0 ? Math.round(descriptions.join('').length / descriptions.length) : 0

  const recent90Days = (() => {
    const threshold = new Date()
    threshold.setDate(threshold.getDate() - 90)
    return works.filter(w => new Date(w.created_at || '') > threshold).length
  })()

  // 活動スパン（月）
  const workSpanMonths = (() => {
    const dates = works.map(w => new Date(w.created_at || '')).filter(d => !isNaN(d.getTime()))
    if (dates.length < 2) return 0
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())))
    const latest = new Date(Math.max(...dates.map(d => d.getTime())))
    return Math.max(0, Math.round((latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 30)))
  })()

  // トップタグ（tags + ai_analysis_result.tags）
  const topTags: string[] = (() => {
    const counts: Record<string, number> = {}
    works.forEach(w => {
      const list = [...(w.tags || []), ...((w.ai_analysis_result?.tags as string[] | undefined) || [])]
      list.forEach(tag => {
        const key = String(tag).trim()
        if (!key) return
        counts[key] = (counts[key] || 0) + 1
      })
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k]) => k)
  })()

  // ペルソナ判定（決定論）
  const persona = (() => {
    if (recent90Days >= 4 || totalWorks >= 12) return '継続的にアウトプットするプロダクティブ型'
    if (uniqueTypes >= 4 || uniqueTools >= 6) return '多分野に対応するジェネラリスト型'
    if (avgDescLen >= 150) return '言語化とドキュメンテーションに強いプランナー型'
    return 'バランス型（着実に質と量を両立）'
  })()

  // 強み（ストーリー性のある表現）
  const strengths: string[] = []
  if (recent90Days >= 3) strengths.push('継続的な制作活動で安定したアウトプット力を持っている。')
  if (uniqueTypes >= 3) strengths.push('複数分野にわたる柔軟な適応力と横断的な視点を備えている。')
  if (uniqueTools >= 5) strengths.push('新しいツールや技術への習得意欲が高く、学習能力に長けている。')
  if (avgViews >= 100) strengths.push('制作物が外部から評価されやすく、成果を可視化する力が強い。')
  if (avgDescLen >= 120) strengths.push('作品の背景や意図を丁寧に言語化し、伝達力に優れている。')
  if (strengths.length === 0) strengths.push('厳選した作品で安定した品質を実現する、確実性の高い制作スタイル。')

  // 伸ばすと良い領域
  const growth: string[] = []
  if (recent90Days < 2) growth.push('制作の更新頻度を上げ、小さなアウトプットを積み重ねることで継続力を強化。')
  if (uniqueTypes <= 2) growth.push('隣接領域の案件に挑戦し、応用範囲を広げることで多様性を獲得。')
  if (avgDescLen < 80) growth.push('作品の背景や成果を丁寧に言語化し、伝達力を向上させる。')
  if (uniqueTools < 4) growth.push('最新のワークフローやツールを積極的に取り入れ、制作効率を向上させる。')
  if (avgViews < 80) growth.push('作品の訴求力を高め、より多くの人に価値を届けられるようにする。')

  // キャリアのヒント
  const careerHints: string[] = []
  if (types.some(t => ['web', 'website', 'landing', 'lp'].some(w => t.includes(w)))) {
    careerHints.push('Web/LP最適化案件でコンバージョン改善を強みにできる。')
  }
  if (types.some(t => ['ui', 'ux', 'app', 'dashboard'].some(w => t.includes(w)))) {
    careerHints.push('SaaS/アプリのUI改善やデザインシステム整備に適性。')
  }
  if (types.some(t => ['branding', 'logo', 'identity'].some(w => t.includes(w)))) {
    careerHints.push('ブランドアイデンティティ構築で上流設計に関与できる。')
  }

  // 代表作（閲覧数優先→新しさ）
  const representative = [...works]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0) || new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 3)

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">強みプロファイル</CardTitle>
        <p className="text-xs text-gray-500 mt-1">データに基づく要約と成長のヒント</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* サマリー */}
        <div className="bg-gradient-to-r from-white to-gray-50 p-4 rounded border border-gray-200">
          <p className="text-sm text-gray-800 leading-relaxed">
            {persona}。{workSpanMonths > 0 ? `約${workSpanMonths}ヶ月にわたる制作活動を通じて、` : ''}{totalWorks > 0 ? `${totalWorks}作品の制作実績` : '制作活動'}を積み重ねている。
          </p>
        </div>

        {/* エビデンスチップス */}
        <div className="flex flex-wrap gap-2">
          {recent90Days > 0 && (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">直近90日 {recent90Days}件</span>
          )}
          {avgViews > 0 && (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">平均閲覧 {avgViews}</span>
          )}
          {topTags.slice(0, 3).map((tag, i) => (
            <span key={i} className="inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-gray-700">{tag}</span>
          ))}
        </div>

        {/* 強み / 代表作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">強み</h4>
            <div className="rounded-md border border-gray-200 bg-white p-3">
              {strengths.slice(0, 3).map((s, i) => (
                <div key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span className="leading-6">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {representative.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500">代表作（根拠）</h4>
              <div className="rounded-md border border-gray-200 bg-white p-3 divide-y divide-gray-100">
                {representative.map((w, i) => (
                  <a
                    key={i}
                    href={w.external_url || `/works/${w.id}`}
                    className="group flex items-center justify-between gap-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {w.banner_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={w.banner_image_url} alt="thumb" className="h-8 w-8 rounded object-cover border border-gray-200" />
                      ) : (
                        <div className="h-8 w-8 rounded bg-gray-100 border border-gray-200" />
                      )}
                      <span className="truncate group-hover:text-blue-700">
                        {w.title || '無題'}{w.content_type ? ` ・ ${w.content_type}` : ''}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">閲覧 {w.view_count || 0}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 成長のヒント */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-500">伸ばすと良い領域</h4>
          <div className="rounded-md border border-gray-200 bg-white p-3 space-y-2">
            {(growth.length > 0 ? growth : ['継続して現在の強みを深掘りし、再現性を高める取り組みを。']).slice(0, 3).map((g, i) => (
              <div key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
                <span className="leading-6">{g}</span>
              </div>
            ))}
            {/* 行動提案 */}
            <div className="flex flex-wrap gap-2 mt-3">
              {recent90Days < 2 && (
                <a href="/works/new" className="text-xs rounded-full border border-blue-300 px-3 py-1 bg-white text-blue-700 hover:bg-blue-50 transition-colors">新しい作品を追加</a>
              )}
              {uniqueTypes <= 2 && (
                <a href="/works/new" className="text-xs rounded-full border border-blue-300 px-3 py-1 bg-white text-blue-700 hover:bg-blue-50 transition-colors">異分野に挑戦</a>
              )}
            </div>
          </div>
        </div>

        {/* キャリアの可能性 */}
        {careerHints.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">キャリアの可能性</h4>
            <div className="rounded-md border border-gray-200 bg-white p-3">
              <ul className="list-disc pl-5 space-y-1">
                {careerHints.slice(0, 2).map((c, i) => (
                  <li key={i} className="text-sm text-gray-700">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


