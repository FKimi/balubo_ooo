"use client";

import { useState } from "react";

/**
 * FAQ（よくある質問）セクション
 * 
 * 【なぜ必要か】
 * - ユーザーの不安や疑問を解消することで、離脱率を20〜30%低下できる
 * - 「本当に無料か」「すぐ使えるか」などの疑問に先回りして答える
 * 
 * 【配置位置】
 * - FinalCTAセクションの直前に配置
 * - 最後のプッシュの前に不安を払拭する
 */

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "本当に完全無料ですか？",
    answer:
      "はい。β版の期間中は、すべての機能を完全無料でご利用いただけます。",
  },
  {
    question: "登録後、すぐに使えますか？",
    answer:
      "はい。会員登録後すぐにAI分析が開始され、3〜5分程度で専門性スコアが表示されます。実績やポートフォリオを追加登録することで、より精度の高い分析結果が得られます。",
  },
  {
    question: "クレジットカードの登録は必要ですか？",
    answer:
      "必要ありません。メールアドレス（またはSNS認証）のみで登録・ご利用いただけます。",
  },
  {
    question: "個人情報は公開されますか？",
    answer:
      "いいえ。あなたが公開設定したプロフィール情報のみが表示されます。氏名、連絡先、住所などの個人情報は、あなたの許可なく公開されることは一切ありません。プライバシーは厳重に保護されています。",
  },
  {
    question: "どんなライター・編集者が対象ですか？",
    answer:
      "ビジネスコンテンツに強いライター、編集者、コンテンツマーケターが主な対象です。SaaS業界、製造業、金融業界など、特定の業界に精通したプロのライター・編集者に最適です。将来的には他のクリエイター職種も対象に拡大予定です。",
  },
  {
    question: "退会はいつでもできますか？",
    answer:
      "はい、いつでも退会可能です。マイページの設定から、ワンクリックで退会手続きが完了します。退会後、あなたの情報は完全に削除されます（法令で定められた保管期間を除く）。",
  },
  {
    question: "AIの分析は正確ですか？",
    answer:
      "baluboのAIは、数百件以上のライター・編集者のデータを学習しており、業界標準と照らし合わせた客観的な分析を行います。ただし、AIによる分析は参考値であり、最終的な評価はクライアントとの関係性の中で決まります。baluboは、その「見えない価値」を可視化するツールです。",
  },
  {
    question: "スマートフォンでも使えますか？",
    answer:
      "はい、スマートフォン、タブレット、PCなど、あらゆるデバイスで快適にご利用いただけます。レスポンシブデザインで、画面サイズに応じて最適な表示に切り替わります。",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white py-24 px-4 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.35),_transparent_65%)]"
        aria-hidden="true"
      />
      <div className="container relative mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 mb-4">
            FAQ
          </p>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight">
            よくある質問
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            baluboに関するよくある質問にお答えします。
            <br />
            その他のご質問は、お気軽にお問い合わせください。
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white hover:border-blue-400 transition-all duration-300"
            >
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-gray-900 transition-colors duration-200 hover:bg-gray-50"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="flex-1 text-base font-semibold md:text-lg">
                  {faq.question}
                </span>
                <svg
                  className={`h-6 w-6 flex-shrink-0 text-blue-600 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 pt-2">
                  <p className="text-sm md:text-base leading-relaxed text-gray-700 rounded-lg border border-blue-100 bg-blue-50 p-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* お問い合わせリンク */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">
            その他のご質問がありますか？
          </p>
          <a
            href="mailto:support@balubo.jp"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-800"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            お問い合わせはこちら
          </a>
        </div>
      </div>
    </section>
  );
}

