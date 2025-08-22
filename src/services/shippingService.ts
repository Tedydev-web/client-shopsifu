import { privateAxios, publicAxios } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import {
  GetProvincesResponse,
  GetDistrictsParams,
  GetDistrictsResponse,
  GetWardsParams,
  GetWardsResponse,
  CalculateShippingFeeRequest,
  CalculateShippingFeeResponse,
  DeliveryTimeRequest,
  DeliveryTimeResponse,
  ShippingServiceResponse,
} from "@/types/shipping.interface";

export const shippingService = {
  // 1. Get All Provinces
  getProvinces: async (signal?: AbortSignal): Promise<GetProvincesResponse> => {
    const response = await publicAxios.get(API_ENDPOINTS.ADDRESS.GET_PROVINCES, {
      signal,
    });
    return response.data;
  },

  // 2. Get Districts by Province ID
  getDistricts: async (
    params: GetDistrictsParams,
    signal?: AbortSignal
  ): Promise<GetDistrictsResponse> => {
    const response = await publicAxios.get(API_ENDPOINTS.ADDRESS.GET_DISTRICTS, {
      params,
      signal,
    });
    return response.data;
  },

  // 3. Get Wards by District ID
  getWards: async (
    params: GetWardsParams,
    signal?: AbortSignal
  ): Promise<GetWardsResponse> => {
    const response = await publicAxios.get(API_ENDPOINTS.ADDRESS.GET_WARDS, {
      params,
      signal,
    });
    return response.data;
  },

  // 4. Calculate Shipping Fee - Test with publicAxios to fix CORS
  calculateShippingFee: async (
    data: CalculateShippingFeeRequest,
    signal?: AbortSignal
  ): Promise<CalculateShippingFeeResponse> => {
    const response = await publicAxios.post(
      API_ENDPOINTS.SHIPPING.CALCULATE_FEE,
      data,
      { signal }
    );
    return response.data;
  },

  // 5. Calculate Delivery Time - Test with publicAxios to fix CORS
  calculateDeliveryTime: async (
    data: DeliveryTimeRequest,
    signal?: AbortSignal
  ): Promise<DeliveryTimeResponse> => {
    const response = await publicAxios.post(
      API_ENDPOINTS.SHIPPING.DELIVERY_TIME,
      data,
      { signal }
    );
    return response.data;
  },

  // 6. Get Shipping Services - Test with publicAxios to fix CORS
  getServices: async (
    params: { fromDistrictId: number; toDistrictId: number },
    signal?: AbortSignal
  ): Promise<ShippingServiceResponse> => {
    const response = await publicAxios.get(API_ENDPOINTS.SHIPPING.SERVICE, {
      params,
      signal,
    });
    return response.data;
  },
};

export default shippingService;
