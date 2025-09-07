'use client'

import { Header, MobileBottomNavigation } from './header'
import { LayoutProvider } from '@/contexts/LayoutContext'
import { GlobalModalManager } from '@/components/common/GlobalModalManager'

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
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