'use client'

import CheckoutMainWrapper from "@/components/client/checkout/checkout-Wrapper";
import { CheckoutProvider } from "@/providers/CheckoutContext";

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutMainWrapper />
    </CheckoutProvider>
  );
}