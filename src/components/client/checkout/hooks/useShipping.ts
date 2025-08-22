import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { shippingService } from '@/services/shippingService';
import { selectShippingInfo } from '@/store/features/checkout/ordersSilde';
import { SHIPPING_CONFIG } from '@/constants/shipping';
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

export const useShipping = () => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get shipping info from Redux
  const shippingInfo = useSelector(selectShippingInfo);
  
  const fetchShippingServices = async () => {
    // Check if we have required info from Redux
    if (!shippingInfo?.districtId || !shippingInfo?.wardCode) {
      console.log('Missing shipping info:', { districtId: shippingInfo?.districtId, wardCode: shippingInfo?.wardCode });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting shipping services fetch...');
      console.log('Request params:', {
        fromDistrictId: SHIPPING_CONFIG.DEFAULT_FROM.districtId,
        toDistrictId: parseInt(shippingInfo.districtId!)
      });
      
      // Step 1: Get available shipping services
      const servicesResponse: ShippingServiceResponse = await shippingService.getServices({
        fromDistrictId: SHIPPING_CONFIG.DEFAULT_FROM.districtId,
        toDistrictId: parseInt(shippingInfo.districtId)
      });
      
      console.log('Services response:', servicesResponse);
      
      if (!servicesResponse.data) {
        throw new Error('No shipping services available');
      }
      
      // Handle both array and single service response
      const services = Array.isArray(servicesResponse.data) 
        ? servicesResponse.data 
        : [servicesResponse.data];
      
      // Step 2: For each service, calculate shipping fee and delivery time
      const enrichedMethods: ShippingMethod[] = await Promise.all(
        services.map(async (service) => {
          try {
            // Calculate shipping fee
            const feeRequest: CalculateShippingFeeRequest = {
              to_district_id: parseInt(shippingInfo.districtId!),
              to_ward_code: shippingInfo.wardCode!,
              height: SHIPPING_CONFIG.DEFAULT_PACKAGE.height,
              weight: SHIPPING_CONFIG.DEFAULT_PACKAGE.weight,
              length: SHIPPING_CONFIG.DEFAULT_PACKAGE.length,
              width: SHIPPING_CONFIG.DEFAULT_PACKAGE.width,
              service_id: service.service_id,
              from_district_id: SHIPPING_CONFIG.DEFAULT_FROM.districtId,
              from_ward_code: SHIPPING_CONFIG.DEFAULT_FROM.wardCode,
            };
            
            const [feeResponse, timeResponse] = await Promise.all([
              shippingService.calculateShippingFee(feeRequest),
              shippingService.calculateDeliveryTime({
                service_id: service.service_id,
                to_district_id: parseInt(shippingInfo.districtId!),
                to_ward_code: shippingInfo.wardCode!,
                from_district_id: SHIPPING_CONFIG.DEFAULT_FROM.districtId,
                from_ward_code: SHIPPING_CONFIG.DEFAULT_FROM.wardCode,
              })
            ]);
            
            console.log(`Service ${service.service_id} - Fee:`, feeResponse, 'Time:', timeResponse);
            
            return {
              id: service.service_id.toString(),
              name: service.short_name,
              price: feeResponse.data?.total || 0,
              estimatedTime: typeof timeResponse.data?.leadtime === 'number' 
                ? `${timeResponse.data.leadtime} ngày`
                : timeResponse.data?.leadtime || 'Đang cập nhật',
              description: `Phương thức vận chuyển ${service.short_name}`,
              features: [
                `Service ID: ${service.service_id}`,
                `Phí vận chuyển: ₫${(feeResponse.data?.total || 0).toLocaleString()}`,
              ],
              icon: 'truck' as const,
              service_id: service.service_id,
              service_type_id: service.service_type_id,
              config_fee_id: service.config_fee_id,
              extra_cost_id: service.extra_cost_id,
              standard_config_fee_id: service.standard_config_fee_id,
              standard_extra_cost_id: service.standard_extra_cost_id,
            };
          } catch (serviceError) {
            console.error(`Error processing service ${service.service_id}:`, serviceError);
            // Return service with default values if API calls fail
            return {
              id: service.service_id.toString(),
              name: service.short_name,
              price: 0,
              estimatedTime: 'Không thể tính toán',
              description: `Phương thức vận chuyển ${service.short_name}`,
              features: [`Service ID: ${service.service_id}`, 'Lỗi tính phí vận chuyển'],
              icon: 'truck' as const,
              service_id: service.service_id,
              service_type_id: service.service_type_id,
              config_fee_id: service.config_fee_id,
              extra_cost_id: service.extra_cost_id,
              standard_config_fee_id: service.standard_config_fee_id,
              standard_extra_cost_id: service.standard_extra_cost_id,
            };
          }
        })
      );
      
      setShippingMethods(enrichedMethods);
      console.log('Final shipping methods:', enrichedMethods);
    } catch (err) {
      console.error('Error fetching shipping data:', err);
      setError('Không thể tải thông tin vận chuyển');
    } finally {
      setLoading(false);
    }
  };
  
  // Auto fetch when shipping info changes
  useEffect(() => {
    if (shippingInfo?.districtId && shippingInfo?.wardCode) {
      fetchShippingServices();
    }
  }, [shippingInfo?.districtId, shippingInfo?.wardCode]);
  
  return {
    shippingMethods,
    loading,
    error,
    refetch: fetchShippingServices,
  };
};
