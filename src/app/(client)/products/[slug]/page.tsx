'use client';

import { use } from 'react';
import { useCheckDevice } from '@/hooks/useCheckDevices';
import { useEffect, useState } from 'react';
import ClientLayoutWrapper from '@/components/client/layout/ClientLayoutWrapper';
import ProductDetail from '@/components/client/products/desktop/products-Index';
import ProductDetailMobile from '@/components/client/products/mobile/products-IndexMobile';
import { useResponsive } from '@/hooks/useResponsive';

interface Props {
  params: Promise<{ slug: string }>; // 👈 phải là Promise
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params); // ✅ unwrap params safely
  const [mounted, setMounted] = useState(false);
  const deviceType = useCheckDevice();
  const { isMobile } = useResponsive();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || deviceType === 'unknown') return null;

  return (
    <ClientLayoutWrapper
      hideHeader={isMobile}
      hideCommit={isMobile}
      hideHero={isMobile}
      hideFooter={isMobile}
      topContent={isMobile}
    >
      {deviceType === 'mobile' ? (
        <ProductDetailMobile slug={slug} />
      ) : (
        <ProductDetail slug={slug} />
      )}
    </ClientLayoutWrapper>
  );
}
