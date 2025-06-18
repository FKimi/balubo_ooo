"use client";

/** クリエイターの声セクション */
export default function VoicesSection() {
  return (
    <section className="py-20 px-4 bg-base-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            挑戦を形にしたクリエイターの声
          </h2>
          <p className="text-lg text-text-secondary">
            baluboで努力の軌跡を可視化したクリエイターのリアルな声をご紹介します
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <VoiceCard
            gradient="from-accent-dark-blue to-primary-blue"
            initial="A"
            name="A.Tanaka さん"
            role="フリーランスデザイナー"
            color="accent-dark-blue"
            comment="baluboのAI分析は衝撃でした！自分のデザインの傾向を客観的な言葉で示してくれて、クライアントへの提案にも自信が持てるように。もっと早く出会いたかった！"
            tags={["自己理解深化", "提案力向上"]}
          />

          {/* Card 2 */}
          <VoiceCard
            gradient="from-success-green to-info-blue"
            initial="K"
            name="K.Sato さん"
            role="副業ライター"
            color="success-green"
            comment="作品を登録しておくだけで、AIが強みをまとめてくれるのが本当に助かります。おかげで新しいジャンルの執筆依頼も舞い込むようになりました！"
            tags={["作業効率化", "新規案件獲得"]}
          />

          {/* Card 3 */}
          <VoiceCard
            gradient="from-warning-yellow to-info-blue"
            initial="M"
            name="M.Yamada さん"
            role="動画クリエイター"
            color="warning-yellow"
            comment="クリエイター同士のつながりが本当に価値ある！他の方の作品から刺激を受けて、自分の表現の幅も広がりました。質の高いコミュニティです。"
            tags={["コミュニティ", "表現力向上"]}
          />
        </div>

        {/* Meta */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-accent-dark-blue/5 rounded-full px-6 py-3">
            <svg
              className="w-5 h-5 text-accent-dark-blue mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <span className="text-accent-dark-blue font-medium">ユーザー満足度 94%</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- helpers -------------------------------- */

function VoiceCard({
  gradient,
  initial,
  name,
  role,
  color,
  comment,
  tags,
}: {
  gradient: string;
  initial: string;
  name: string;
  role: string;
  color: string;
  comment: string;
  tags: string[];
}) {
  return (
    <div
      className={`bg-gradient-to-br from-base-light-gray to-primary-light-blue/10 rounded-2xl p-8 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center mb-6">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mr-4`}>
          <span className="text-white font-bold text-lg">{initial}</span>
        </div>
        <div>
          <h4 className="font-semibold text-text-primary">{name}</h4>
          <p className="text-sm text-text-secondary">{role}</p>
        </div>
      </div>

      <blockquote className="text-text-secondary leading-relaxed mb-4 relative">
        <svg
          className={`w-6 h-6 text-${color} mb-2`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
        </svg>
        {comment}
      </blockquote>

      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className={`bg-${color}/10 text-${color} px-3 py-1 rounded-full text-xs font-medium`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
