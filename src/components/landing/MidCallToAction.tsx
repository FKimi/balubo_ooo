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
              variant="cta"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/register">無料で始める</Link>
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
