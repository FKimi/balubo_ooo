"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * ReasonsSection (3 Reasons)
 * `page.tsx` から抽出。構造そのまま、見た目を保ちます。
 */
export default function ReasonsSection() {
  return (
    <section className="py-20 px-4 bg-base-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            baluboで、あなたのクリエイター人生が変わる<br />
            <span className="text-accent-dark-blue">3つの理由</span>
          </h2>
          <p className="text-lg text-text-secondary">これまでにない新しい体験が、あなたを待っています</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Reason 1 */}
          <div className="text-center group lg:w-1/3 lg:-translate-y-8">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-accent-dark-blue to-primary-blue rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning-yellow rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">1</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mb-4">AIがあなたの挑戦ストーリーを深掘り</h3>

            <p className="text-text-secondary leading-relaxed mb-6">
              インプット質問フォームに答えるだけで、AI が過去の努力や成長プロセスを分析し、隠れた強みを抽出します。
            </p>

            <div className="bg-base-light-gray rounded-lg p-4">
              <p className="text-sm text-text-tertiary italic">&ldquo;自分では当たり前だと思っていたことが、実は大きな強みだったんですね！&rdquo;</p>
            </div>
          </div>

          {/* Reason 2 */}
          <div className="text-center group lg:w-1/3 lg:-translate-y-8">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-blue to-primary-light-blue rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">2</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mb-4">
              &ldquo;見せる&rdquo;ポートフォリオから、<br /> &ldquo;伝わる&rdquo;ポートフォリオへ
            </h3>

            <p className="text-text-secondary leading-relaxed mb-6">
              AI分析が加わることで、あなたの作品はただの作品集ではなく、挑戦の背景まで語る強力なツールに進化します。
            </p>

            <div className="bg-base-light-gray rounded-lg p-4">
              <p className="text-sm text-text-tertiary italic">
                &ldquo;ポートフォリオを見た人から『こんな視点があったんですね』と言われるように！&rdquo;
              </p>
            </div>
          </div>

          {/* Reason 3 */}
          <div className="text-center group lg:w-1/3 lg:-translate-y-8">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-success-green to-info-blue rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-info-blue rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">3</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mb-4">
              質の高い&ldquo;出会い&rdquo;を引き寄せ、次の挑戦へ
            </h3>

            <p className="text-text-secondary leading-relaxed mb-6">
              あなたの才能を本当に理解してくれる企業や、刺激し合える仲間と、baluboで繋がりましょう。新しいチャンスが向こうからやってきます。
            </p>

            <div className="bg-base-light-gray rounded-lg p-4">
              <p className="text-sm text-text-tertiary italic">&ldquo;想像もしていなかった分野から声をかけていただけました！&rdquo;</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-accent-dark-blue hover:bg-primary-blue text-lg px-10 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              今すぐ体験してみる
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
