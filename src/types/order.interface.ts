import { PaginationRequest } from "@/types/base.interface";

export interface OrderGetAllParams extends PaginationRequest {
  sortOrder?: 'PENDING_PAYMENT' | 'PENDING_PICKUP' | 'PENDING_DELIVERY' | 'DELIVERED' | 'RETURNED' | 'CANCELLED';
  sortBy?: 'asc' | 'desc';
  search?: string;
}

export enum OrderStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PENDING_PICKUP = "PENDING_PICKUP",
  PENDING_DELIVERY = "PENDING_DELIVERY",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
  CANCELLED = "CANCELLED",
}

export interface OrderGetAllResponse {
  data: any[]; // Thay `any` bằng model đơn hàng thực tế nếu có
  total: number;
  page: number;
  limit: number;
}

export interface OrderGetByIdResponse {
  // Cấu trúc response chi tiết đơn hàng
}

export interface OrderCreateRequest {
  // Dữ liệu gửi lên để tạo đơn hàng
}

export interface OrderCreateResponse {
  // Dữ liệu trả về sau khi tạo đơn
}

export interface OrderCancelResponse {
  // Dữ liệu trả về sau khi huỷ đơn
}
