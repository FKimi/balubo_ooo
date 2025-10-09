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
      "はい、基本機能は完全無料です。AI分析、プロフィール作成、専門性スコア表示など、メイン機能は全て無料でご利用いただけます。プレミアム機能も今後提供予定ですが、強制ではなく、基本機能だけでも十分にご活用いただけます。",
  },
  {
    question: "登録後、すぐに使えますか？",
    answer:
      "はい。会員登録後すぐにAI分析が開始され、3〜5分程度で専門性スコアが表示されます。実績やポートフォリオを追加登録することで、より精度の高い分析結果が得られます。",
  },
  {
    question: "クレジットカードの登録は必要ですか？",
    answer:
      "いいえ、クレジットカードの登録は一切不要です。メールアドレスのみで無料登録が完了します。課金が発生することはありませんので、安心してお試しください。",
  },
  {
    question: "個人情報は公開されますか？",
    answer:
      "いいえ。あなたが公開設定したプロフィール情報のみが表示されます。氏名、連絡先、住所などの個人情報は、あなたの許可なく公開されることは一切ありません。プライバシーは厳重に保護されています。",
  },
  {
    question: "どんなクリエイターが対象ですか？",
    answer:
      "BtoBで活動するライター、編集者、デザイナー、カメラマンなどのクリエイターが主な対象です。将来的には動画編集者、ポッドキャスター、イベントプロデューサーなども対象に拡大予定です。",
  },
  {
    question: "退会はいつでもできますか？",
    answer:
      "はい、いつでも退会可能です。マイページの設定から、ワンクリックで退会手続きが完了します。退会後、あなたの情報は完全に削除されます（法令で定められた保管期間を除く）。",
  },
  {
    question: "AIの分析は正確ですか？",
    answer:
      "baluboのAIは、数百件以上のクリエイターデータを学習しており、業界標準と照らし合わせた客観的な分析を行います。ただし、AIによる分析は参考値であり、最終的な評価はクライアントとの関係性の中で決まります。baluboは、その「見えない価値」を可視化するツールです。",
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
      className="relative bg-gradient-to-b from-white to-gray-50 py-24 px-4 md:py-32"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
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
              className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#0A66C2] transition-all duration-300"
            >
              <button
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-base md:text-lg font-semibold text-gray-900 flex-1">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-[#0A66C2] flex-shrink-0 transition-transform duration-300 ${
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
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed bg-blue-50 rounded-lg p-4 border-l-4 border-[#0A66C2]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* お問い合わせリンク */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            その他のご質問がありますか？
          </p>
          <a
            href="mailto:support@balubo.jp"
            className="inline-flex items-center gap-2 text-[#0A66C2] hover:text-[#004182] font-semibold transition-colors duration-200"
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

