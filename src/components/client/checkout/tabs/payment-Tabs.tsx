'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { PaymentMethods } from '../sections/tab-2/payment-Methods';
import { RecipientInfo } from '../sections/tab-2/recipient-Info';
import { useCheckout } from '../hooks/useCheckout';

interface PaymentTabsProps {
  onPrevious: () => void;
}

export function PaymentTabs({ onPrevious }: PaymentTabsProps) {
  const { state } = useCheckout();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Dữ liệu mẫu cho thông tin người nhận và địa chỉ
  const customerInfo = {
    name: state.customerInfo?.name || "Nguyễn Văn A",
    phone: state.customerInfo?.phone || "0987654321",
    email: state.customerInfo?.email || "example@gmail.com",
  };
  
  // Format địa chỉ từ shippingAddress
  const formattedAddress = state.shippingAddress 
    ? `${state.shippingAddress.address}, ${state.shippingAddress.ward}, ${state.shippingAddress.district}, ${state.shippingAddress.province}`
    : "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh";
  
  const recipientInfo = {
    address: formattedAddress,
    receiverName: state.customerInfo?.name || "Nguyễn Văn A",
    receiverPhone: state.customerInfo?.phone || "0987654321",
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Giả lập quá trình thanh toán
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 2000);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  // Xử lý quay lại bước thông tin
  const handleGoToInformation = () => {
    onPrevious();
  };

  // Hiển thị màn hình kết quả khi hoàn tất đặt hàng
  if (isCompleted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Đặt hàng thành công!</h2>
              <p className="text-gray-600 mb-6">
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
    <div className="space-y-6">
      {/* Thông tin người nhận */}
      <RecipientInfo 
        customerInfo={customerInfo}
        shippingAddress={recipientInfo}
        onEdit={handleGoToInformation}
      />

      {/* Phương thức thanh toán */}
      <PaymentMethods 
        paymentMethod={paymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2 h-9 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="h-9 text-sm"
        >
          {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}
        </Button>
      </div>
    </div>
  );
}
