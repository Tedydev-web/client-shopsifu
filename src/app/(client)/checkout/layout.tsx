"use client";

import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import { useResponsive } from "@/hooks/useResponsive";

interface CheckoutLayoutProps {
  children: React.ReactNode;
}

export default function CheckoutLayout({ children}: CheckoutLayoutProps) {
  const { isMobile } = useResponsive();

  return (
    <ClientLayoutWrapper
      hideHeader
      hideCommit
      hideHero
      hideFooter
      topContent
    >
      <div className={`w-full ${isMobile ? "min-h-screen flex flex-col" : "min-h-screen"}`}>
        <main className={`flex-1 ${isMobile ? "" : "pb-4"}`}>
          <div className="w-full">{children}</div>
        </main>
      </div>
    </ClientLayoutWrapper>
  );
}
