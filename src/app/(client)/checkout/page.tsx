'use client'

import { CheckoutMain } from "@/components/client/checkout/checkout-Main";
import { CheckoutProvider } from "@/context/CheckoutContext";

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutMain />
    </CheckoutProvider>
  );
}