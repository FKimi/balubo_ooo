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
      className="relative isolate overflow-hidden bg-[#F4F7FF] py-16 md:py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-white via-white/90 to-transparent" />
      <div className="pointer-events-none absolute -left-16 top-24 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-20 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* 左カラム：テキスト＆CTA */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent lg:mx-0" />
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                <span className="block leading-[1.05]">伝わるポートフォリオを、</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-clip-text leading-[1.05] text-transparent">
                  AIでかんたんに。
                </span>
              </h1>
            </div>

            <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-800 md:text-lg lg:mx-0">
              URLを貼り付けるだけで、タイトルやバナー画像、説明文などを自動で取得・入力できます。
              独自AI分析が作品ごとの強みや思考プロセスを可視化し、
              BtoB領域のライター・編集者としての専門性を、企業担当者にも伝わる形で整理します。
            </p>

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
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

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-start">
              <Button
                size="lg"
                className="w-full rounded-full bg-[#007AFF] px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-400/40 transition-all duration-300 hover:translate-y-0.5 hover:bg-[#0063CC] hover:shadow-blue-500/40 sm:w-auto"
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
                className="w-full rounded-full border border-gray-200/70 bg-white/80 px-8 py-3 text-base font-semibold text-gray-800 transition-all duration-200 hover:bg-white hover:shadow-md sm:w-auto"
              >
                <Link href="/login">ログイン</Link>
              </Button>
            </div>

            <div className="flex flex-col items-center gap-2 text-xs text-gray-600 md:flex-row md:justify-start md:text-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/60 bg-white/80 px-3 py-1 shadow-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                登録3分。作品は後から追加できます。
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/60 bg-white/80 px-3 py-1 shadow-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                すでに多くのBtoB編集者がβ版で分析体験を試しています。
              </div>
            </div>
          </div>

          {/* 右カラム：特徴カード（PCのみ表示、マスコットは未実装のため非表示） */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-blue-500/12 via-blue-500/5 to-transparent blur-3xl" />
            <div className="relative space-y-5 rounded-[36px] border border-blue-50/80 bg-white/95 p-7 shadow-[0_26px_70px_rgba(37,99,235,0.20)] backdrop-blur">
              <div className="space-y-3">
                {[
                  {
                    title: "URLを貼り付けるだけ",
                    desc: "作品ページのURLを入力するだけで必要な情報を自動取得",
                  },
                  {
                    title: "AIが作品を分析",
                    desc: "構成や意図、得意な領域を独自AIが可視化",
                  },
                  {
                    title: "ポートフォリオを共有",
                    desc: "BtoB企業にも伝わる形でプロフィールと実績をまとめて提示",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-[28px] border border-blue-50/90 bg-white px-4 py-4 shadow-sm shadow-blue-50"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100/80 shadow-[0_10px_24px_rgba(191,219,254,0.9)]">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-400 text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.45)]">
                        {`0${index + 1}`}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold tracking-tight text-gray-900">{item.title}</p>
                      <p className="text-xs leading-relaxed text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-1 rounded-3xl border border-blue-100/70 bg-blue-50/80 px-4 py-3 text-center shadow-inner shadow-blue-100/70">
                <p className="text-xs font-semibold tracking-wide text-blue-900">
                  完全無料。登録後すぐにAI分析を試せます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
