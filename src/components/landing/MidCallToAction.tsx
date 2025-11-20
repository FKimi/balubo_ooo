"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { FadeIn } from "@/components/ui/motion";

export default function MidCallToAction() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container relative mx-auto max-w-4xl px-6 text-center">
        <FadeIn>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            あなたの実績を、<br className="sm:hidden" />
            もっと魅力的に。
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            baluboを使えば、あなたの専門性と実績を<br className="hidden sm:block" />
            誰にでも分かりやすく可視化できます。
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-y-4 sm:flex-row sm:gap-x-6">
            <Button
              asChild
              size="lg"
              className="h-14 w-full rounded-full bg-blue-600 px-8 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:scale-105 sm:w-auto"
            >
              <Link href="/register">
                無料で専門性を見てみる
              </Link>
            </Button>
            <p className="text-sm text-gray-500 sm:hidden">
              登録は1分、クレジットカード不要
            </p>
          </div>

          <div className="mt-10 hidden items-center justify-center gap-6 text-sm text-gray-500 sm:flex">
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              登録は1分、クレジットカード不要
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              いつでも退会可能
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
