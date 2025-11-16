"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MidCallToAction() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  return (
    <section className="relative isolate overflow-hidden bg-[#F4F7FF] py-20 px-4">
      <div className="container relative mx-auto max-w-4xl">
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl lg:text-4xl">
            baluboで、あなたの専門性を可視化しませんか？
          </h2>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-700 md:text-lg">
            URLを登録するだけで、AIが記事を分析し、業界適性や専門性、思考プロセスを「伝わる言葉」に整理します。
            まずは気軽に、自分の強みがどう見えるのかを確認してみてください。
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
            <Button
              size="lg"
              className="w-full rounded-full bg-[#007AFF] px-10 py-3 text-base font-semibold text-white shadow-lg shadow-blue-400/40 transition-all duration-300 hover:translate-y-0.5 hover:bg-[#0063CC] hover:shadow-blue-500/40 sm:w-auto"
              disabled={isRedirecting}
              onClick={() => {
                setIsRedirecting(true);
                router.push("/register");
              }}
            >
              {isRedirecting ? "読み込み中…" : "無料で専門性を見てみる"}
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 text-sm text-gray-600 sm:flex-row">
            <span className="flex items-center">
              <svg className="mr-1.5 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              登録は1分、クレジットカード不要
            </span>
            <span className="flex items-center">
              <svg className="mr-1.5 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              いつでも退会可能・データの扱いも明確にご説明します
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
