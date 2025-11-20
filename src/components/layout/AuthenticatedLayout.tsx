"use client";

import { Suspense } from "react";
import { Header, MobileBottomNavigation } from "./header";
import { Footer } from "@/components/layout/Footer";

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow pb-20 md:pb-0">{children}</main>
      <Footer />
      <Suspense fallback={null}>
        <MobileBottomNavigation />
      </Suspense>
    </>
  );
}

export function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <LayoutContent>{children}</LayoutContent>
    </div>
  );
}
