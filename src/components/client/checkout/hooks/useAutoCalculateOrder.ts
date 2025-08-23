import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  selectCalculateOrderRequest,
  selectCalculationResult,
  selectShopOrders,
  selectAppliedPlatformVoucher
} from '@/store/features/checkout/ordersSilde';
import { useCalculateOrder } from './useCalculateOrder';

export const useAutoCalculateOrder = () => {
  const calculateOrderRequest = useSelector(selectCalculateOrderRequest);
  const calculationResult = useSelector(selectCalculationResult);
  const shopOrders = useSelector(selectShopOrders);
  const appliedPlatformVoucher = useSelector(selectAppliedPlatformVoucher);
  
  const { calculateOrder, loading, error, canCalculate } = useCalculateOrder();
  
  // Sử dụng ref để track request hash và tránh gọi API trùng lặp
  const lastCalculationHashRef = useRef<string>('');
  const isCalculatingRef = useRef(false);

  useEffect(() => {
    if (!canCalculate || isCalculatingRef.current) {
      return;
    }

    // Tạo hash từ các dữ liệu quan trọng
    const calculationHash = JSON.stringify({
      shopOrders: shopOrders.map(order => ({
        shopId: order.shopId,
        cartItemIds: order.cartItemIds,
        shippingFee: order.shippingFee,
        discountCodes: order.discountCodes,
      })),
      platformVoucherCode: appliedPlatformVoucher?.code || null,
    });

    // Chỉ tính toán nếu có thay đổi thực sự
    if (calculationHash !== lastCalculationHashRef.current) {
      lastCalculationHashRef.current = calculationHash;
      isCalculatingRef.current = true;
      
      calculateOrder().finally(() => {
        isCalculatingRef.current = false;
      });
    }
  }, [
    canCalculate,
    calculateOrder,
    shopOrders,
    appliedPlatformVoucher?.code,
  ]);

  return {
    calculationResult,
    loading,
    error,
    canCalculate,
  };
};
