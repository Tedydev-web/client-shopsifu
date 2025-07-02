"use client";

import { t } from "i18next";
import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import { CartTopBar } from "@/components/client/cart/desktop/cart-TopBar";
import { CartHeader } from "@/components/client/cart/desktop/cart-Header";
import { useResponsive } from "@/hooks/useResponsive";

interface CartLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function CartLayout({ children, title = "" }: CartLayoutProps) {
  const { isMobile } = useResponsive();

  const topContent = !isMobile ? (
    <>
      <CartTopBar />
      <CartHeader />
    </>
  ) : null;

  return (
    <ClientLayoutWrapper
      hideHeader
      hideCommit
      hideHero
      hideFooter={isMobile}
      topContent={topContent}
    >
      <div className={`w-full ${isMobile ? "min-h-screen flex flex-col" : "min-h-screen"}`}>
        <main className={`flex-1 ${isMobile ? "" : "pb-4"}`}>
          <div className="w-full">{children}</div>
        </main>
      </div>
    </ClientLayoutWrapper>
  );
}
