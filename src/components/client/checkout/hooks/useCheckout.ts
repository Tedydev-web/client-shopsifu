'use client';

import { useContext, useState } from 'react';
import { CheckoutContext } from '@/providers/CheckoutContext';
import { orderService } from '@/services/orderService';
import { useSelector } from 'react-redux';
import { selectShopOrders, selectShopProducts } from '@/store/features/checkout/ordersSilde';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { OrderCreateRequest } from '@/types/order.interface';
import { CheckoutStep } from '@/providers/CheckoutContext';

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  const router = useRouter();
  
  // 1. Get data from Redux
  const shopOrders = useSelector(selectShopOrders);
  const shopProducts = useSelector(selectShopProducts);

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

  const handleCreateOrder = async () => {
    if (isSubmitting) return;

    // Validate receiver info
    if (!context.state.receiverInfo.name || !context.state.receiverInfo.phone || !context.state.receiverInfo.address) {
      toast.error('Vui lòng điền đầy đủ thông tin người nhận.');
      return;
    }

    // Check if we have orders from Redux
    if (!shopOrders || shopOrders.length === 0) {
      toast.error('Không có sản phẩm nào để đặt hàng.');
      return;
    }

    // Get the correct payment gateway ID from the selected payment method
    const getPaymentGatewayId = (paymentMethod: string): string => {
      // Map payment method IDs to the correct gateway format
      const paymentGatewayMap: { [key: string]: string } = {
        'cod': 'COD',
        'momo': 'momo',
        'sepay': 'sepay',
        'vnpay': 'vnpay'
      };
      return paymentGatewayMap[paymentMethod] || paymentMethod.toUpperCase();
    };

    const selectedPaymentGateway = getPaymentGatewayId(context.state.paymentMethod);

    // Special handling for sepay (bank transfer)
    if (selectedPaymentGateway === 'sepay') {
      console.log('🏦 Đã chọn phương thức chuyển khoản ngân hàng (sepay)');
      // For sepay, we'll create the order first, then show QR code
      // The QR component will handle the payment confirmation
    }

    setIsSubmitting(true);
    try {
      // Create order payload array for multiple shops
      const orderPayload: OrderCreateRequest = shopOrders.map(order => ({
        shopId: order.shopId,
        cartItemIds: order.cartItemIds,
        receiver: {
          name: context.state.receiverInfo.name,
          phone: context.state.receiverInfo.phone,
          address: context.state.receiverInfo.address,
        },
        paymentGateway: selectedPaymentGateway,
        discountCodes: [], // Will be implemented later
      }));

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

      // Handle different payment methods
      if (selectedPaymentGateway === 'sepay') {
        // For sepay, we need to show QR code for payment
        // The response should contain paymentId for QR generation
        toast.success('Đơn hàng đã được tạo! Vui lòng quét mã QR để thanh toán.');
        
        const result = {
          success: true,
          paymentMethod: 'sepay',
          orderData: response.data,
          paymentId: response.data.paymentId
        };
        
        console.log('🎯 Sepay Order Result:', result);
        return result;
      } else {
        // For other payment methods (COD, etc.)
        toast.success('Đặt hàng thành công!');
        // router.push(`/user/purchase`);
        const result = {
          success: true,
          paymentMethod: selectedPaymentGateway,
          orderData: response.data
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
