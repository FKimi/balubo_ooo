'use client'

interface FAQ {
  q: string
  a: string
}

const faqs: FAQ[] = [
  {
    q: '本当に無料で使えますか？',
    a: 'はい。基本機能（AI分析・ポートフォリオ作成・編集案件フィード）はすべて無料でご利用いただけます。将来的に追加されるプレミアム機能は別途ご案内します。',
  },
  {
    q: 'AI分析にかかる時間は？',
    a: '通常は数秒〜1分以内で結果が返ってきます。記事ボリュームやサーバー負荷によって変動する場合があります。',
  },
  {
    q: 'アップロードした記事の著作権は？',
    a: '著作権はすべてクリエイターに帰属します。baluboは許可なく作品を商用利用することはありません。',
  },
  {
    q: 'プライバシーは守られますか？',
    a: 'はい。アップロードデータは暗号化して保存され、AI分析も内部ネットワークで実行されます。',
  },
]

export default function FaqSection() {
  return (
    <section className="py-20 px-4 bg-base-light-gray">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12 text-accent-dark-blue">よくある質問</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="bg-white rounded-xl shadow p-6 group">
              <summary className="cursor-pointer list-none flex justify-between items-center text-lg font-medium text-text-primary">
                <span>{faq.q}</span>
                <span className="transform group-open:rotate-45 transition-transform text-2xl">+</span>
              </summary>
              <p className="mt-4 text-text-secondary leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}