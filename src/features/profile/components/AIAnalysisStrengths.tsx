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
              className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:scale-[1.02] hover:border-blue-300"
            >
              <h3 className="text-lg font-bold mb-2 text-blue-900">{s.title}</h3>
              <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 