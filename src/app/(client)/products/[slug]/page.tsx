// components/client/ProductPageClient.tsx
"use client";

import { useCheckDevice } from "@/hooks/useCheckDevices";
import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import ProductDetail from "@/components/client/products/desktop/products-Index";
import ProductDetailMobile from "@/components/client/products/mobile/products-IndexMobile";
import { useResponsive } from "@/hooks/useResponsive";
import { useEffect, useState } from "react";

// ✅ Đúng chuẩn App Router
export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const [mounted, setMounted] = useState(false);
  const deviceType = useCheckDevice();
  const { isMobile } = useResponsive();

  useEffect(() => {
    console.log("✅ [Page] slug param:", slug);
    setMounted(true);
  }, []);

  if (!mounted || deviceType === "unknown") return null;

  return (
    <ClientLayoutWrapper
      hideHeader={isMobile}
      hideCommit
      hideHero
      hideFooter={isMobile}
      topContent={isMobile}
    >
      {deviceType === "mobile" ? (
        <ProductDetailMobile slug={slug} />
      ) : (
        <ProductDetail slug={slug} />
      )}
    </ClientLayoutWrapper>
  );
}

