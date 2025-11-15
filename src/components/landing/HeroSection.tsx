"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const trustBadges = ["BtoBライター・編集者向け", "完全無料", "登録3分で完了"];

export default function HeroSection() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-white pt-12 pb-20 md:pt-16 md:pb-28"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.98)), url('/aq7eVCeoQOBS.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-white via-white/90 to-transparent" />
      <div className="pointer-events-none absolute -left-20 top-32 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-24 h-56 w-56 rounded-full bg-indigo-200/50 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="mx-auto lg:mx-0 h-px w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block leading-[1.05]">伝わるポートフォリオ作成を、</span>
                <span className="block leading-[1.05] text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-clip-text">
                  カンタンに。
                </span>
              </h1>
            </div>

            <p className="mx-auto lg:mx-0 max-w-3xl text-lg md:text-xl text-gray-800 leading-relaxed">
              URLを登録するだけで、タイトルやバナー画像、説明文などを自動で入力できます。
              また独自AI分析機能を使えば、作品の魅力や強みを可視化。
              BtoB領域のライター・編集者の専門性を可視化するための
              AI分析型ポートフォリオです。
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-100/60 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm shadow-blue-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-start">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/40 transition-all duration-300 hover:translate-y-0.5 hover:shadow-blue-600/40"
                disabled={isRedirecting}
                onClick={() => {
                  setIsRedirecting(true);
                  router.push("/register");
                }}
              >
                {isRedirecting ? (
                  "読み込み中…"
                ) : (
                  <span className="inline-flex items-center">
                    無料登録して専門性を確認する
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-2xl border border-gray-200/70 bg-white/80 px-10 py-4 text-base font-semibold text-gray-800 transition-all duration-200 hover:bg-white hover:shadow-md"
              >
                <Link href="/login">ログイン</Link>
              </Button>
            </div>

            <div className="flex flex-col items-center gap-3 text-sm text-gray-600 md:flex-row md:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/60 bg-white/70 px-4 py-1 shadow-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                登録3分。作品は後から追加できます。
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/60 bg-white/70 px-4 py-1 shadow-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                すでに多くのBtoB編集者がβ版で分析体験を試しています。
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-[34px] bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent blur-3xl" />
            <div className="relative rounded-[34px] border border-white/60 bg-white/80 p-8 shadow-[0px_35px_90px_-40px_rgba(37,99,235,0.65)] backdrop-blur">
              <div className="space-y-6">
                {[
                  {
                    title: "URL登録だけで準備完了",
                    desc: "タイトルやバナー、説明文まで自動入力",
                  },
                  {
                    title: "独自AI分析で強み可視化",
                    desc: "思考プロセスや魅力を定量・定性で提示",
                  },
                  {
                    title: "BtoBクリエイター特化",
                    desc: "専門性を求める企業にも伝わる構成",
                  },
                ].map((item, index) => (
                  <div key={item.title} className="flex gap-4 rounded-2xl border border-blue-50/60 bg-white/90 px-4 py-3 shadow-sm shadow-blue-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/30">
                      {`0${index + 1}`}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900 tracking-tight">{item.title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-blue-100/60 bg-blue-50/80 px-5 py-4 text-center shadow-inner shadow-blue-100/50">
                <p className="text-sm font-semibold text-blue-900 tracking-wide">
                  配布中のβ版は完全無料。登録後すぐにAI分析を試せます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
