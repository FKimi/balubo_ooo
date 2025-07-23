import React from 'react'

interface Strength {
  title: string
  description: string
}

interface AIAnalysisStrengthsProps {
  strengths: Strength[]
}

/**
 * プロフィール下部に表示する「AI分析による強み」セクション。
 * 最⼤3件の強みをカード形式で横並びに表示します。
 */
export function AIAnalysisStrengths({ strengths }: AIAnalysisStrengthsProps) {
  if (!strengths || strengths.length === 0) return null

  // 背景色をローテーション（柔らかい色）
  const bgClasses = [
    'bg-blue-50',
    'bg-green-50',
    'bg-purple-50',
  ]

  return (
    <section className="mt-8 mb-8">
      <div className="border border-gray-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>✨</span>
          <span>AI分析による強み</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {strengths.slice(0, 3).map((s, idx) => (
            <div
              key={idx}
              className={`rounded-xl ${bgClasses[idx % bgClasses.length]} p-6`}
            >
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 