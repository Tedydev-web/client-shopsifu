'use client';

import { useEffect, useState } from 'react';
import { CheckoutHeader } from './checkout-Header';
import { CheckoutSteps } from './checkout-Steps';
import { InformationTabs } from './tabs/information-Tabs';
import { PaymentTabs } from './tabs/payment-Tabs';
import { FooterSection } from './shared/footer-Section';
import { useCheckout } from './hooks/useCheckout';
import { CheckoutStep } from './checkout-Steps';

export function CheckoutMain() {
  const { state, goToStep } = useCheckout();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStepChange = (step: CheckoutStep) => {
    goToStep(step);
  };

  const handleNext = () => {
    if (state.step === 'information') {
      // Trigger form submission
      const form = document.getElementById('checkout-form') as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    } else if (state.step === 'payment') {
      setIsSubmitting(true);
      // Simulate payment processing
      setTimeout(() => {
        setIsSubmitting(false);
        // Handle payment completion
      }, 2000);
    }
  };

  const handlePrevious = () => {
    if (state.step === 'payment') {
      goToStep('information');
    }
  };

  // Helper function to get footer step type
  const getFooterStep = (step: CheckoutStep): 'information' | 'payment' => {
    return step === 'cart' ? 'information' : step;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <CheckoutHeader />
      
      {/* Main Content */}
      <div className="flex-1 max-w-[1920px] w-full mx-auto px-3 sm:px-4 lg:px-8 2xl:px-12 py-3 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-12">
          {/* Main Form Section */}
          <div className="flex-1 order-1 lg:order-1 min-w-0 lg:max-w-[calc(100%-520px)] xl:max-w-[calc(100%-580px)]">
            {/* Steps */}
            <div className="sticky top-0 z-10 -mx-3 px-3 sm:-mx-4 sm:px-4 lg:static lg:mx-0 lg:px-0 py-2">
              <CheckoutSteps activeStep={state.step} onStepChange={handleStepChange} />
            </div>
            
            {/* Form Content */}
            <div className="mt-3 lg:mt-4 space-y-4">
              {state.step === 'information' ? (
                <InformationTabs onNext={() => goToStep('payment')} />
              ) : (
                <PaymentTabs onPrevious={() => goToStep('information')} />
              )}
            </div>
          </div>
          
          {/* Order Summary - Desktop */}
          <div className="hidden lg:block w-full lg:w-[500px] xl:w-[560px] order-2 lg:mt-[72px] flex-shrink-0">
            <div className="sticky top-6">
              <FooterSection
                step={getFooterStep(state.step)}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary - Mobile */}
      <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="p-3">
          <FooterSection
            variant="mobile"
            step={getFooterStep(state.step)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
