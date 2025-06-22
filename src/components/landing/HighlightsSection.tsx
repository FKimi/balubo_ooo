'use client'

export default function HighlightsSection() {
  const highlights = [
    {
      icon: '🏷️',
      title: 'タグで強みを可視化',
      description:
        '作品を記録するとAIがタグを自動付与。タグ総計からあなたの専門分野や強みが一目でわかります。',
    },
    {
      icon: '🔖',
      title: '興味・関心を可視化',
      description:
        'インプットした記事やブックマークも記録。興味タグの合計であなたの関心領域をグラフ化。',
    },
    {
      icon: '📡',
      title: 'フィードで共有',
      description:
        '作品やインプットはフィードに流れ、仲間とリアルタイムで共有。キャリアSNSのような繋がりが生まれます。',
    },
    {
      icon: '🤝',
      title: 'キャリアSNS的マッチング',
      description:
        'タグや実績を基に、あなたにマッチしたクリエイターや案件をレコメンド。新しい協業機会を創出。',
    },
    {
      icon: '📊',
      title: '詳細レポート',
      description:
        '分析結果をダッシュボードで詳細レポート化。強みや魅力を時系列で追い、成長を可視化できます。',
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-accent-dark-blue">balubo の特徴</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="bg-base-light-gray rounded-2xl p-8 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-text-primary">{item.title}</h3>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
