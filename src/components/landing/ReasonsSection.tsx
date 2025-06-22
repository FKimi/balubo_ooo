'use client'

export default function ReasonsSection() {
  const reasons = [
    {
      title: 'AIが文章力を診断',
      description:
        '原稿や記事をAIが解析し、構成力・語彙力・トーンなど強みを数値化します。',
      icon: '🔍',
    },
    {
      title: '実績ポートフォリオを自動最適化',
      description:
        '分析データをもとに実績と執筆ジャンルを整理し、編集者が一目で魅力を理解できる構成を提案。',
      icon: '🎨',
    },
    {
      title: '編集案件とマッチング',
      description:
        'AI推薦エンジンが媒体のニーズとあなたの筆致を照合し、最適な編集案件を提案します。',
      icon: '🤝',
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-accent-dark-blue">
          クリエイター（ライター・編集者）がbaluboを選ぶ<strong className="text-primary-blue">3つ</strong>の理由
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="bg-base-light-gray rounded-2xl p-8 shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-5xl mb-4">{reason.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-text-primary">{reason.title}</h3>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}