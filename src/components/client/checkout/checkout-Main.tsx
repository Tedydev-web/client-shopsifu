'use client';

import { useEffect } from 'react';
import { CheckoutHeader } from './checkout-Header';
import { CheckoutSteps } from './checkout-Steps';
import { InformationTabs } from './tabs/information-Tabs';
import { PaymentTabs } from './tabs/payment-Tabs';
import { FooterSection } from './shared/footer-Section';
import { useCheckout } from './hooks/useCheckout';
import { CheckoutStep } from './checkout-Steps';

export function CheckoutMain() {
  const { state, goToStep } = useCheckout();

  const handleStepChange = (step: CheckoutStep) => {
    goToStep(step);
  };

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 2xl:px-16 py-8">
      <CheckoutHeader />
      
      <div className="flex flex-col lg:flex-row gap-8 xl:gap-16">
        <div className="flex-1 order-2 lg:order-1 min-w-0 lg:max-w-[calc(100%-520px)] xl:max-w-[calc(100%-580px)]">
          <CheckoutSteps activeStep={state.step} onStepChange={handleStepChange} />
          
          <div className="mt-6">
            {state.step === 'information' ? (
              <InformationTabs onNext={() => goToStep('payment')} />
            ) : (
              <PaymentTabs onPrevious={() => goToStep('information')} />
            )}
          </div>
        </div>
        
        <div className="w-full lg:w-[500px] xl:w-[560px] order-1 lg:order-2 lg:mt-[80px] flex-shrink-0">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
