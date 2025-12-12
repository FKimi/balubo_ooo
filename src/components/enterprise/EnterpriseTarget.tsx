"use client";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";

export function EnterpriseTarget() {
    return (
        <section className="bg-base-soft-blue py-20 md:py-32 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/4 right-1/4 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <FadeIn className="text-left mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary mb-6 tracking-tight">
                            こんな方に<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-indigo-600">おすすめ</span>です
                        </h2>
                        <p className="text-lg text-text-secondary">
                            baluboは、BtoB領域でコンテンツ制作に関わるすべての方を支援します
                        </p>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* スタートアップの一人広報 */}
                        <FadeIn delay={0.1} className="bg-base-white/80 backdrop-blur-sm rounded-[32px] p-8 border border-gray-200/50 hover:border-blue-600/50 hover:shadow-soft-lg transition-all duration-300 shadow-soft">
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-clay">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-blue to-indigo-600 flex items-center justify-center text-white shadow-md">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-3">スタートアップの一人広報</h3>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                限られたリソースで、コンテンツマーケティングの成果を最大化したい方
                            </p>
                        </FadeIn>

                        {/* 自動車メーカーの広報担当者 */}
                        <FadeIn delay={0.2} className="bg-base-white rounded-[32px] p-8 border-2 border-primary-blue hover:shadow-soft-xl transition-all duration-300 shadow-soft-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-clay relative z-10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-blue to-indigo-600 flex items-center justify-center text-white shadow-md">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-3 relative z-10">自動車メーカーの広報・マーケ担当者</h3>
                            <p className="text-text-secondary leading-relaxed mb-6 relative z-10">
                                業界の深い理解が必要な専門コンテンツを制作したい方
                            </p>
                        </FadeIn>

                        {/* メディア・制作会社・代理店 */}
                        <FadeIn delay={0.3} className="bg-base-white/80 backdrop-blur-sm rounded-[32px] p-8 border border-gray-200/50 hover:border-blue-600/50 hover:shadow-soft-lg transition-all duration-300 shadow-soft">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6 shadow-clay">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white shadow-md">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-3">メディア・制作会社・代理店</h3>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                クライアントに最適なクリエイターを紹介したいプロフェッショナル
                            </p>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.4} className="mt-12 text-center">
                        <p className="text-lg text-text-secondary mb-6">
                            あなたのチームに最適な活用方法を、ご提案します
                        </p>
                        <Button asChild size="lg" className="bg-gradient-to-r from-primary-blue to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-200 border-0 rounded-full px-8">
                            <a href="#waitlist">無料で試してみる</a>
                        </Button>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}

