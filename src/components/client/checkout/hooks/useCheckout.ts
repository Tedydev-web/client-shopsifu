'use client';

import { useContext, useState } from 'react';
import { CheckoutContext } from '@/providers/CheckoutContext';
import { orderService } from '@/services/orderService';
import { useSelector } from 'react-redux';
import { selectShopOrders, selectShopProducts } from '@/store/features/checkout/ordersSilde';
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate total amount from all products in all shops
  const calculateTotalAmount = (): number => {
    // Calculate subtotal from all products
    const subtotal = Object.values(shopProducts).reduce((total, shopProducts) => {
      return total + shopProducts.reduce((shopTotal, product) => {
        return shopTotal + (product.price * product.quantity);
      }, 0);
    }, 0);

    // Phí vận chuyển và giảm giá (hiện tại đang là 0)
    const shippingFee = 0;
    const voucherDiscount = 0;
    
    // Tổng tiền thanh toán
    return subtotal + shippingFee - voucherDiscount;
  };

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

  // Check if we have orders from Redux
  if (!shopOrders || shopOrders.length === 0) {
    toast.error('Không có sản phẩm nào để đặt hàng.');
    return;
  }    // Get the correct payment gateway ID from the selected payment method
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
      const orderData = response.data;

      // Handle different payment methods
      if (selectedPaymentGateway === 'sepay') {
        toast.success('Đơn hàng đã được tạo! Vui lòng quét mã QR để thanh toán.');
        
        // Ensure we have order data and extract the first order's ID if available
        const orderId = orderData.orders && orderData.orders.length > 0 
          ? orderData.orders[0].id 
          : undefined;
        
        const result = {
          success: true,
          paymentMethod: 'sepay',
          orderData: orderData,
          orderId: orderId, // Include the order ID correctly
          paymentId: orderData.paymentId
        };
        
        console.log('🎯 Sepay Order Result:', result);
        return result;
      } else if (selectedPaymentGateway === 'vnpay') {
        try {
          // Tạo URL thanh toán VNPay
          const vnPayResponse = await orderService.createPaymentVnPayUrl({
            amount: totalAmount || calculateTotalAmount(), // Sử dụng tổng tiền được truyền vào hoặc tính toán lại
            orderInfo: `DH${orderData.paymentId}`,
            orderId: orderData.paymentId.toString(), // Đảm bảo đây là string
            locale: 'vn'
          });
          
          toast.success('Đang chuyển hướng đến cổng thanh toán VNPay...');
          
          // Ensure we have order data and extract the first order's ID if available
          const orderId = orderData.orders && orderData.orders.length > 0 
            ? orderData.orders[0].id 
            : undefined;
            
          const result = {
            success: true,
            paymentMethod: 'vnpay',
            orderData: {
              ...orderData,
              finalTotal: totalAmount || calculateTotalAmount() // Thêm finalTotal vào orderData
            },
            orderId: orderId, // Include the order ID correctly
            paymentId: orderData.paymentId, // Thêm paymentId cho socket
            paymentUrl: vnPayResponse.data.paymentUrl
          };
          
          console.log('🔄 VNPay Payment URL Generated:', result);
          return result;
        } catch (vnPayError: any) {
          console.error('Failed to generate VNPay URL:', vnPayError);
          toast.error('Không thể tạo URL thanh toán VNPay. Vui lòng thử lại.');
          // Ensure we have order data and extract the first order's ID if available
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
        
        // Ensure we have order data and extract the first order's ID if available
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
