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
  description: '作品を共有し、つながりを深め、新しい機会を見つけよう',
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