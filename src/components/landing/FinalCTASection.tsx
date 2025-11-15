"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const trustFeatures = [
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    text: "1分で登録完了",
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    text: "クレジットカード不要",
  },
  {
    icon: (
      <svg
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    text: "いつでも退会可能",
  },
];

export default function FinalCTASection() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white py-20 px-4 sm:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_65%)]"
        aria-hidden="true"
      />
      <div className="container relative z-10 mx-auto max-w-4xl">
        <div className="text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Final step
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl leading-tight">
            その専門知識をシンプルに証明しましょう
          </h2>
          <p className="text-lg text-gray-600">
            baluboなら、記事URLを登録するだけ。AIが専門性スコアと提案に使えるサマリを整えてくれます。
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-blue-100 bg-white/90 p-8 shadow-lg shadow-blue-500/10">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="space-y-2 md:flex-1">
              <p className="text-2xl font-semibold text-gray-900">
                今すぐ無料で専門性スコアを確認
              </p>
              <p className="text-sm text-gray-600">
                登録は1分。クレジットカード不要です。
              </p>
            </div>
            <Button
              size="lg"
              className="w-full rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-500/30 md:w-auto"
              disabled={isRedirecting}
              onClick={() => {
                setIsRedirecting(true);
                router.push("/register");
              }}
            >
              {isRedirecting ? "読み込み中…" : "無料で始める"}
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            {trustFeatures.map((feature) => (
              <div key={feature.text} className="inline-flex items-center gap-2 rounded-full border border-blue-100/80 bg-blue-50/50 px-3 py-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                  {feature.icon}
                </div>
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
