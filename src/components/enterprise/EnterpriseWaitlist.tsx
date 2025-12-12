"use client";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";

export function EnterpriseWaitlist() {
    return (
        <section id="waitlist" className="bg-base-white py-20 md:py-32 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-full max-w-7xl">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <FadeIn>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-primary mb-8 tracking-tight leading-tight">
                            まずは、<br className="sm:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-indigo-600">
                                ウェイトリスト
                            </span>
                            に登録
                        </h2>
                        <p className="text-xl text-text-secondary mb-12 leading-relaxed max-w-2xl mx-auto">
                            現在、多くの企業様からお問い合わせをいただいており、順次ご案内しております。
                            まずはウェイトリストにご登録ください。
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-primary-blue to-indigo-600 px-12 py-6 text-lg font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
                                <a href="https://docs.google.com/forms/d/e/1FAIpQLSduddB7969fstVTNmprN0xuSeNY5HLz3wkdWkvV8i2tkTQWcQ/viewform?usp=publish-editor" target="_blank" rel="noopener noreferrer">
                                    ウェイトリストに登録する
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </Button>
                        </div>
                        <p className="mt-6 text-sm text-text-tertiary">
                            ※ 登録は無料です。いつでもキャンセル可能です。
                        </p>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
