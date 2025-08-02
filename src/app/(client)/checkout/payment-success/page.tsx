'use client';

import { PaymentStatus } from '@/components/client/checkout/payment/payment-Success';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { orderService } from '@/services/orderService';

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed'>('pending');
  const [orderId, setOrderId] = useState('N/A');
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Kiểm tra xem có phải là callback từ VNPay không
  const isVNPayCallback = searchParams.has('vnp_ResponseCode');
  
  useEffect(() => {
    const processParams = async () => {
      // Nếu là callback từ VNPay
      if (isVNPayCallback) {
        try {
          // Lấy toàn bộ query parameters
          const queryString = searchParams.toString();
          
          // Gọi API xác thực kết quả thanh toán VNPay
          const response = await orderService.verifyVNPayReturn(queryString);
          const { isSuccess, vnp_TxnRef, vnp_Amount } = response.data;
          
          // Xử lý kết quả
          const extractedOrderId = vnp_TxnRef.replace('DH', '');
          const amount = vnp_Amount / 100; // VNPay trả về số tiền * 100
          
          setOrderId(extractedOrderId);
          setTotalAmount(amount);
          setPaymentStatus(isSuccess ? 'success' : 'failed');
          
        } catch (error) {
          console.error('Failed to verify VNPay payment:', error);
          setPaymentStatus('failed');
        }
      } else {
        // Xử lý thông thường nếu không phải từ VNPay
        const status = (searchParams.get('status') as 'success' | 'pending' | 'failed') || 'success';
        const orderIdFromParams = searchParams.get('orderId') || 'N/A';
        const totalAmountFromParams = Number(searchParams.get('totalAmount')) || 0;
        
        setOrderId(orderIdFromParams);
        setTotalAmount(totalAmountFromParams);
        setPaymentStatus(status);
      }
    };
    
    processParams();
  }, [searchParams, isVNPayCallback]);

  return (
    <PaymentStatus 
      orderId={orderId} 
      totalAmount={totalAmount} 
      initialStatus={paymentStatus}
      paymentMethod={isVNPayCallback ? 'vnpay' : (searchParams.get('paymentMethod') || 'unknown')}
    />
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
