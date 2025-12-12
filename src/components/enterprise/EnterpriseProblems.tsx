"use client";

import { FadeIn } from "@/components/ui/motion";

export function EnterpriseProblems() {
    return (
        <section className="bg-base-soft-blue py-20 px-4 md:py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/4 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow"></div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <FadeIn className="mx-auto mb-14 max-w-5xl text-left">
                    <h2 className="text-3xl font-bold text-text-primary md:text-4xl tracking-tight">
                        こんなお悩みはありませんか？
                    </h2>
                    <p className="mt-4 text-base text-text-secondary md:text-lg">
                        BtoBのコンテンツづくりで、「なんとなくうまくいかない」「伝わりきっていない」と感じることはありませんか？
                    </p>
                </FadeIn>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* 悩み1 */}
                    <FadeIn delay={0.1} className="flex flex-col items-center rounded-[32px] border border-white/60 bg-base-white/60 backdrop-blur-sm p-8 text-center shadow-soft hover:shadow-lg transition-all duration-300">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 shadow-clay">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-blue to-blue-600 text-white shadow-md">
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 4h14v2H5zM7 9h10v2H7zM9 14h6v2H9z" />
                                </svg>
                            </div>
                        </div>
                        <p className="mb-2 text-lg font-bold text-text-primary md:text-xl">
                            いい記事なのに読まれない
                        </p>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            社内では好評なのに、外に出すと反応が薄い。コンテンツが「誰のどんな課題」に刺さっているのか、手応えが持てない。
                        </p>
                    </FadeIn>

                    {/* 悩み2 */}
                    <FadeIn delay={0.2} className="flex flex-col items-center rounded-[32px] border border-white/60 bg-base-white/60 backdrop-blur-sm p-8 text-center shadow-soft hover:shadow-lg transition-all duration-300">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 shadow-clay">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-blue to-blue-600 text-white shadow-md">
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 2a5 5 0 0 1 5 5v1h1a2 2 0 0 1 0 4h-1v1a5 5 0 0 1-10 0v-1H6a2 2 0 0 1 0-4h1V7a5 5 0 0 1 5-5Z" />
                                </svg>
                            </div>
                        </div>
                        <p className="mb-2 text-lg font-bold text-text-primary md:text-xl">
                            業界が分かるライターが見つからない
                        </p>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            用語や商習慣の説明から毎回スタート。業界の前提から共有しなければならず、コンテンツ制作のたびに負担が大きい。
                        </p>
                    </FadeIn>

                    {/* 悩み3 */}
                    <FadeIn delay={0.3} className="flex flex-col items-center rounded-[32px] border border-white/60 bg-base-white/60 backdrop-blur-sm p-8 text-center shadow-soft hover:shadow-lg transition-all duration-300">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 shadow-clay">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-blue to-blue-600 text-white shadow-md">
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M7 10h10M7 14h6" />
                                    <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                                </svg>
                            </div>
                        </div>
                        <p className="mb-2 text-lg font-bold text-text-primary md:text-xl">
                            成果にどうつながったか説明しづらい
                        </p>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            「このコンテンツがビジネスにどう効いたのか」を、社内や経営層にうまく説明できず、投資判断が難しい。
                        </p>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}

