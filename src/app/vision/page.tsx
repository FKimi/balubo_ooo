"use client";

import Link from "next/link";
import { Footer as SharedFooter } from "@/components/layout/Footer";

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="balubo トップページ"
          >
            <span className="text-xl font-bold tracking-tight text-blue-600">
              balubo
            </span>
          </Link>
          <nav
            className="hidden items-center space-x-6 text-sm font-medium text-gray-700 md:flex"
            aria-label="グローバルナビゲーション"
          >
            <Link
              href="/"
              className="transition-colors hover:text-blue-600"
            >
              クリエイター向け
            </Link>
            <Link
              href="/enterprise"
              className="transition-colors hover:text-blue-600"
            >
              企業向けサービス
            </Link>
          </nav>
        </div>
      </header>

      <main className="bg-[#F4F7FF]">
        {/* Hero */}
        <section className="relative isolate overflow-hidden py-20 px-4 sm:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-white via-white/80 to-transparent" />
          <div className="container mx-auto max-w-4xl">
            <div className="mb-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Vision
              </p>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                baluboが目指す世界
              </h1>
            </div>
            <p className="text-lg leading-relaxed text-gray-700">
              生成AIによって、誰でも短時間でコンテンツを作れる時代になりました。
              これからインターネットには、さらに多くのコンテンツがあふれていきます。
              だからこそ、企業は差別化のために「120点」を生み出すプロの力を必要としています。
            </p>
          </div>
        </section>

        {/* 70点と120点の話 */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                「誰でも70点」を超えていくために
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                生成AIの進化によって、誰もが一定水準のコンテンツ——いわば「70点」の記事や資料——を
                作れるようになりました。これは素晴らしいことですが、その一方で、
                世の中には似たようなコンテンツが大量に増えていきます。
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                これからの企業に求められるのは、「70点を量産すること」ではなく、
                ビジネスの文脈や業界固有の事情を深く理解した、「120点のコンテンツ」を生み出すことです。
                そこには、生成AIだけでは埋められない{" "}
                <span className="font-semibold text-blue-700">
                  ＋50点分の専門性
                </span>
                が必要になります。
              </p>
            </div>

            <div className="rounded-[32px] border border-blue-50/90 bg-white/95 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
                baluboの考える「＋50点」
              </p>
              <ul className="space-y-2 text-sm leading-relaxed text-gray-700">
                <li>・業界や領域への深い理解</li>
                <li>・意思決定の背景まで踏み込むリサーチ力</li>
                <li>・読者やステークホルダーを動かす編集設計</li>
                <li>・ビジネスインパクトを見据えたストーリーテリング</li>
              </ul>
            </div>
          </div>
        </section>

        {/* baluboが果たしたい役割 */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                専門性を可視化し、「プロの実力」を証明する
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                baluboは、クリエイターの「専門性」を可視化し、プロとしての実力を証明するための
                プラットフォームです。単なる成果物だけでなく、思考プロセスやリサーチの深さ、
                編集設計といった目に見えづらい価値を、第三者にも伝わる形にします。
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[28px] border border-blue-50/90 bg-white/95 p-6 shadow-sm">
                <h3 className="mb-3 text-base font-semibold text-gray-900">
                  企業にとって
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">
                  発注者は、クリエイターの専門性や経験値を事前に把握したうえで、
                  自社と親和性の高いプロに出会うことができます。
                  その結果、コンテンツを通じて事業を成長させる確率が高まります。
                </p>
              </div>
              <div className="rounded-[28px] border border-blue-50/90 bg-white/95 p-6 shadow-sm">
                <h3 className="mb-3 text-base font-semibold text-gray-900">
                  クリエイターにとって
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">
                  クリエイターは、自分の強みや専門性を客観的な形で示し、
                  「時間」や「文字数」ではなく、提供価値に見合った評価や条件で
                  仕事を選べるようになります。
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* 未来へのビジョン */}
        <section className="pb-24 pt-8 px-4">
          <div className="container mx-auto max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              日本から、世界へ。
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              まずは、日本のBtoB企業とプロクリエイターのあいだで、
              専門性が正当に評価される出会いを増やしていきます。
              その先には、国境を越えたコラボレーションが当たり前になる未来を見据えています。
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              グローバルのクリエイターがbaluboを使い、海外のクリエイティブが日本企業の力になる。
              日本のクリエイターが、海外企業の成長を支える。
              私たちは、そんな世界を実現する一歩として、baluboを育てていきます。
            </p>
          </div>
        </section>
      </main>

      <SharedFooter />
    </div>
  );
}


