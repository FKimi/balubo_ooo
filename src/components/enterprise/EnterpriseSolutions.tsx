"use client";

import { FadeIn } from "@/components/ui/motion";

export function EnterpriseSolutions() {
    return (
        <section className="bg-base-soft-blue py-20 md:py-28 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-100/30 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <FadeIn className="text-left mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
                            なぜ、baluboなら<br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-indigo-600">この悩みを解決できる</span>のか？
                        </h2>
                        <p className="text-lg text-text-secondary mt-4">
                            「いいコンテンツなのに伝わりきらない」「業界が分かるライターが見つからない」
                            「成果を説明しづらい」。こうした悩みに、2つのコア技術で応えます。
                        </p>
                    </FadeIn>
                    <div className="grid md:grid-cols-2 gap-8">
                        <FadeIn delay={0.1} className="group relative bg-gradient-to-br from-blue-50/50 to-white rounded-[32px] p-8 md:p-10 border border-blue-100/50 hover:border-blue-300 shadow-soft hover:shadow-soft-lg transition-all duration-300 backdrop-blur-sm">
                            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-primary-blue to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">1</div>
                            <div className="mb-6">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 shadow-clay group-hover:scale-105 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-blue to-indigo-600 flex items-center justify-center text-white shadow-md">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-text-primary mb-3">独自の「専門性解析AI」</h3>
                            </div>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                ポートフォリオ、執筆記事、クライアント評価などをAIが多角的に解析し、
                                「業界・想定顧客・課題・成果」といった観点で構造化。良いコンテンツの「どこが効いているのか」を
                                データとして可視化することで、社内への説明や振り返りがしやすくなります。
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary-blue shadow-sm"></div>
                                    <span className="text-text-secondary">業界特化度・専門性の定量評価（どの領域に強いかが一目で分かる）</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary-blue shadow-sm"></div>
                                    <span className="text-text-secondary">コンテンツの「狙い」と「成果」の紐づけ</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary-blue shadow-sm"></div>
                                    <span className="text-text-secondary">プロジェクト成功率の予測・振り返りに使えるレポート出力</span>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2} className="group relative bg-gradient-to-br from-gray-50/50 to-white rounded-[32px] p-8 md:p-10 border border-gray-200/50 hover:border-gray-400 shadow-soft hover:shadow-soft-lg transition-all duration-300 backdrop-blur-sm">
                            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-gray-900/30">2</div>
                            <div className="mb-6">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-clay group-hover:scale-105 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white shadow-md">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-text-primary mb-3">業界プロの「信頼の紹介」</h3>
                            </div>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                BtoB領域で実績のあるプロクリエイターが、自身のネットワークから信頼できる仲間を推薦。
                                「業界の文脈が分かるか」「技術や商習慣への理解があるか」といった、AIだけでは判断しづらい部分を
                                人の目で補完することで、「最初から話が早い」パートナー候補に出会えます。
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-gray-900 shadow-sm"></div>
                                    <span className="text-text-secondary">実績あるプロによる推薦（業界やテーマごとの得意領域が明確）</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-gray-900 shadow-sm"></div>
                                    <span className="text-text-secondary">「この人に任せれば大丈夫」という安心感のある出会い</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-gray-900 shadow-sm"></div>
                                    <span className="text-text-secondary">AI＋人の目で、専門性と相性の両方を担保</span>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}

