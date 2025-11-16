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
    <section className="relative isolate overflow-hidden bg-[#F4F7FF] py-24 px-4 sm:py-28">
      <div className="container relative z-10 mx-auto max-w-4xl">
        <div className="mb-12">
          <div className="mx-auto max-w-3xl text-left">
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
              次の一歩を、baluboと一緒に踏み出しませんか？
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              いまある実績をそのまま活かして、専門性を「伝わる形」に整えるお手伝いをします。URLを登録するだけで、AIが専門性スコアと提案に使えるサマリをつくります。
            </p>
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-3xl rounded-[32px] border border-blue-50/90 bg-white/95 p-8 shadow-[0_22px_60px_rgba(37,99,235,0.16)] backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="space-y-2 md:flex-1">
              <p className="text-2xl font-semibold text-gray-900">
                まずは無料で専門性スコアを確認
              </p>
              <p className="text-sm text-gray-600">
                登録は1分、クレジットカード登録は不要です。あとから作品を少しずつ追加していくこともできます。
              </p>
            </div>
            <Button
              size="lg"
              className="w-full rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_20px_50px_rgba(37,99,235,0.35)] md:w-auto"
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
              <div
                key={feature.text}
                className="inline-flex items-center gap-2 rounded-full border border-blue-50/80 bg-blue-50/70 px-3 py-1.5"
              >
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
