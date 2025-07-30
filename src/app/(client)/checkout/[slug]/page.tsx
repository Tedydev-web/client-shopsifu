'use client'

import CheckoutMainWrapper from "@/components/client/checkout/checkout-Wrapper";
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

interface CheckoutPageProps {
  params: {
    id: string;
  };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = params;
  
  // Parse cartItemIds từ URL param
  const cartItemIds = id ? id.split(',').filter(Boolean) : [];
  
  console.log('🛒 Checkout Page - CartItemIds from URL:', {
    rawId: id,
    cartItemIds,
    count: cartItemIds.length
  });
  
  return (
    <CheckoutMainWrapper cartItemIds={cartItemIds} />
  );
}