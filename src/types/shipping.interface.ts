// Shipping Address Interfaces

// Base Response Interface
export interface BaseShippingResponse<T> {
  statusCode: number;
  message: string;
  timestamp: string;
  data: T;
}

// Province Interfaces
export interface Province {
  ProvinceID: number;
  ProvinceName: string;
  Code?: string;
  CountryID: number;
}

export interface GetProvincesResponse extends BaseShippingResponse<Province[]> {}

// District Interfaces
export interface District {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
}

export interface GetDistrictsParams {
  provinceId: number;
}

export interface GetDistrictsResponse extends BaseShippingResponse<District[]> {}

// Ward Interfaces
export interface Ward {
  WardCode: string;
  DistrictID: number;
  WardName: string;
}

export interface GetWardsParams {
  districtId: number;
}

export interface GetWardsResponse extends BaseShippingResponse<Ward[]> {}

// Shipping Fee Calculation Interfaces (for future use)
export interface CalculateShippingFeeRequest {
  from_district_id: number;
  to_district_id: number;
  from_ward_code: string;
  to_ward_code: string;
  service_id?: number;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
}

export interface DeliveryTimeRequest{
  service_id: number;
  to_district_id: number;
  to_ward_code: string;
  from_district_id: number;
  from_ward_code: string
}
export interface DeliveryTimeResponse {
  data:{
    leadtime: number;
    expected_delivery_time: string;
  }
}
export interface ShippingFee {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
  return_again: number;
  document_return: number;
  double_check: number;
  cod_fee: number;
  pick_remote_areas_fee: number;
  deliver_remote_areas_fee: number;
  cod_failed_fee: number;
}

export interface ShippingService {
  service_id: number;
  short_name: string;
  service_type_id: number;
  config_fee_id: string;
  extra_cost_id: string;
  standard_config_fee_id: string;
  standard_extra_cost_id: string;
}

export interface ShippingServiceResponse {
  data: ShippingService | ShippingService[];
}
export interface CalculateShippingFeeResponse extends BaseShippingResponse<ShippingFee> {}

// Định nghĩa chuẩn cho một phương thức vận chuyển đã được xử lý
export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedTime: string;
  service_id: number;
  service_type_id: number;
  description?: string;
  features?: string[];
  icon?: 'truck' | 'package' | 'shield';
  config_fee_id: string | null;
  extra_cost_id: string | null;
  standard_config_fee_id: string | null;
  standard_extra_cost_id: string | null;
}
