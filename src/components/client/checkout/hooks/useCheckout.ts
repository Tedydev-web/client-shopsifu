'use client';

import { useContext, useState } from 'react';
import { CheckoutContext } from '@/providers/CheckoutContext';
import { orderService } from '@/services/orderService';
import { useSelector } from 'react-redux';
import { selectShopOrders, selectShopProducts, selectAppliedVouchers, selectAppliedPlatformVoucher, selectCommonOrderInfo } from '@/store/features/checkout/ordersSilde';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { OrderCreateRequest, OrderHandlerResult } from '@/types/order.interface';
import { CheckoutStep } from '@/providers/CheckoutContext';

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  const router = useRouter();
  
  // 1. Get data from Redux
  const shopOrders = useSelector(selectShopOrders);
  const shopProducts = useSelector(selectShopProducts);
  const appliedVouchers = useSelector(selectAppliedVouchers);
  const appliedPlatformVoucher = useSelector(selectAppliedPlatformVoucher);
  const commonInfo = useSelector(selectCommonOrderInfo);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }

  // Helper functions for components
  const goToStep = (step: CheckoutStep) => {
    context.goToStep(step);
  };

  const updateReceiverInfo = (info: any) => {
    context.updateReceiverInfo(info);
  };

  const updatePaymentMethod = (method: any) => {
    context.updatePaymentMethod(method);
  };

  const updateShippingAddress = (address: any) => {
    context.updateShippingAddress(address);
  };

  const updateShippingMethod = (method: any) => {
    context.updateShippingMethod(method);
  };

const handleCreateOrder = async (totalAmount?: number): Promise<OrderHandlerResult | undefined> => {
  if (isSubmitting) return;

  // Validate receiver info
  if (!context.state.receiverInfo.name || !context.state.receiverInfo.phone || !context.state.receiverInfo.address) {
    toast.error('Vui lòng điền đầy đủ thông tin người nhận.');
    return;
  }

  // Validate payment method
  if (!context.state.paymentMethod) {
    toast.error('Vui lòng chọn phương thức thanh toán.');
    return;
  }

  // Check if we have orders from Redux
  if (!shopOrders || shopOrders.length === 0) {
    toast.error('Không có sản phẩm nào để đặt hàng.');
    return;
  }    // Get the correct payment gateway ID from the selected payment method
    const getPaymentGatewayId = (paymentMethod: string): string => {
      // Map payment method IDs to the correct gateway format
      const paymentGatewayMap: { [key: string]: string } = {
        // 'cod': 'COD',
        // 'momo': 'momo',
        'sepay': 'sepay',
        'vnpay': 'vnpay'
      };
      return paymentGatewayMap[paymentMethod] || paymentMethod.toUpperCase();
    };

    const selectedPaymentGateway = getPaymentGatewayId(context.state.paymentMethod);

    setIsSubmitting(true);
    try {
      // Create order payload array for multiple shops
      const orderPayload: OrderCreateRequest = shopOrders.map(order => {
        const codesForThisShop: string[] = [];

        // Add shop-specific voucher code
        const shopVoucher = appliedVouchers[order.shopId];
        if (shopVoucher && shopVoucher.code) {
          codesForThisShop.push(shopVoucher.code);
        }

        // Add platform voucher code to each shop order
        if (appliedPlatformVoucher && appliedPlatformVoucher.code) {
          if (!codesForThisShop.includes(appliedPlatformVoucher.code)) {
            codesForThisShop.push(appliedPlatformVoucher.code);
          }
        }

        return {
          shopId: order.shopId,
          cartItemIds: order.cartItemIds,
          receiver: {
            name: context.state.receiverInfo.name,
            phone: context.state.receiverInfo.phone,
            address: context.state.receiverInfo.address,
          },
          paymentGateway: selectedPaymentGateway,
          discountCodes: codesForThisShop,
        };
      });

      // Console log để kiểm tra data trước khi gọi API
      console.log('📦 Order Payload Data:', {
        paymentMethod: context.state.paymentMethod,
        paymentGateway: selectedPaymentGateway,
        receiverInfo: context.state.receiverInfo,
        shopOrders: shopOrders,
        finalPayload: orderPayload
      });

      // Call the order service
      const response = await orderService.create(orderPayload);
      const orderData = response.data;

      // Handle different payment methods
      if (selectedPaymentGateway === 'sepay') {
        toast.success('Đơn hàng đã được tạo! Vui lòng quét mã QR để thanh toán.');
        
        const orderId = orderData.orders && orderData.orders.length > 0 
          ? orderData.orders[0].id 
          : undefined;
        const result = {
          success: true,
          paymentMethod: 'sepay',
          orderData: orderData,
          orderId: orderId,
          paymentId: orderData.paymentId
        };
        return result;
      } else if (selectedPaymentGateway === 'vnpay') {
        try {
          const vnPayResponse = await orderService.createPaymentVnPayUrl({
            amount: commonInfo.amount, // Lấy amount từ Redux state
            orderInfo: `DH${orderData.paymentId}`,
            orderId: orderData.paymentId.toString(),
            locale: 'vn'
          });
          
          toast.success('Đang chuyển hướng đến cổng thanh toán VNPay...');
          const orderId = orderData.orders && orderData.orders.length > 0 
            ? orderData.orders[0].id 
            : undefined;
            
          const result = {
            success: true,
            paymentMethod: 'vnpay',
            orderData: {
              ...orderData,
              finalTotal: commonInfo.amount // Lấy amount từ Redux state
            },
            orderId: orderId,
            paymentId: orderData.paymentId,
            paymentUrl: vnPayResponse.data.paymentUrl
          };
          return result;
        } catch (vnPayError: any) {
          console.error('Failed to generate VNPay URL:', vnPayError);
          toast.error('Không thể tạo URL thanh toán VNPay. Vui lòng thử lại.');
          const orderId = orderData.orders && orderData.orders.length > 0 
            ? orderData.orders[0].id 
            : undefined;
            
          return {
            success: false,
            paymentMethod: 'vnpay',
            orderData: orderData,
            orderId: orderId,
            error: vnPayError.message
          };
        }
      } else {
        // Các phương thức thanh toán khác (COD, ...)
        toast.success('Đặt hàng thành công!');
        router.push(`/checkout/success?orderId=${orderData.orders[0].id}`); // Navigate to success page with the first order's ID if available
        const orderId = orderData.orders && orderData.orders.length > 0 
          ? orderData.orders[0].id 
          : undefined;
          
        const result = {
          success: true,
          paymentMethod: selectedPaymentGateway,
          orderData: orderData,
          orderId: orderId,
          paymentId: orderData.paymentId
        };
        
        console.log('✅ Other Payment Result:', result);
        return result;
      }

    } catch (error: any) {
      console.error('Failed to create order:', error);
      toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng.');
      return {
        success: false,
        error: error.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng.'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: context.state,
    goToStep,
    updateReceiverInfo,
    updatePaymentMethod,
    updateShippingAddress,
    updateShippingMethod,
    isSubmitting,
    handleCreateOrder,
  };
};
