// components/client/products/ProductPageClientWrapper.tsx
"use client";

import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import ProductDetail from "@/components/client/products/desktop/products-Index";
import ProductDetailMobile from "@/components/client/products/mobile/products-IndexMobile";
import { useCheckDevice } from "@/hooks/useCheckDevices";
import { useResponsive } from "@/hooks/useResponsive";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export default function ProductPageClientWrapper({ slug }: Props) {
  const [mounted, setMounted] = useState(false);
  const deviceType = useCheckDevice();
  const { isMobile } = useResponsive();

  useEffect(() => {
    console.log("✅ [Page] slug param:", slug);
    setMounted(true);
  }, [slug]);

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
