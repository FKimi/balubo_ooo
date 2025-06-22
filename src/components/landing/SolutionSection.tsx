'use client'

export default function SolutionSection() {
  const solutions = [
    {
      icon: '⚡️',
      title: 'ポートフォリオ自動生成',
      description: '作品URLを入力するだけでポートフォリオを自動生成。手間と時間を大幅削減します。',
    },
    {
      icon: '🔍',
      title: 'AIによる客観的分析',
      description: 'AIが専門性・スタイル・ユニークさを多角的に分析し、客観的な指標を提供します。',
    },
    {
      icon: '🤝',
      title: 'ミスマッチの解消',
      description: '分析結果を基に最適な案件とマッチングし、クリエイターと発注者のギャップを解消します。',
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-accent-dark-blue">
          その悩み、BaluboがAIで解決します
        </h2>
        <p className="text-text-secondary text-lg md:text-xl mb-12 leading-relaxed">
          AI分析型ポートフォリオサービス「Balubo」は、URL入力だけであなたの真の価値を客観的に可視化します。
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((sol) => (
            <div
              key={sol.title}
              className="bg-base-light-gray rounded-2xl p-8 shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-5xl mb-4">{sol.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-text-primary">{sol.title}</h3>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {sol.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
