import { Metadata } from "next";
import {
  HeroSection,
  CreatorPainSection,
  WhyBaluboSection,
  FeaturesSection,
  VoicesSection,
  MidCallToAction,
  FinalCTASection,
  SectionDivider,
  StickyCTA,
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
        <MidCallToAction />
        <SectionDivider colorClass="text-base-soft-blue" heightClass="h-16" flip />

        <VoicesSection />
        <SectionDivider colorClass="text-white" heightClass="h-16" flip />

        <FAQSection />

        <FinalCTASection />
      </main>

      <SharedFooter />
      <StickyCTA />
    </div>
  );
}
