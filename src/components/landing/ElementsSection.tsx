'use client'

export default function ElementsSection() {
  const elements = [
    {
      icon: '💡',
      title: '創造性と独自性',
      subtitle: 'オリジナリティ',
      description: '作品の独創性や新しい視点を分析し、差別化ポイントを明確化します。',
    },
    {
      icon: '🛠️',
      title: '専門性とスキル',
      subtitle: 'クオリティ',
      description: '専門知識や技術的熟練度を評価し、完成度を客観的に測定します。',
    },
    {
      icon: '📣',
      title: '影響力と共感',
      subtitle: 'エンゲージメント',
      description: '作品が与える影響力や共感性を分析し、感情的つながりを可視化します。',
    },
  ]

  return (
    <section className="py-20 px-4 bg-base-light-gray/60">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-accent-dark-blue">
          AIがあなたの作品を多角的に分析
        </h2>
        <p className="text-text-secondary text-lg md:text-xl mb-12 leading-relaxed">
          3つの要素を総合的に評価し、あなたの多面的な価値と魅力を発見します。
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {elements.map((el) => (
            <div key={el.title} className="bg-white rounded-2xl p-8 shadow">
              <div className="text-5xl mb-4">{el.icon}</div>
              <h3 className="text-xl font-semibold mb-1 text-text-primary">{el.title}</h3>
              <p className="text-sm font-medium text-primary-blue mb-3">{el.subtitle}</p>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {el.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
