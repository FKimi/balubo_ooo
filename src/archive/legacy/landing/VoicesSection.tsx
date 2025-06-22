'use client'

interface Voice {
  name: string
  role: string
  comment: string
  avatar: string // emoji for now
}

const voices: Voice[] = [
  {
    name: '彩 S.',
    role: 'フリーライター',
    comment:
      'AI構成分析で苦手な文章構造を改善。クライアントからのリピート率が上がりました！',
    avatar: '🎨',
  },
  {
    name: '遼 K.',
    role: '編集者',
    comment:
      '見出し提案機能でタイトル作りが劇的に楽に。スピード校了が実現しました。',
    avatar: '🛠️',
  },
  {
    name: '美香 T.',
    role: 'Webメディア運営',
    comment:
      'balubo経由で優秀なライターと出会え、コンテンツ品質が向上しました。',
    avatar: '🎮',
  },
]

export default function VoicesSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto text-center max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-accent-dark-blue">利用者の声</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {voices.map((v) => (
            <div key={v.name} className="bg-base-light-gray rounded-2xl p-8 shadow">
              <div className="text-5xl mb-4">{v.avatar}</div>
              <p className="text-text-secondary italic mb-6 leading-relaxed">“{v.comment}”</p>
              <div className="font-semibold text-text-primary">{v.name}</div>
              <div className="text-sm text-text-secondary">{v.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}