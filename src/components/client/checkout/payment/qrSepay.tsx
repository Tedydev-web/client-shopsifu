'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, QrCode, CheckCircle2, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { selectShopProducts } from '@/store/features/checkout/ordersSilde';
import { formatCurrency } from '@/utils/formatter';
import { toast } from 'sonner';

interface QrSepayProps {
  paymentId: string;
  onPaymentConfirm: () => void;
  onPaymentCancel: () => void;
}

export function QrSepay({ paymentId, onPaymentConfirm, onPaymentCancel }: QrSepayProps) {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const shopProducts = useSelector(selectShopProducts);

  // Calculate total amount from Redux state
  const subtotal = Object.values(shopProducts).reduce((total, shopProducts) => {
    return total + shopProducts.reduce((shopTotal, product) => {
      return shopTotal + (product.price * product.quantity);
    }, 0);
  }, 0);

  const shippingFee = 0;
  const voucherDiscount = 0;
  const totalAmount = subtotal + shippingFee - voucherDiscount;

  // Environment variables for Sepay
  const SEPAY_ACCOUNT = process.env.NEXT_PUBLIC_SEPAY_ACCOUNT || '565615056666';
  const SEPAY_BANK = process.env.NEXT_PUBLIC_SEPAY_BANK || 'MbBank';
  
  // Generate QR URL according to Sepay docs
  const qrUrl = `https://qr.sepay.vn/img?acc=${SEPAY_ACCOUNT}&bank=${SEPAY_BANK}&amount=${totalAmount}&des=DH${paymentId}`;
  
  // Console log để debug data truyền vào QrSepay
  console.log('🔗 QR Sepay Data Debug:', {
    paymentId,
    totalAmount,
    SEPAY_ACCOUNT,
    SEPAY_BANK,
    qrUrl,
    shopProducts: Object.keys(shopProducts).length,
    subtotal,
    finalAmount: totalAmount
  });

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePaymentConfirm = () => {
    if (isExpired) {
      toast.error('Mã QR đã hết hạn. Vui lòng thử lại.');
      return;
    }
    onPaymentConfirm();
  };

  const handlePaymentCancel = () => {
    onPaymentCancel();
  };

  if (isExpired) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-red-600">Mã QR đã hết hạn</CardTitle>
          <CardDescription>
            Thời gian thanh toán đã hết. Vui lòng thử lại.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handlePaymentCancel}
            variant="outline" 
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <QrCode className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle>Quét mã QR để thanh toán</CardTitle>
        <CardDescription>
          Sử dụng ứng dụng ngân hàng để quét mã QR
        </CardDescription>
        
        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-orange-50 rounded-lg">
          <Clock className="h-5 w-5 text-orange-600" />
          <span className="text-lg font-mono font-semibold text-orange-600">
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-orange-600">còn lại</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
            <Image
              src={qrUrl}
              alt="QR Code Sepay"
              width={200}
              height={200}
              className="w-48 h-48 object-contain"
              unoptimized // Important for external QR API
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số tài khoản:</span>
            <span className="font-medium">{SEPAY_ACCOUNT}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ngân hàng:</span>
            <span className="font-medium">{SEPAY_BANK}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-medium text-red-600">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Nội dung:</span>
            <span className="font-medium">DH{paymentId}</span>
          </div>
        </div>

        {/* Important Note */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handlePaymentConfirm}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isExpired}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Tôi đã chuyển tiền
          </Button>
          
          <Button 
            onClick={handlePaymentCancel}
            variant="outline" 
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Hủy giao dịch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}