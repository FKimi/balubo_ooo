"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FaqSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-base-light-gray via-base-white to-primary-light-blue/5">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">よくあるご質問</h2>
          <p className="text-lg text-text-secondary">baluboについて、よく寄せられる質問にお答えします</p>
        </div>

        <div className="space-y-4">
          {faqItems.map(({ q, a }, idx) => (
            <details
              key={q}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-dark-blue transition-colors">
                  {q}
                </h3>
                <svg
                  className="w-5 h-5 text-text-tertiary group-hover:text-accent-dark-blue transition-all duration-300 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-border-color">
                <p className="text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: a.replace(/\n/g, "<br />") }} />
              </div>
            </details>
          ))}
        </div>

        <div className="mt-20">
          <div className="bg-gradient-to-r from-accent-dark-blue to-primary-blue text-white rounded-2xl p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <h3 className="text-2xl font-bold mb-2">ご不明点はお気軽にお問い合わせください</h3>
            <p className="opacity-90 mb-6 max-w-xl">
              お気軽にお問い合わせください。クリエイターの皆様のご質問にお答えいたします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:ml-auto">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                お問い合わせ
              </Button>
              <Link href="/register">
                <Button size="lg" className="bg-white text-accent-dark-blue hover:bg-base-light-gray">
                  無料で balubo を試す
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* FAQデータ */
const faqItems = [
  {
    q: "本当に無料で利用できますか？",
    a:
      "はい、baluboは完全無料でご利用いただけます。登録料、月額費用、機能利用料など、一切の費用はかかりません。クリエイターの皆様に気軽にお試しいただき、価値を感じていただくことを最優先にしています。",
  },
  {
    q: "AIはどんな作品を分析できますか？",
    a:
      "現在、テキストベースの作品（記事、コピー、企画書など）を中心に分析を行っています。画像や動画作品の場合は、作品の説明文や制作背景から分析を行います。今後、より多様な形式の作品に対応予定です。",
  },
  {
    q: "作品や個人情報のセキュリティは大丈夫ですか？",
    a:
      "セキュリティを最重要視しています。すべてのデータは暗号化されて保存され、厳格なアクセス制御のもと管理されています。また、作品の公開範囲は細かく設定でき、非公開での利用も可能です。個人情報の取り扱いについても、プライバシーポリシーに従って適切に管理いたします。",
  },
  {
    q: "必ず仕事の依頼がくるのでしょうか？",
    a:
      "baluboは仕事の確約をするサービスではありません。しかし、AI分析により自分の強みを明確にし、魅力的なポートフォリオを作成することで、より多くの機会につながりやすくなります。現在は主にクリエイター同士のネットワーキングに焦点を当てており、将来的に企業とのマッチング機能も予定しています。",
  },
  {
    q: "どんなクリエイターが利用していますか？",
    a:
      "ライター、編集者、デザイナー、カメラマン、動画クリエイターなど、幅広い分野のクリエイターにご利用いただいています。フリーランス、副業、転職を検討中の方まで、経験やキャリアステージも様々です。共通しているのは、自分の価値をより効果的に伝えたいという想いを持つ方々です。",
  },
];
