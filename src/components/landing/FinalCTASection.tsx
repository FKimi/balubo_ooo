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
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24 px-4 sm:py-32">
      <div className="container relative z-10 mx-auto max-w-5xl">
        {/* CTA部分 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl leading-tight mb-8">
            その専門知識は、
            <br />
            <span className="text-blue-600">高く評価されるべき資産です。</span>
          </h2>
          
          <div className="mx-auto max-w-3xl space-y-6 mb-12">
            <p className="text-xl md:text-2xl leading-relaxed text-gray-800 font-medium">
              <span className="text-blue-600 font-bold">balubo</span>で、あなたの専門性を正しく、高く、伝えませんか？
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700">
              新しい評価、新しい仕事、新しいキャリアが、あなたを待っています。
            </p>
          </div>

          <div className="mx-auto max-w-3xl bg-gradient-to-br from-blue-50 via-blue-50/80 to-blue-50/60 border-2 border-blue-200 rounded-2xl p-8 md:p-10 mb-12">
            <p className="text-3xl md:text-4xl text-gray-900 font-bold leading-tight mb-6">
              今すぐ無料で<span className="text-blue-600">「専門性」</span>を証明する
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-base text-gray-700">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                完全無料
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                1分で登録完了
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                すぐにAI分析開始
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center mb-8">
            <Button
              size="lg"
              className="w-full max-w-md rounded-xl bg-blue-600 px-12 py-6 text-xl font-bold text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:bg-blue-700 hover:scale-105 sm:w-auto disabled:opacity-60"
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
                  今すぐ無料で「専門性スコア」を見る
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              )}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-600">
            {trustFeatures.map((feature) => (
              <div key={feature.text} className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                  {feature.icon}
                </div>
                <span className="font-medium">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* 最終メッセージ */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <blockquote className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                &quot;あなたの本当の価値を、世界はまだ知らない&quot;
              </p>
              <p className="text-xl md:text-2xl text-gray-700 mb-4">
                — 今日から、それを変えてみませんか？
              </p>
              <p className="text-xl md:text-2xl text-blue-600 font-bold">
                専門性を伝えるなら、balubo
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
