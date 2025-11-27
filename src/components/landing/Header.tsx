"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* モバイルメニューボタン */}
                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </Button>
                </div>
                <Link
                    href="/"
                    className="flex items-center space-x-2"
                    aria-label="balubo トップページ"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-blue-600 tracking-tight">balubo</span>
                    </div>
                </Link>
                <nav
                    className="hidden md:flex items-center space-x-6"
                    aria-label="グローバルナビゲーション"
                    suppressHydrationWarning
                >
                    <Link
                        href="/enterprise"
                        prefetch={false}
                        className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    >
                        企業の方はこちら
                    </Link>
                    <Link
                        href="#features"
                        className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        特徴
                    </Link>
                    <Link
                        href="#analysis"
                        className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        分析指標
                    </Link>
                    <Link
                        href="#voices"
                        className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('voices')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        利用者の声
                    </Link>
                    <Button
                        asChild
                        variant="ghost"
                        className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                        <Link href="/login">ログイン</Link>
                    </Button>
                    <Button
                        asChild
                        variant="cta"
                        size="default"
                    >
                        <Link href="/register">無料で登録する</Link>
                    </Button>
                </nav>
            </div>

            {/* モバイルメニューオーバーレイ */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden overflow-y-auto">
                    <nav className="flex flex-col space-y-6 text-lg font-medium">
                        <Link
                            href="/enterprise"
                            className="text-gray-700 hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            企業の方はこちら
                        </Link>
                        <Link
                            href="#features"
                            className="text-gray-700 hover:text-blue-600"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            特徴
                        </Link>
                        <Link
                            href="#analysis"
                            className="text-gray-700 hover:text-blue-600"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            分析指標
                        </Link>
                        <Link
                            href="#voices"
                            className="text-gray-700 hover:text-blue-600"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                document.getElementById('voices')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            利用者の声
                        </Link>
                        <hr className="border-gray-100" />
                        <Link
                            href="/login"
                            className="text-gray-700 hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            ログイン
                        </Link>
                        <Button
                            asChild
                            variant="cta"
                            size="lg"
                            className="w-full"
                        >
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                無料で登録する
                            </Link>
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
}
