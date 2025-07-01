"use client";

import dynamic from "next/dynamic";
import { useResponsive } from "@/hooks/useResponsive";

const CartHeaderMobile = dynamic(() => import("./mobile/cart-HeaderMobile"), { ssr: false });
const CartHeaderDesktop = dynamic(() => import("./desktop/cart-ProductTitle"), { ssr: false });

const CartFooterMobile = dynamic(() => import("./mobile/cart-FooterMobile"), { ssr: false });
const CartFooterDesktop = dynamic(() => import("./desktop/cart-Footer"), { ssr: false });

interface CartLayoutControlProps {
  isEditing: boolean;
  total: number;
  totalSaved: number;
  selectedCount: number;
  onEdit: () => void;
  title: string;
}

export function useCartLayout({
  isEditing,
  total,
  totalSaved,
  selectedCount,
  onEdit,
  title,
}: CartLayoutControlProps) {
  const { isMobile } = useResponsive();

  const Header = isMobile ? (
    <CartHeaderMobile title={title} onEdit={onEdit} />
  ) : (
      <CartHeaderDesktop />
  );

  const Footer = isMobile ? (
    <CartFooterMobile
      total={total}
      totalSaved={totalSaved}
      selectedCount={selectedCount}
      isEditing={isEditing}
    />
  ) : (
    <CartFooterDesktop
      total={total}
      totalSaved={totalSaved}
      selectedCount={selectedCount}
      isEditing={isEditing}
    />
  );

  return { Header, Footer, isMobile };
}
