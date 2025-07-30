'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { PaymentMethods } from '../sections/tab-2/payment-Methods';
import { RecipientInfo } from '../sections/tab-2/recipient-Info';
import { ProductsInfo } from '../sections/tab-2/products-Info';
import { useCheckout } from '../hooks/useCheckout';
import { Button } from '@/components/ui/button';

interface PaymentTabsProps {
  onPrevious: () => void;
}

export function PaymentTabs({ onPrevious }: PaymentTabsProps) {
  const { state } = useCheckout();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const customerInfo = {
    name: state.customerInfo?.name || "Nguyễn Văn A",
    phone: state.customerInfo?.phone || "0987654321",
    email: state.customerInfo?.email || "example@gmail.com",
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 2000);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  if (isCompleted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-xl font-medium mb-2">Đặt hàng thành công!</h2>
              <p className="text-gray-500 mb-6">
                Cảm ơn bạn đã mua sắm tại ShopSifu. Đơn hàng của bạn đã được xác nhận.
              </p>
              <div className="text-left bg-gray-50 p-4 rounded-md w-full max-w-md">
                <p className="text-sm mb-1"><span className="font-medium">Mã đơn hàng:</span> #ORD123456789</p>
                <p className="text-sm mb-1"><span className="font-medium">Ngày đặt:</span> {new Date().toLocaleDateString('vi-VN')}</p>
                <p className="text-sm"><span className="font-medium">Phương thức thanh toán:</span> {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán trực tuyến'}</p>
              </div>
              <div className="mt-8 flex gap-4">
                <Button variant="outline" asChild>
                  <a href="/account/orders">Xem đơn hàng</a>
                </Button>
                <Button asChild>
                  <a href="/">Tiếp tục mua sắm</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Thông tin người nhận */}
      {state.shippingAddress && (
        <RecipientInfo
          customerInfo={customerInfo}
          shippingAddress={{
            addressDetail: state.shippingAddress.addressDetail || '',
            ward: state.shippingAddress.ward || '',
            district: state.shippingAddress.district || '',
            province: state.shippingAddress.province || '',
            address: state.shippingAddress.address || '',
            receiverName: state.shippingAddress.receiverName || '',
            receiverPhone: state.shippingAddress.receiverPhone || '',
          }}
          onEdit={onPrevious}
        />
      )}

      {/* Thông tin sản phẩm */}
      <ProductsInfo />

      {/* Phương thức thanh toán */}
      <PaymentMethods 
        paymentMethod={paymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
      />
    </div>
  );
}
