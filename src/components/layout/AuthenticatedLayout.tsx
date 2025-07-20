'use client'

import { Header, MobileBottomNavigation } from './header'
import { LayoutProvider, useLayout } from '@/contexts/LayoutContext'
import { ContentTypeSelector } from '@/features/work/components/ContentTypeSelector'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isContentTypeSelectorOpen, closeContentTypeSelector } = useLayout()

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <MobileBottomNavigation />
      <ContentTypeSelector
        isOpen={isContentTypeSelectorOpen}
        onClose={closeContentTypeSelector}
      />
    </>
  )
}

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <div className="flex flex-col min-h-screen">
        <LayoutContent>{children}</LayoutContent>
      </div>
    </LayoutProvider>
  )
} 