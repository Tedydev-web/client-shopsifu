'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CheckoutHeaderProps {
  title?: string;
}

export function CheckoutHeader({ title = 'Thanh toán' }: CheckoutHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center py-4 border-b mb-4">
      <button 
        onClick={handleBack}
        className="p-2 hover:bg-gray-100 rounded-full"
        aria-label="Quay lại"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-medium text-center flex-1 pr-10">{title}</h1>
    </div>
  );
}
