import React from 'react'

interface Strength {
  title: string
  description: string
}

interface AIAnalysisStrengthsProps {
  strengths: Strength[]
  compact?: boolean
  className?: string
  variant?: 'default' | 'horizontal'
}

/**
 * プロフィール下部に表示する「AI分析による強み」セクション。
 * 最⼤3件の強みをカード形式で横並びに表示します。
 */
export function AIAnalysisStrengths({ strengths, compact = false, className = '', variant = 'default' }: AIAnalysisStrengthsProps) {
  if (!strengths || strengths.length === 0) return null

  return (
    <section className={`${compact ? 'mt-4' : 'mt-8 mb-8'} ${className}`}>
      <div className={`${compact ? 'border border-gray-200 rounded-xl p-4 sm:p-5' : 'border border-gray-200 rounded-2xl p-6'}`}>
        <h2 className={`${compact ? 'text-base' : 'text-lg'} font-semibold ${variant === 'horizontal' ? 'mb-2' : 'mb-3'} flex items-center gap-2`}>
          <span>✨</span>
          <span>AI分析による強み</span>
        </h2>
        <div className={`${variant === 'horizontal' ? 'grid grid-cols-1 md:grid-cols-3 items-stretch gap-3.5 sm:gap-4' : `grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4`}` }>
          {strengths.slice(0, 3).map((s, idx) => (
            <div
              key={idx}
              className={`${compact ? 'p-4 sm:p-5' : 'p-6'} rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-300 ${variant === 'horizontal' ? 'flex items-start gap-3 sm:gap-3.5 h-full' : 'h-full'}`}
            >
              <div className={`shrink-0 text-slate-900 font-semibold ${compact ? 'text-base' : 'text-lg'}`}>{s.title}</div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 