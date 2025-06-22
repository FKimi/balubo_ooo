'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Step {
  icon: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    icon: '📝',
    title: '無料登録',
    description: 'メールアドレスだけで今すぐスタート。SNS連携も可能です。',
  },
  {
    icon: '📄',
    title: '記事・実績をアップロード',
    description: '過去記事や執筆サンプルをドラッグ＆ドロップで追加。',
  },
  {
    icon: '🤖',
    title: 'AI構成分析',
    description: '構成・語彙・トーンをAIが瞬時に診断し改善案を提案。',
  },
  {
    icon: '🚀',
    title: '編集案件に応募',
    description: 'おすすめの媒体募集にワンクリックでエントリー。',
  },
]

export default function StepsSection() {
  return (
    <section className="py-20 px-4 bg-primary-light-blue/50">
      <div className="container mx-auto text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-accent-dark-blue">始め方はカンタン</h2>
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {steps.map((step, idx) => (
            <div key={step.title} className="bg-white rounded-2xl p-6 shadow flex flex-col items-center">
              <div className="text-5xl mb-4">{step.icon}</div>
              <div className="text-xl font-semibold mb-2">Step {idx + 1}</div>
              <h3 className="text-lg font-medium mb-2 text-text-primary">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        <Link href="/register">
          <Button size="lg" className="bg-accent-dark-blue hover:bg-primary-blue">
            今すぐ無料で始める
          </Button>
        </Link>
      </div>
    </section>
  )
}