'use client'

import { Header, MobileBottomNavigation } from '@/components/layout/header'

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-light-gray">
      <Header />
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <MobileBottomNavigation />
    </div>
  )
} 