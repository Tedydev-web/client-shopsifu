"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCartLayout } from "@/components/client/cart/cart-Layout";
import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import { CartTopBar } from "@/components/client/cart/desktop/cart-TopBar";
import { CartHeader } from "@/components/client/cart/desktop/cart-Header";

interface CartLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function CartLayout({ children, title = "" }: CartLayoutProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const total = 0;
  const totalSaved = 0;
  const selectedCount = 0;

  const { Header, Footer, isMobile } = useCartLayout({
    isEditing,
    total,
    totalSaved,
    selectedCount,
    onEdit: () => setIsEditing((prev) => !prev),
    title: title || t("user.cart.title"),
  });

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
      hideFooter={isMobile} // ✅ chỉ ẩn Footer khi là mobile
      topContent={topContent}
    >
      <div className={`w-full ${isMobile ? "min-h-screen flex flex-col" : "min-h-screen"}`}>
 
        {Header}

        <main className={`mt-4 flex-1 ${isMobile ? "pb-[80px]" : "py-4"}`}>
          <div className="w-full">{children}</div>
        </main>

        {/* Footer cart riêng, luôn hiển thị */}
        <div
          className={`w-full bg-white border-t ${
            isMobile ? "fixed bottom-0 z-50" : "sticky bottom-0"
          }`}
        >
          {Footer}
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
