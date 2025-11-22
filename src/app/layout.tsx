import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";

import { ErrorFilter } from "@/components/utils/ErrorFilter";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/common/ErrorFallback";
import { Toaster } from "react-hot-toast";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { GlobalModalManager } from "@/components/common/GlobalModalManager";
import { ToastProvider } from "@/components/ui/toast";

// フォント最適化設定
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-jp",
  preload: true,
  fallback: ["system-ui", "arial"],
  weight: ["400", "500", "600", "700"], // 必要な重みのみ読み込み
});

const mPlusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-m-plus-rounded",
  preload: true,
  weight: ["400", "500", "700"],
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "balubo - クリエイターのためのポートフォリオプラットフォーム",
  description:
    "作品を共有し、つながりを深め、新しい機会を見つけよう。AIがあなたの実績を言語化し、クリエイターとしての価値を最大化します。",
  keywords: [
    "ポートフォリオ",
    "クリエイター",
    "ライター",
    "編集者",
    "AI分析",
    "キャリア支援",
    "フリーランス",
    "クリエイティブ",
  ],
  authors: [{ name: "balubo" }],
  creator: "balubo",
  publisher: "balubo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.balubo.jp"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "balubo - クリエイターのためのポートフォリオプラットフォーム",
    description:
      "作品を共有し、つながりを深め、新しい機会を見つけよう。AIがあなたの実績を言語化し、クリエイターとしての価値を最大化します。",
    url: "https://www.balubo.jp",
    siteName: "balubo",
    images: [
      {
        url: "/api/og?title=balubo&description=クリエイターのためのポートフォリオプラットフォーム&type=default",
        width: 1200,
        height: 630,
        alt: "balubo - クリエイターのためのポートフォリオプラットフォーム",
        type: "image/png",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon_b_high_res.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        url: "/icon_b_high_res.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "balubo - クリエイターのためのポートフォリオプラットフォーム",
    description:
      "作品を共有し、つながりを深め、新しい機会を見つけよう。AIがあなたの実績を言語化し、クリエイターとしての価値を最大化します。",
    images: [
      "/api/og?title=balubo&description=クリエイターのためのポートフォリオプラットフォーム&type=default",
    ],
    creator: "@AiBalubo56518",
    site: "@AiBalubo56518",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Google Search Consoleの検証コード
  },
  category: "technology",
  classification: "portfolio platform",
  other: {
    "theme-color": "#3b82f6",
    "msapplication-TileColor": "#3b82f6",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "balubo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* 重要なオリジンへのpreconnectヒント */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://kdrnxnorxquxvxutkwnq.supabase.co"
        />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />

        {/* 重要なリソースの優先度設定 */}
        <link
          rel="preload"
          href="/api/og?title=balubo&description=クリエイターのためのポートフォリオプラットフォーム&type=default"
          as="image"
        />
        <link rel="icon" type="image/png" href="/icon_b_high_res.png" />
        <link
          rel="apple-touch-icon"
          type="image/png"
          href="/icon_b_high_res.png"
          sizes="512x512"
        />

        {/* クリティカルCSSのインライン化 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* クリティカルCSS - ファーストビューのみ */
            body { font-family: var(--font-m-plus-rounded), var(--font-inter), system-ui, sans-serif; }
            .font-sans { font-family: var(--font-m-plus-rounded), var(--font-inter), var(--font-noto-sans-jp), system-ui, sans-serif; }
            .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
          `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${notoSansJP.variable} ${mPlusRounded.variable} font-sans`}>
        <ErrorFilter />
        <Toaster position="top-right" />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ToastProvider>
            <AuthProvider>
              <LayoutProvider>
                <NuqsAdapter>{children}</NuqsAdapter>
                <GlobalModalManager />
              </LayoutProvider>
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
