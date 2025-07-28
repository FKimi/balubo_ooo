import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

import { ErrorFilter } from '@/components/utils/ErrorFilter'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'react-hot-toast'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'balubo - クリエイターのためのポートフォリオプラットフォーム',
  description: '作品を共有し、つながりを深め、新しい機会を見つけよう。AIがあなたの実績を言語化し、クリエイターとしての価値を最大化します。',
  keywords: ['ポートフォリオ', 'クリエイター', 'ライター', '編集者', 'AI分析', 'キャリア支援', 'フリーランス', 'クリエイティブ'],
  authors: [{ name: 'balubo' }],
  creator: 'balubo',
  publisher: 'balubo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.balubo.jp'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'balubo - クリエイターのためのポートフォリオプラットフォーム',
    description: '作品を共有し、つながりを深め、新しい機会を見つけよう。AIがあなたの実績を言語化し、クリエイターとしての価値を最大化します。',
    url: 'https://www.balubo.jp',
    siteName: 'balubo',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'balubo - クリエイターのためのポートフォリオプラットフォーム',
        type: 'image/svg+xml',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'balubo - クリエイターのためのポートフォリオプラットフォーム',
    description: '作品を共有し、つながりを深め、新しい機会を見つけよう。AIがあなたの実績を言語化し、クリエイターとしての価値を最大化します。',
    images: ['/og-image.svg'],
    creator: '@AiBalubo56518',
    site: '@AiBalubo56518',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Google Search Consoleの検証コード
  },
  category: 'technology',
  classification: 'portfolio platform',
  other: {
    'theme-color': '#3b82f6',
    'msapplication-TileColor': '#3b82f6',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'balubo',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <ErrorBoundary FallbackComponent={ErrorFilter}>
          <AuthProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 