'use client';

import { useEffect, useState, use } from 'react';
import { useCheckDevice } from '@/hooks/useCheckDevices';
import ClientLayoutWrapper from '@/components/client/layout/ClientLayoutWrapper';
import ProductDetail from '@/components/client/products/desktop/products-Index';
import ProductDetailMobile from '@/components/client/products/mobile/products-IndexMobile';
import { useResponsive } from '@/hooks/useResponsive';

interface Props {
  params: Promise<{ slug: string }>; // 👈 `params` là Promise
}

export default function ProductPage(props: Props) {
  const { slug } = use(props.params); // ✅ unwrap params using React.use()

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
      hideCommit
      hideHero
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
