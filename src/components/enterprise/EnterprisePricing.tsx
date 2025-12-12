"use client";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";

export function EnterprisePricing() {
    return (
        <section className="bg-base-white py-20 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <FadeIn className="text-left mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary mb-6 tracking-tight">
                            料金プラン
                        </h2>
                        <p className="text-lg text-text-secondary">
                            お客様の課題や規模に合わせて、最適なプランをご提案します
                        </p>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Starter Plan */}
                        <FadeIn delay={0.1} className="flex flex-col rounded-[32px] border border-gray-200 bg-base-white p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-text-primary mb-2">スターター</h3>
                                <p className="text-sm text-text-secondary mb-6">まずはお試しで始めたい方へ</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-text-primary">¥50,000</span>
                                    <span className="text-text-secondary">/月〜</span>
                                </div>
                            </div>
                            <ul className="mb-8 space-y-4 flex-1">
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>記事制作 1本/月</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>専門性解析レポート（簡易版）</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>チャットサポート</span>
                                </li>
                            </ul>
                            <Button asChild variant="outline" className="w-full rounded-full border-gray-200 hover:bg-gray-50 hover:text-text-primary">
                                <a href="#waitlist">お問い合わせ</a>
                            </Button>
                        </FadeIn>

                        {/* Standard Plan */}
                        <FadeIn delay={0.2} className="flex flex-col rounded-[32px] border-2 border-primary-blue bg-base-white p-8 shadow-soft-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary-blue text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                人気
                            </div>
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-text-primary mb-2">スタンダード</h3>
                                <p className="text-sm text-text-secondary mb-6">本格的に運用したい方へ</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-text-primary">¥150,000</span>
                                    <span className="text-text-secondary">/月〜</span>
                                </div>
                            </div>
                            <ul className="mb-8 space-y-4 flex-1">
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>記事制作 3本/月</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>専門性解析レポート（詳細版）</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>定例ミーティング（月1回）</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Slack連携サポート</span>
                                </li>
                            </ul>
                            <Button asChild className="w-full rounded-full bg-primary-blue hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 border-0">
                                <a href="#waitlist">お問い合わせ</a>
                            </Button>
                        </FadeIn>

                        {/* Enterprise Plan */}
                        <FadeIn delay={0.3} className="flex flex-col rounded-[32px] border border-gray-200 bg-base-white p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-text-primary mb-2">エンタープライズ</h3>
                                <p className="text-sm text-text-secondary mb-6">大規模な組織・プロジェクト向け</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-text-primary">要お問い合わせ</span>
                                </div>
                            </div>
                            <ul className="mb-8 space-y-4 flex-1">
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>記事制作 本数無制限</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>カスタマイズ解析レポート</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>専任担当者アサイン</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-text-secondary">
                                    <svg className="w-5 h-5 text-primary-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>API連携・SSO対応</span>
                                </li>
                            </ul>
                            <Button asChild variant="outline" className="w-full rounded-full border-gray-200 hover:bg-gray-50 hover:text-text-primary">
                                <a href="#waitlist">お問い合わせ</a>
                            </Button>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
