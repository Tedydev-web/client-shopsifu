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
  to_ward_code: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  service_id?: number;
  service_type_id?: number;
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

export interface CalculateShippingFeeResponse extends BaseShippingResponse<ShippingFee> {}
