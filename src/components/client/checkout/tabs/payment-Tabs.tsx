'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PaymentTabsProps {
  onPrevious: () => void;
}

export function PaymentTabs({ onPrevious }: PaymentTabsProps) {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Giả lập quá trình thanh toán
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 2000);
  };

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
      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
          <CardDescription>
            Chọn phương thức thanh toán phù hợp với bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="cod" id="payment-cod" />
              <div className="flex-1">
                <Label htmlFor="payment-cod" className="flex justify-between cursor-pointer">
                  <div>
                    <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận được hàng</div>
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    COD
                  </div>
                </Label>
              </div>
            </div>

            <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="momo" id="payment-momo" />
              <div className="flex-1">
                <Label htmlFor="payment-momo" className="flex justify-between cursor-pointer">
                  <div>
                    <div className="font-medium">Ví MoMo</div>
                    <div className="text-sm text-gray-500">Thanh toán qua ví điện tử MoMo</div>
                  </div>
                  <div className="w-12 h-8 relative">
                    <div className="w-8 h-8 bg-pink-500 rounded-full absolute right-0"></div>
                  </div>
                </Label>
              </div>
            </div>

            <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="bank" id="payment-bank" />
              <div className="flex-1">
                <Label htmlFor="payment-bank" className="flex justify-between cursor-pointer">
                  <div>
                    <div className="font-medium">Chuyển khoản ngân hàng</div>
                    <div className="text-sm text-gray-500">Chuyển khoản trực tiếp vào tài khoản shop</div>
                  </div>
                  <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-xs">
                    BANK
                  </div>
                </Label>
              </div>
            </div>

            <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="card" id="payment-card" />
              <div className="flex-1">
                <Label htmlFor="payment-card" className="flex justify-between cursor-pointer">
                  <div>
                    <div className="font-medium">Thẻ tín dụng / ghi nợ</div>
                    <div className="text-sm text-gray-500">Thanh toán an toàn bằng thẻ</div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-8 h-6 bg-blue-100 rounded"></div>
                    <div className="w-8 h-6 bg-red-100 rounded"></div>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Chú ý</AlertTitle>
            <AlertDescription>
              Đơn hàng sẽ được xử lý sau khi chúng tôi xác nhận thanh toán thành công
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}
        </Button>
      </div>
    </div>
  );
}
