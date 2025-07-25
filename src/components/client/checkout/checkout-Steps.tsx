'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useCheckout } from './hooks/useCheckout';
import Link from 'next/link';
import { ShoppingCart, Banknote, Info } from 'lucide-react';

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
      return;
    }
    onStepChange?.(step);
  };

  return (
    <div className={cn('flex items-center justify-center lg:justify-start', className)}>
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const isDisabled = step.id === 'payment' && !canNavigateToPayment;
        const isCartStep = step.id === 'cart';

        return (
          <div key={step.id} className="flex items-center">
            {index > 0 && (
              <div className="w-8 lg:w-10 h-[2px] bg-gray-300 mx-2 lg:mx-3"></div>
            )}
            {isCartStep ? (
              <Link href="/cart" className={cn(
                'flex items-center gap-2 px-3 py-1.5 lg:py-2 rounded-full transition-colors',
                'text-gray-700 hover:text-gray-900',
                'text-sm lg:text-base'
              )}>
                {step.icon && <step.icon className="h-4 w-4 lg:h-4.5 lg:w-4.5" />}
                <span className="font-medium hidden sm:inline">{step.label}</span>
              </Link>
            ) : (
              <button
                onClick={() => handleStepClick(step.id as CheckoutStep)}
                disabled={isDisabled}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 lg:py-2 rounded-full transition-colors',
                  'text-sm lg:text-base',
                  isActive
                    ? 'text-primary'
                    : isDisabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                {step.icon && <step.icon className="h-4 w-4 lg:h-4.5 lg:w-4.5" />}
                <span className="font-medium hidden sm:inline">{step.label}</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
