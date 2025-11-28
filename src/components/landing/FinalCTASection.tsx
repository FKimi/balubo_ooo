"use client";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";
import Link from "next/link";

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
  return (
    <section className="bg-white py-16 sm:py-32">
      <div className="container relative z-10 mx-auto max-w-5xl">
        <FadeIn>
          <div className="mb-12">
            <div className="mx-auto md:mx-0 max-w-3xl text-center md:text-left">
              <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
                次の一歩を、baluboと一緒に踏み出しませんか？
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                いまある実績をそのまま活かして、専門性を「伝わる形」に整えるお手伝いをします。URLを登録するだけで、AIが専門性スコアと提案に使えるサマリをつくります。
              </p>
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-3xl rounded-[32px] border border-blue-50/90 bg-white/95 p-6 md:p-8 shadow-[0_22px_60px_rgba(37,99,235,0.16)] backdrop-blur-sm">
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
                asChild
                variant="cta"
                size="lg"
              >
                <Link href="/register">今すぐ無料で始める</Link>
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
        </FadeIn>
      </div>
    </section>
  );
}
