import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { shippingService } from '@/services/shippingService';
import { selectShippingInfo, selectShopOrders } from '@/store/features/checkout/ordersSilde';
import { SHIPPING_CONFIG } from '@/constants/shipping';
import { useShopAddress } from './useShopAddress';
import { 
  ShippingServiceResponse, 
  CalculateShippingFeeRequest,
  CalculateShippingFeeResponse,
  DeliveryTimeRequest,
  DeliveryTimeResponse 
} from '@/types/shipping.interface';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedTime: string;
  description: string;
  features: string[];
  icon: 'truck' | 'package' | 'shield';
  service_id: number;
  service_type_id: number;
  config_fee_id: string;
  extra_cost_id: string;
  standard_config_fee_id: string;
  standard_extra_cost_id: string;
}

export const useShipping = (shopId?: string) => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get shipping info from Redux
  const shippingInfo = useSelector(selectShippingInfo);
  const shopOrders = useSelector(selectShopOrders);
  
  // Get shop address using the new hook
  const { shopAddress, loading: addressLoading, error: addressError } = useShopAddress(shopId || '');
  
  // Get first shop ID if not provided
  const effectiveShopId = shopId || (shopOrders.length > 0 ? shopOrders[0].shopId : '');
  
  const fetchShippingServices = async () => {
    if (!shippingInfo?.districtId || !shippingInfo?.wardCode || !shopAddress) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const servicesResponse = await shippingService.getServices({
        fromDistrictId: shopAddress.districtId,
        toDistrictId: parseInt(shippingInfo.districtId),
      });

      if (servicesResponse.data && Array.isArray(servicesResponse.data) && servicesResponse.data.length > 0) {
        const shopOrder = shopOrders.find(o => o.shopId === effectiveShopId);
        const totalWeight = shopOrder?.cartItemIds.length || 1; // Giả định trọng lượng

        const methodsPromises = servicesResponse.data.map(async (service) => {
          try {
            const [feeResponse, timeResponse] = await Promise.all([
              shippingService.calculateShippingFee({
                from_district_id: shopAddress.districtId,
                from_ward_code: shopAddress.wardCode,
                to_district_id: parseInt(shippingInfo.districtId),
                to_ward_code: shippingInfo.wardCode,
                service_id: service.service_id,
                //insurance_value: 500000, // Cần thay bằng giá trị thực tế
                weight: totalWeight * 200, // Cần thay bằng trọng lượng thực tế
                length: 20,
                width: 20,
                height: 10,
              }),
              shippingService.calculateDeliveryTime({
                from_district_id: shopAddress.districtId,
                from_ward_code: shopAddress.wardCode,
                to_district_id: parseInt(shippingInfo.districtId),
                to_ward_code: shippingInfo.wardCode,
                service_id: service.service_id,
              }),
            ]);

            const expectedDeliveryDate = new Date(timeResponse.data.expected_delivery_time);
            const formattedDate = expectedDeliveryDate.toLocaleDateString('vi-VN', {
              weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric',
              timeZone: 'Asia/Ho_Chi_Minh',
            });

            return {
              ...service,
              id: String(service.service_id),
              name: service.short_name,
              price: feeResponse.data.total,
              estimatedTime: `Nhận hàng dự kiến ${formattedDate}`,
              description: 'Giao hàng tiêu chuẩn',
              features: ['Giao giờ hành chính'],
              icon: service.service_type_id === 5 ? 'package' : 'truck',
            } as ShippingMethod;
          } catch (error) {
            console.error(`Failed to process service ${service.service_id}:`, error);
            return null;
          }
        });

        const settledMethods = await Promise.all(methodsPromises);
        const validMethods = settledMethods.filter((method): method is ShippingMethod => method !== null);
        
        setShippingMethods(validMethods);
      } else {
        setShippingMethods([]);
      }
    } catch (err: any) {
      console.error('Error fetching shipping services:', err);
      setError('Không thể tải danh sách dịch vụ vận chuyển.');
    } finally {
      setLoading(false);
    }
  };
  
  // Auto fetch when shipping info or shop address changes
  useEffect(() => {
    if (shippingInfo?.districtId && shippingInfo?.wardCode && shopAddress && !addressLoading) {
      fetchShippingServices();
    }
  }, [shippingInfo?.districtId, shippingInfo?.wardCode, shopAddress, addressLoading]);
  
  return {
    shippingMethods,
    loading: loading || addressLoading,
    error: error || addressError,
    refetch: fetchShippingServices,
  };
};
