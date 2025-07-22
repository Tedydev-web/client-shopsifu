'use client';

import { useEffect } from 'react';
import { CheckoutHeader } from './checkout-Header';
import { CheckoutSteps } from './checkout-Steps';
import { InformationTabs } from './tabs/information-Tabs';
import { PaymentTabs } from './tabs/payment-Tabs';
import { FooterSection } from './shared/footer-Section';
import { useCheckout } from './hooks/useCheckout';
import { CheckoutStep } from '@/context/CheckoutContext';

export function CheckoutMain() {
  const { state, goToStep } = useCheckout();

  const handleStepChange = (step: CheckoutStep) => {
    goToStep(step);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <CheckoutHeader />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 order-2 lg:order-1">
          <CheckoutSteps activeStep={state.step} onStepChange={handleStepChange} />
          
          <div className="mt-4">
            {state.step === 'information' ? (
              <InformationTabs onNext={() => goToStep('payment')} />
            ) : (
              <PaymentTabs onPrevious={() => goToStep('information')} />
            )}
          </div>
        </div>
        
        <div className="w-full lg:w-96 order-1 lg:order-2">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
