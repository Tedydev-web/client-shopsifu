"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCartLayout } from "@/components/client/cart/cart-Layout";
import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";

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

  return (
    <ClientLayoutWrapper hideCommit hideHero>
      <div
        className={`w-full bg-background text-foreground ${
          isMobile ? "min-h-screen flex flex-col" : "min-h-screen"
        }`}
      >
        {Header}

        <main className={`mt-4 flex-1 ${isMobile ? "pb-[80px]" : "p-4"}`}>
          {/* pb-[80px] tránh nội dung bị footer đè lên */}
          <div className="w-full">{children}</div>
        </main>

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
