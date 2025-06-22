'use client'

export default function PainPointsSection() {
  const creatorPain = [
    'ポートフォリオ作成に時間がかかり、本業に集中できない',
    '自分の強みや専門性を客観的に言語化できず、自己PRが苦手',
    '作品の価値が適切に評価されているか不安',
    '自分に合った仕事かどうか判断が難しい',
  ]

  const clientPain = [
    'クリエイターの実際のスキルや専門性を見極めるのが難しい',
    'ポートフォリオだけでは仕事の質が予測できない',
    '期待した成果物と納品物にギャップがある',
    '最適なクリエイターを効率的に見つけられない',
  ]

  return (
    <section className="py-20 px-4 bg-base-light-gray">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12 text-accent-dark-blue">
          こんな悩み、ありませんか？
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* クリエイター悩み */}
          <div className="bg-white rounded-2xl p-8 shadow">
            <h3 className="text-2xl font-semibold mb-4 text-primary-blue flex items-center">
              <span className="text-3xl mr-2">🎨</span>クリエイターの悩み
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              {creatorPain.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 発注者悩み */}
          <div className="bg-white rounded-2xl p-8 shadow">
            <h3 className="text-2xl font-semibold mb-4 text-primary-blue flex items-center">
              <span className="text-3xl mr-2">📝</span>発注者の悩み
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              {clientPain.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
