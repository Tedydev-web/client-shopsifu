'use client';

import { useCheckDevice } from '@/hooks/useCheckDevices';
import { useEffect, useState } from 'react';
import ProductDetail from '@/components/client/products/desktop/products-Index';
import ProductDetailMobile from '@/components/client/products/mobile/products-IndexMobile';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [mounted, setMounted] = useState(false);
  const deviceType = useCheckDevice(); // deviceType: 'mobile' | 'laptop' | 'unknown'

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || deviceType === 'unknown') return null;

  return deviceType === 'mobile'
    ? <ProductDetailMobile slug={params.slug} />
    : <ProductDetail slug={params.slug} />;
}
