'use client';

import { useEffect, useState } from 'react';
import { CheckoutHeader } from './checkout-Header';
import { CheckoutSteps } from './checkout-Steps';
import { InformationTabs } from './information-Tabs/information-Index';
import { PaymentTabs } from './payment-Tabs/payment-Index';
import { FooterSection } from './shared/footer-Section';
import { useCheckout } from './hooks/useCheckout';
import { CheckoutStep } from './checkout-Steps';
import { QrSepay } from './payment/qrSepay';
import { useRouter } from 'next/navigation';

interface CheckoutMainProps {
  cartItemIds?: string[];
}

export function CheckoutMain({ cartItemIds = [] }: CheckoutMainProps) {
  // 1. Lấy state và các hàm từ hook đã được cập nhật
  const { state, goToStep, handleCreateOrder, isSubmitting } = useCheckout();
  const router = useRouter();
  
  // Debug log cartItemIds
  console.log('🛍️ CheckoutMain - Received cartItemIds:', {
    cartItemIds,
    count: cartItemIds.length,
    isValid: cartItemIds.length > 0
  });
  
  // 2. State để quản lý việc hiển thị QR Sepay
  const [showQrSepay, setShowQrSepay] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    success: boolean;
    paymentMethod: string;
    orderData: { id: string; [key: string]: any }; // Ensure orderData has an id
    paymentId: string;
  } | null>(null);

  // 3. Hàm chuyển step
  const handleStepChange = (step: CheckoutStep) => {
    goToStep(step);
  };
 
  // 4. Hàm xử lý khi nhấn nút "Tiếp tục" hoặc "Hoàn tất"
  const handleNext = async () => {
    if (state.step === 'information') {
      // Kích hoạt validation của form thông tin
      const form = document.getElementById('checkout-form') as HTMLFormElement;
      if (form) {
        // Form's onSubmit sẽ xử lý việc chuyển sang bước tiếp theo nếu hợp lệ
        form.requestSubmit();
      }
    } else if (state.step === 'payment') {
      // Ở bước thanh toán, hành động tiếp theo là tạo đơn hàng
      const result = await handleCreateOrder();
      
      console.log('🔍 Create Order Result:', result);
      
      // Xử lý kết quả tạo đơn hàng
      if (result && result.success) {
        // Check if result has paymentMethod property (success case)
        if ('paymentMethod' in result && result.paymentMethod === 'sepay') {
          // Hiển thị QR Sepay cho thanh toán chuyển khoản
          const sepayResult = result as {
            success: boolean;
            paymentMethod: string;
            orderData: any;
            paymentId: string;
          };
          
          console.log('🏦 Switching to QR Sepay with data:', {
            paymentId: sepayResult.paymentId,
            orderData: sepayResult.orderData,
            paymentMethod: sepayResult.paymentMethod
          });
          
          setOrderResult(sepayResult);
          setShowQrSepay(true);
        } else if ('paymentMethod' in result) {
          // Redirect cho các phương thức thanh toán khác (COD, etc.)
          console.log('✅ Redirecting to purchase page for payment method:', result.paymentMethod);
          router.push('/user/purchase');
        }
      } else {
        console.error('❌ Order creation failed:', result);
      }
    }
  };

  const handlePrevious = () => {
    if (state.step === 'payment') {
      handleStepChange('information');
    }
  };
  
  // 5. Xử lý khi user xác nhận đã chuyển tiền (QR Sepay)
  const handlePaymentConfirm = () => {
    // Chuyển đến trang đơn hàng
    router.push('/user/dashboard');
  };
  
  // 6. Xử lý khi user hủy thanh toán (QR Sepay)
  const handlePaymentCancel = () => {
    setShowQrSepay(false);
    setOrderResult(null);
    // Quay lại bước thanh toán
  };

  // Helper function to get footer step type
  const getFooterStep = (step: CheckoutStep): 'information' | 'payment' => {
    return step === 'cart' ? 'information' : step;
  };

  // Nếu đang hiển thị QR Sepay, render component QR
  if (showQrSepay && orderResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <QrSepay
          paymentId={orderResult.paymentId}
          orderId={orderResult.orderData.id}
          onPaymentConfirm={handlePaymentConfirm}
          onPaymentCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {/* <CheckoutHeader /> */}
      
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
