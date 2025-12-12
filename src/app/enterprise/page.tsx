"use client";

import { useState, useEffect } from "react";
import { Footer as SharedFooter } from "@/components/layout/Footer";
import StickyCTA from "@/components/landing/StickyCTA";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { EnterpriseHeader } from "@/components/enterprise/EnterpriseHeader";
import { EnterpriseHero } from "@/components/enterprise/EnterpriseHero";
import { EnterpriseProblems } from "@/components/enterprise/EnterpriseProblems";
import { EnterpriseSolutions } from "@/components/enterprise/EnterpriseSolutions";
import { EnterpriseTarget } from "@/components/enterprise/EnterpriseTarget";
import { EnterprisePricing } from "@/components/enterprise/EnterprisePricing";
import { EnterpriseFAQ } from "@/components/enterprise/EnterpriseFAQ";
import { EnterpriseWaitlist } from "@/components/enterprise/EnterpriseWaitlist";

export default function EnterpriseLandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="bg-white">
      <EnterpriseHeader />

      <main>
        <EnterpriseHero />

        <SectionDivider colorClass="text-white" heightClass="h-10" flip />

        <EnterpriseProblems />

        <SectionDivider colorClass="text-blue-50" heightClass="h-10" />

        <EnterpriseSolutions />

        <SectionDivider colorClass="text-blue-100" heightClass="h-10" flip />

        <EnterpriseTarget />

        <SectionDivider colorClass="text-blue-100" heightClass="h-10" />

        <EnterprisePricing />

        <SectionDivider colorClass="text-blue-200" heightClass="h-10" flip />

        <EnterpriseFAQ />

        <SectionDivider colorClass="text-blue-50" heightClass="h-10" flip />

        <EnterpriseWaitlist />
      </main>

      <SharedFooter />
      <StickyCTA />
    </div>
  );
}
