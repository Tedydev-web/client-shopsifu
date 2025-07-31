'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, QrCode, CheckCircle2, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { selectShopProducts } from '@/store/features/checkout/ordersSilde';
import { orderService } from '@/services/orderService';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/types/order.interface';
import { formatCurrency } from '@/utils/formatter';
import { toast } from 'sonner';
import { useShopsifuSocket } from '@/providers/ShopsifuSocketProvider';

interface QrSepayProps {
  paymentId: string;
  orderId: string; // Add orderId to check status
  onPaymentConfirm: () => void;
  onPaymentCancel: () => void;
}

export function QrSepay({ paymentId, orderId, onPaymentConfirm, onPaymentCancel }: QrSepayProps) {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const { payments } = useShopsifuSocket();
  const shopProducts = useSelector(selectShopProducts);
  const router = useRouter();

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
  useEffect(() => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for WebSocket payment success events
  useEffect(() => {
        console.log(`[WebSocket] Checking for payment events. Total events: ${payments.length}`);
    if (payments.length === 0) return;

    const latestPayment = payments[payments.length - 1];

    // Check if the latest payment is a success for the current order via Sepay
    if (
      latestPayment &&
      latestPayment.orderId === orderId &&
      latestPayment.status === 'success' &&
      latestPayment.gateway === 'sepay'
    ) {
      console.log('✅ Payment success event received via WebSocket for order:', orderId);
      toast.success('Thanh toán thành công!');
      // Redirect to the success page
      router.push(`/checkout/payment-success?orderId=${orderId}&totalAmount=${totalAmount}`);
    }
  }, [payments, orderId, router, totalAmount]);

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

  // Poll for payment status
  useEffect(() => {
    if (!orderId) return;

        const checkPaymentStatus = async () => {
      console.log(`[Polling] Checking payment status for orderId: ${orderId}...`);
      try {
        const order: Order = await orderService.getById(orderId);
        if (order && order.status === OrderStatus.PENDING_PICKUP) {
          clearInterval(intervalId);
          toast.success('Thanh toán thành công!');
          router.push(`/checkout/payment-success?orderId=${orderId}&totalAmount=${totalAmount}`);
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
        // Optionally stop polling on certain errors
      }
    };

    const intervalId = setInterval(checkPaymentStatus, 3000); // Check every 3 seconds

    // Cleanup on component unmount
    return () => {
      clearInterval(intervalId);
    };
    }, [orderId, router, totalAmount]);

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
      <Card className="w-full max-w-md mx-auto border-red-200 shadow-lg">
        <CardHeader className="text-center bg-red-50 rounded-t-lg">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-red-600 text-xl font-bold">Mã QR đã hết hạn</CardTitle>
          <CardDescription className="text-red-500">
            Thời gian thanh toán đã hết. Vui lòng thử lại.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button 
            onClick={handlePaymentCancel}
            variant="outline" 
            className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
          >
            <X className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-red-200 shadow-lg">
      <CardHeader className="text-center bg-gradient-to-b from-red-50 to-white rounded-t-lg">
        <div className="flex justify-center mb-4">
          <QrCode className="h-8 w-8 text-red-600" />
        </div>
        <CardTitle className="text-red-700 text-xl font-bold">Quét mã QR để thanh toán</CardTitle>
        <CardDescription className="text-gray-600">
          Sử dụng ứng dụng ngân hàng để quét mã QR
        </CardDescription>
        
        {/* Countdown Timer */}
        <div className={`flex items-center justify-center gap-2 mt-4 p-3 rounded-lg transition-all duration-300 ${
          timeLeft <= 60 
            ? 'bg-red-100 border border-red-300' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <Clock className={`h-5 w-5 ${
            timeLeft <= 60 ? 'text-red-600 animate-pulse' : 'text-red-500'
          }`} />
          <span className={`text-lg font-mono font-semibold ${
            timeLeft <= 60 ? 'text-red-700' : 'text-red-600'
          }`}>
            {formatTime(timeLeft)}
          </span>
          <span className={`text-sm ${
            timeLeft <= 60 ? 'text-red-600' : 'text-red-500'
          }`}>còn lại</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="flex justify-center relative">
          <div className="p-4 bg-white border-2 border-red-200 rounded-lg shadow-sm relative">
            <Image
              src={qrUrl}
              alt="QR Code Sepay"
              width={200}
              height={200}
              className={`w-48 h-48 object-contain transition-all duration-500 ${
                timeLeft <= 30 ? 'opacity-50 blur-sm grayscale' : 'opacity-100'
              }`}
              unoptimized // Important for external QR API
            />
            {/* Overlay khi sắp hết hạn */}
            {timeLeft <= 30 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 font-semibold text-sm">Sắp hết hạn</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-3 p-4 bg-red-50 border border-red-100 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Số tài khoản:</span>
            <span className="font-semibold text-gray-900">{SEPAY_ACCOUNT}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Ngân hàng:</span>
            <span className="font-semibold text-gray-900">{SEPAY_BANK}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Số tiền:</span>
            <span className="font-bold text-red-600 text-base">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Nội dung:</span>
            <span className="font-semibold text-gray-900">DH{paymentId}</span>
          </div>
        </div>

        {/* Important Note */}
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-sm text-red-700">
            <strong className="text-red-800">Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handlePaymentConfirm}
            className={`w-full transition-all duration-300 ${
              timeLeft <= 30 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            disabled={isExpired}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Tôi đã chuyển tiền
          </Button>
          
          <Button 
            onClick={handlePaymentCancel}
            variant="outline" 
            className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
          >
            <X className="h-4 w-4 mr-2" />
            Hủy giao dịch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}