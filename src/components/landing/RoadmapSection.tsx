'use client'

export default function RoadmapSection() {
  const roadmap = [
    { quarter: '2025 Q3', title: '公開ベータ', desc: '基本分析とポートフォリオ生成機能を提供' },
    { quarter: '2025 Q4', title: 'マッチング機能', desc: '案件フィードとAI推薦をリリース' },
    { quarter: '2026 Q1', title: 'コラボハブ', desc: 'リアルタイム共同編集とコミュニティ機能' },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-accent-dark-blue">開発ロードマップ</h2>
        <div className="space-y-6">
          {roadmap.map((item) => (
            <div key={item.quarter} className="relative pl-6 text-left">
              <div className="absolute left-0 top-1.5 w-3 h-3 bg-primary-blue rounded-full"></div>
              <h3 className="text-xl font-semibold text-text-primary">{item.quarter} — {item.title}</h3>
              <p className="text-text-secondary ml-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
