"use client";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";
import Link from "next/link";

export function EnterpriseHero() {
    return (
        <section className="relative isolate overflow-hidden bg-base-white pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pb-32">
            {/* Background Decor */}
            <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow"></div>
            <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow delay-1000"></div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <div className="grid w-full grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-24 xl:gap-32">
                        {/* Left Content */}
                        <FadeIn className="space-y-8 md:space-y-12 text-center lg:text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                                <span className="block leading-[1.05]">
                                    クリエイターは、<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-indigo-600">
                                        「専門性」で選ぶ時代へ。
                                    </span>
                                </span>
                            </h1>

                            <div className="mx-auto max-w-2xl space-y-6 lg:mx-0">
                                <p className="text-2xl md:text-3xl text-text-primary leading-relaxed font-bold tracking-tight">
                                    汎用的なコンテンツは、<br className="hidden md:block" />AIがつくれるようになりました。
                                </p>
                                <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                                    だからこそ、BtoB企業が本当に求めているのは「誰でも書ける70点」ではなく、
                                    業界の文脈を深く理解した<span className="font-bold text-text-primary">「120点のプロクリエイター」</span>です。
                                </p>
                                <p className="text-base text-text-secondary leading-relaxed">
                                    <span className="text-primary-blue font-bold">balubo</span>は、AIがクリエイターの「専門性」を可視化し、
                                    これまで感覚でしか伝えられなかった強みをデータとして提示します。
                                </p>
                            </div>

                            {/* 社会的証明バッジ */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-base-white/80 rounded-full border border-blue-100 shadow-soft backdrop-blur-sm">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-blue shadow-md shadow-blue-500/30">
                                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-text-secondary">ウェイトリスト受付中</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="w-full rounded-full bg-gradient-to-r from-primary-blue to-indigo-600 px-10 py-4 text-base font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 sm:w-auto border-0"
                                    >
                                        <a href="#waitlist" className="inline-flex items-center justify-center">
                                            無料でウェイトリストに登録
                                            <svg
                                                className="ml-2 h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                />
                                            </svg>
                                        </a>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="lg"
                                        className="w-full rounded-full px-10 py-4 text-base font-semibold text-text-secondary hover:bg-gray-50 hover:text-text-primary sm:w-auto"
                                    >
                                        <a href="#why">サービスを見る</a>
                                    </Button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start text-sm text-text-tertiary">
                                    <span className="flex items-center justify-center lg:justify-start">
                                        <svg className="mr-1.5 h-4 w-4 text-primary-blue" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        ベータ版無料
                                    </span>
                                    <span className="flex items-center justify-center lg:justify-start">
                                        <svg className="mr-1.5 h-4 w-4 text-primary-blue" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        クレジットカード不要
                                    </span>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Right Visual：BtoB企業 ⇄ balubo ⇄ プロクリエイター */}
                        <FadeIn delay={0.2} className="flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-2xl">
                                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-blue-500/10 via-blue-200/40 to-indigo-300/30 blur-3xl" />
                                <div className="relative rounded-[40px] border border-white/50 bg-base-white/60 backdrop-blur-xl px-6 py-10 shadow-soft-xl ring-1 ring-gray-900/5">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch relative z-10">
                                        {/* BtoB企業 */}
                                        <div className="flex flex-col items-center rounded-2xl bg-base-white/80 px-6 py-8 text-center shadow-soft border border-blue-50">
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 shadow-clay">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-blue to-indigo-600 text-white shadow-md">
                                                    <svg
                                                        className="h-6 w-6"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={1.8}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4H11v17H4Z" />
                                                        <path d="M13 21V8.5A1.5 1.5 0 0 1 14.5 7H19a1 1 0 0 1 1 1v13h-7Z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-text-primary md:text-base">
                                                BtoB企業
                                            </p>
                                        </div>

                                        {/* balubo */}
                                        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary-blue to-indigo-600 px-4 py-6 text-center text-white shadow-soft-lg relative overflow-hidden">
                                            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                                            <span className="mb-3 rounded-full bg-white/20 px-4 py-1 text-xs font-bold tracking-wide md:text-sm backdrop-blur-sm border border-white/10">
                                                balubo
                                            </span>
                                            <p className="text-sm font-bold md:text-base leading-tight">
                                                専門性で<br />マッチング
                                            </p>
                                            <div className="mt-3 flex gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce delay-100"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce delay-200"></div>
                                            </div>
                                        </div>

                                        {/* プロクリエイター */}
                                        <div className="flex flex-col items-center rounded-2xl bg-base-white/80 px-6 py-8 text-center shadow-soft border border-blue-50">
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 shadow-clay">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                                                    <svg
                                                        className="h-6 w-6"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={1.8}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx="12" cy="8" r="3" />
                                                        <circle cx="6" cy="11" r="2.2" />
                                                        <circle cx="18" cy="11" r="2.2" />
                                                        <path d="M4 19a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-text-primary md:text-base">
                                                プロクリエイター
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
