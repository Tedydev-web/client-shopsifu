'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useCheckout } from './hooks/useCheckout';
import Link from 'next/link';
import { ShoppingCart, Banknote, Info  } from 'lucide-react';

export type CheckoutStep = 'cart' | 'information' | 'payment';

interface CheckoutStepsProps {
  activeStep: CheckoutStep;
  onStepChange?: (step: CheckoutStep) => void;
  className?: string;
}

interface StepItem {
  id: CheckoutStep;
  label: string;
  href?: string;
  icon?: React.ElementType;
}

export function CheckoutSteps({
  activeStep,
  onStepChange,
  className,
}: CheckoutStepsProps) {
  const { state } = useCheckout();
  const [canNavigateToPayment, setCanNavigateToPayment] = useState(false);

  const steps: StepItem[] = [
    { id: 'cart', label: 'Giỏ hàng', href: '/cart', icon: ShoppingCart },
    { id: 'information', label: 'Thông tin', icon: Info },
    { id: 'payment', label: 'Thanh toán', icon: Banknote },
  ];

  useEffect(() => {
    // Kiểm tra xem có thể chuyển sang bước thanh toán hay không
    if (
      state.customerInfo?.email &&
      state.customerInfo?.name &&
      state.customerInfo?.phone &&
      state.shippingAddress
    ) {
      setCanNavigateToPayment(true);
    } else {
      setCanNavigateToPayment(false);
    }
  }, [state.customerInfo, state.shippingAddress]);

  const handleStepClick = (step: CheckoutStep) => {
    if (step === 'payment' && !canNavigateToPayment) {
      return;
    }
    if (step === 'cart') {
      // Navigation to cart is handled by the Link component
      return;
    }
    onStepChange?.(step);
  };

  return (
    <div className={cn('flex mb-6', className)}>
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const isDisabled = step.id === 'payment' && !canNavigateToPayment;
        const isCartStep = step.id === 'cart';

        return (
          <div key={step.id} className="flex items-center">
            {index > 0 && (
              <div className="w-10 h-[2px] bg-gray-300 mx-2"></div>
            )}
            {isCartStep ? (
              <Link href="/cart" className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors text-sm',
                'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}>
                {step.icon && <step.icon className="h-3.5 w-3.5" />}
                <span className="font-medium">{step.label}</span>
              </Link>
            ) : (
              <button
                onClick={() => handleStepClick(step.id as CheckoutStep)}
                disabled={isDisabled}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors text-sm',
                  isActive
                    ? 'bg-primary text-white'
                    : isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {step.icon && <step.icon className="h-3.5 w-3.5" />}
                <span className="font-medium">{step.label}</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
