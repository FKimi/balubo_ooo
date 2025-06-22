'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Feature {
  icon: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: '🧠',
    title: 'AI構成分析',
    description: '文章構成・トーン・語彙をAIが解析し、改善ポイントを可視化します。',
  },
  {
    icon: '🏷️',
    title: '見出し＆キーワード提案',
    description: '記事内容をもとにSEOに強い見出しとキーワードを自動生成。',
  },
  {
    icon: '📑',
    title: '実績ポートフォリオ自動最適化',
    description: 'ジャンル別に原稿を整理し、編集者が求める情報をわかりやすくレイアウト。',
  },
  {
    icon: '📰',
    title: '編集案件フィード',
    description: '媒体・出版社からの最新募集をチェックし、ワンクリックで応募。',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-base-light-gray">
      <div className="container mx-auto text-center max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-accent-dark-blue">主要機能</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="shadow hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="text-4xl mb-2">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}