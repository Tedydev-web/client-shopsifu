"use client";

import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import MobileHeader from "@/components/client/cart/mobile/cart-Header";
import CartFooter from "@/components/client/cart/mobile/cart-Footer";
import { useTranslation } from "react-i18next";

interface CartLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function CartLayout({ children, title = "" }: CartLayoutProps) {
  const { isMobile } = useResponsive();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <MobileHeader
          title={title || t("user.cart.title")}
          onEdit={handleEdit}
        />
        <main className="px-4 h-[calc(100vh-72px)] overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full mt-4">{children}</div>
        </main>
        {/* Footer cố định dưới cùng */}
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t">
          <CartFooter total={0} isEditing={isEditing} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          {title || t("user.cart.title")}
        </h1>
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100"
          onClick={handleEdit}
        >
          <span className="text-sm">
            {isEditing ? t("user.cart.done") : t("user.cart.edit")}
          </span>
        </button>
      </div>
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto w-full mt-4">{children}</div>
      </main>
      {/* Footer desktop */}
      <div className="sticky bottom-0 left-0 w-full z-50 bg-white border-t">
        <CartFooter total={0} isEditing={isEditing} />
      </div>
    </div>
  );
}