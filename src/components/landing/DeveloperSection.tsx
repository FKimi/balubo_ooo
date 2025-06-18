"use client";

/** 開発者メッセージ & ビジョンセクション */
export default function DeveloperSection() {
  return (
    <section className="py-20 px-4 bg-base-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            クリエイターの努力が報われる場所を創りたい
          </h2>
          <p className="text-lg text-text-secondary">開発者からのメッセージ</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-base-light-gray to-primary-light-blue/10 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-accent-dark-blue to-primary-blue rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-4xl font-bold text-white">君</span>
                </div>
                <div className="text-center mt-4">
                  <h3 className="font-bold text-text-primary">君和田 文也</h3>
                  <p className="text-sm text-text-secondary">balubo 開発者</p>
                  <p className="text-xs text-text-tertiary">編集者・ライター</p>
                </div>
              </div>

              {/* Message */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg relative">
                  <div className="absolute left-0 top-8 transform -translate-x-2 w-0 h-0 border-t-[8px] border-b-[8px] border-r-[12px] border-t-transparent border-b-transparent border-r-white" />

                  <div className="space-y-4 text-text-secondary leading-relaxed">
                    <p>こんにちは、balubo開発者の君和田です。</p>
                    <p>
                      編集者として多くの素晴らしいクリエイターと仕事をする中で、<br />
                      <span className="font-semibold text-accent-dark-blue">“もっとこの人の才能が正しく評価されればいいのに”</span>
                      <br />
                      と常に感じていました。
                    </p>
                    <p>
                      クリエイターの皆さんは、作品を生み出すことには長けていても、<br />
                      <span className="text-text-primary font-medium">
                        自分の価値を言語化し、適切にアピールすること
                      </span>
                      には<br />
                      苦手意識を持つ方が多いように思います。
                    </p>
                    <p>
                      baluboは、そんなクリエイター一人ひとりの努力と経験が、<br />
                      AIの力で確かな<span className="font-semibold text-success-green">“信頼”</span>となり、<br />
                      新しいチャンスへと繋がる場所です。
                    </p>
                    <p className="text-accent-dark-blue font-semibold">
                      あなたの作品に込められた想いを、<br />
                      私たちは全力でサポートします。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="text-center mt-16">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-text-primary mb-6">私たちのビジョン</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <VisionCard
                color="accent-dark-blue"
                title="実力ある人が評価される未来"
                description="成長意欲の高い人やより実力ある人が、正当に評価・信頼される社会を目指します。"
              />
              <VisionCard
                color="primary-blue"
                title="努力の軌跡を証明できる場所"
                description="クリエイターの努力の軌跡を記録し、それが確かな価値として認められる場所を提供します。"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- helpers -------------------------------- */

function VisionCard({
  color,
  title,
  description,
}: {
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div className={`bg-${color}/5 rounded-xl p-6`}>
      <div className={`w-12 h-12 bg-${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {color === "accent-dark-blue" ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          )}
        </svg>
      </div>
      <h4 className="font-semibold text-text-primary mb-2">{title}</h4>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}
