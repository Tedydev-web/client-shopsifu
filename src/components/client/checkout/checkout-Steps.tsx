'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useCheckout } from './hooks/useCheckout';

export type CheckoutStep = 'information' | 'payment';

interface CheckoutStepsProps {
  activeStep: CheckoutStep;
  onStepChange?: (step: CheckoutStep) => void;
  className?: string;
}

export function CheckoutSteps({
  activeStep,
  onStepChange,
  className,
}: CheckoutStepsProps) {
  const { state } = useCheckout();
  const [canNavigateToPayment, setCanNavigateToPayment] = useState(false);

  const steps = [
    { id: 'information', label: 'Thông tin' },
    { id: 'payment', label: 'Thanh toán' },
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
    onStepChange?.(step);
  };

  return (
    <div className={cn('flex mb-6', className)}>
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const isDisabled = step.id === 'payment' && !canNavigateToPayment;

        return (
          <div key={step.id} className="flex items-center">
            {index > 0 && (
              <div className="w-12 h-[2px] bg-gray-300 mx-2"></div>
            )}
            <button
              onClick={() => handleStepClick(step.id as CheckoutStep)}
              disabled={isDisabled}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : isDisabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <span className="font-medium">{step.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
