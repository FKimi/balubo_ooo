"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useScrollProgress } from "@/hooks";
import {
  HeroSection,
  CreatorPainSection,
  WhyBaluboSection,
  FeaturesSection,
  VoicesSection,
  MidCallToAction,
  FinalCTASection,
} from "@/components/landing";
import SectionDivider from "@/components/landing/SectionDivider";
import StickyCTA from "@/components/landing/StickyCTA";
import FAQSection from "@/components/landing/FAQSection";
import RecommendedSection from "@/components/landing/RecommendedSection";
import { Footer as SharedFooter } from "@/components/layout/Footer";

// Footer moved to shared component

function ScrollProgressBar() {
  const [mounted, setMounted] = useState(false);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    setMounted(true);
  }, []);

  // ScrollProgressBarはwindowオブジェクトを使うため、クライアント専用
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-[#0A66C2] transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  // クライアントサイドでマウントされたかを追跡
  const [isClient, setIsClient] = useState(false);

  // コンポーネントがクライアントでマウントされたことを記録
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ログイン済みユーザーはプロフィールページにリダイレクト
  useEffect(() => {
    if (isClient && !loading && user) {
      router.push("/profile");
    }
  }, [isClient, user, loading, router]);

  // 🔑 重要: サーバーとクライアントの初回レンダリングを統一
  // isClient が false の間（サーバー＆クライアント初回レンダリング）は、
  // loading や user の状態に関わらず、常に同じUI（ランディングページ）を表示する
  // これにより Hydration Error を回避

  return (
    <div className="bg-white">
      {/* アクセシビリティ: キーボード操作ユーザー向けにメインコンテンツへ直接移動できるスキップリンクを追加 */}
      <button
        onClick={() => {
          const mainElement = document.getElementById('main');
          if (mainElement) {
            mainElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        メインコンテンツへスキップ
      </button>
      {/* TODO: ヘッダーもコンポーネントに分離する */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="balubo トップページ"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 tracking-tight">balubo</span>
            </div>
          </Link>
          <nav
            className="hidden md:flex items-center space-x-6"
            aria-label="グローバルナビゲーション"
            suppressHydrationWarning
          >
            <Link
              href="#recommended"
              className="text-sm text-gray-700 hover:text-[#0A66C2] transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('recommended')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              おすすめ
            </Link>
            <Link
              href="/enterprise"
              prefetch={false}
              className="text-sm text-gray-700 hover:text-[#0A66C2] transition-colors font-medium"
            >
              企業の方はこちら
            </Link>
            <Link
              href="#features"
              className="text-sm text-gray-700 hover:text-[#0A66C2] transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              特徴
            </Link>
            <Link
              href="#analysis"
              className="text-sm text-gray-700 hover:text-[#0A66C2] transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              分析指標
            </Link>
            <Link
              href="#voices"
              className="text-sm text-gray-700 hover:text-[#0A66C2] transition-colors font-medium"
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
              className="rounded-lg bg-[#0A66C2] text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#004182]"
            >
              <Link href="/register">無料で「AI分析レポート」を見てみる</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main id="main">
        <HeroSection />
        <SectionDivider colorClass="text-white" heightClass="h-8" />
        <RecommendedSection />
        <SectionDivider colorClass="text-gray-50" heightClass="h-8" />
        <CreatorPainSection />
        <SectionDivider colorClass="text-gray-50" heightClass="h-8" />
        <WhyBaluboSection />
        <SectionDivider colorClass="text-white" heightClass="h-8" />
        <FeaturesSection />
        <SectionDivider colorClass="text-white" heightClass="h-8" />
        <MidCallToAction />
        <SectionDivider colorClass="text-[#0A66C2]" heightClass="h-8" />
        <VoicesSection />
        <SectionDivider colorClass="text-gray-50" heightClass="h-8" />
        <FAQSection />
        <SectionDivider colorClass="text-gray-50" heightClass="h-8" />
        <FinalCTASection />
      </main>

      <SharedFooter />
      <StickyCTA />
      <ScrollProgressBar />
    </div>
  );
}
