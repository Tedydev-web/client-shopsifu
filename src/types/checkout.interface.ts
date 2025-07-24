export interface CustomerFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  saveInfo: boolean;
  receiverName?: string;
  receiverPhone?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  note?: string;
  deliveryMethod: string;
}

export interface ShippingAddress {
  address: string;
  name: string;
  phone: string;
}

export interface Address {
  id: string;
  isDefault: boolean;
  receiverName: string;
  receiverPhone: string;
  addressDetail: string;
  ward: string;
  district: string;
  province: string;
  type: 'NHÀ RIÊNG' | 'VĂN PHÒNG';
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
} 