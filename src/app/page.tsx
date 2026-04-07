import { Metadata } from "next";
import {
  HeroSection,
  CreatorPainSection,
  WhyBaluboSection,
  FeaturesSection,
  VoicesSection,
  SectionDivider,
  FAQSection,
  RecentWorksSection,
} from "@/components/landing";
import { Footer as SharedFooter } from "@/components/layout/Footer";
import { Header } from "@/components/landing/Header";
import { ClientWrapper } from "@/components/landing/ClientWrapper";
import { getLatestWorks } from "@/lib/works/getLatestWorks";

export const metadata: Metadata = {
  title: "balubo - クリエイターのためのポートフォリオプラットフォーム",
  description:
    "作品を共有し、つながりを深め、新しい機会を見つけよう。AIがあなたの実績を言語化し、クリエイターとしての価値を最大化します。",
};

export default async function HomePage() {
  const works = await getLatestWorks(3);

  return (
    <div className="bg-white">
      <ClientWrapper />
      {/* アクセシビリティ: キーボード操作ユーザー向けにメインコンテンツへ直接移動できるスキップリンクを追加 */}
      <a
        href="#main"
        className="sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        メインコンテンツへスキップ
      </a>

      {/* サービス休止のお知らせ */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-start gap-3 text-sm text-amber-900">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="leading-relaxed">
              <span className="font-semibold">【重要なお知らせ】</span>
              baluboは現在、サービスの提供を一時休止しており、クローズに向けた準備を進めております。新規登録および各種機能のご利用は制限されている場合がございます。長らくご愛顧いただき、誠にありがとうございました。
            </p>
          </div>
        </div>
      </div>

      <Header />

      <main id="main">
        {/* 1. KV (Hero) - White */}
        <HeroSection />
        <SectionDivider colorClass="text-base-soft-blue" heightClass="h-16" flip />

        {/* 2. Problem (CreatorPain) - Light Blue */}
        <CreatorPainSection />

        {/* 3. Concrete Details (Features) - Light Blue */}
        <FeaturesSection />
        <SectionDivider colorClass="text-white" heightClass="h-16" flip />

        {/* 4. Solution (WhyBalubo) - White */}
        <WhyBaluboSection />
        <SectionDivider colorClass="text-base-soft-blue" heightClass="h-16" flip />

        {/* 5. Recent Works - Light Blue */}
        <RecentWorksSection initialWorks={works} />
        <SectionDivider colorClass="text-white" heightClass="h-16" flip />

        {/* 6. Detailed Elements */}
        <VoicesSection />
        <SectionDivider colorClass="text-white" heightClass="h-16" flip />

        <FAQSection />
      </main>

      <SharedFooter />
    </div>
  );
}
