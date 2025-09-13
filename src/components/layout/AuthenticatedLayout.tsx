'use client'

import { Header, MobileBottomNavigation } from './header'
import { LayoutProvider } from '@/contexts/LayoutContext'
import { Footer } from '@/components/layout/Footer'
import { GlobalModalManager } from '@/components/common/GlobalModalManager'

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNavigation />
    </>
  )
}

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <div className="flex flex-col min-h-screen">
        <LayoutContent>{children}</LayoutContent>
      </div>
      <GlobalModalManager />
    </LayoutProvider>
  )
} 