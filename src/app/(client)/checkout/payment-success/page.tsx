'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaymentSuccess } from '@/components/client/checkout/payment/payment-Success';
import { Skeleton } from '@/components/ui/skeleton';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const totalAmount = searchParams.get('totalAmount');

  if (!orderId || !totalAmount) {
    // Optional: Show a loading or error state if params are missing
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Đang tải thông tin đơn hàng...</p>
          <Skeleton className="h-48 w-full max-w-lg mt-4" />
        </div>
      </div>
    );
  }

  return <PaymentSuccess orderId={orderId} totalAmount={Number(totalAmount)} />;
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Đang tải...</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
