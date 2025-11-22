"use client";

import { Suspense } from "react";
import { Header, MobileBottomNavigation } from "./header";
import { GlobalSidebar } from "./GlobalSidebar";

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Desktop: Sidebar + Main Area Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Left Sidebar - Full Height */}
        <GlobalSidebar />

        {/* Right Side: Header + Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header - Fixed at top of right side */}
          <Header />

          {/* Main Content - Scrollable */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile/Tablet: Traditional Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pb-20">{children}</main>
        <Suspense fallback={null}>
          <MobileBottomNavigation />
        </Suspense>
      </div>
    </>
  );
}

export function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutContent>{children}</LayoutContent>;
}
