import { PaginationRequest } from "@/types/base.interface";

export interface OrderGetAllParams extends PaginationRequest {
  sortOrder?: OrderStatus;
  sortBy?: "asc" | "desc";
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

export interface ProductTranslation {
  id: string;
  name: string;
  description: string;
  languageId: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productTranslations: ProductTranslation[];
  skuPrice: number;
  image: string;
  skuValue: string;
  skuId: string;
  orderId: string;
  quantity: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  shopId: string;
  paymentId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface Metadata {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface OrderGetAllResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  data: Order[];
  metadata: Metadata;
}

/* ---------------------- GET BY ID ---------------------- */
export interface OrderGetByIdResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  data: Order;
}

/* ---------------------- CREATE ---------------------- */
export interface OrderCreateRequest {
  // Thêm các field khi tạo đơn hàng
}

export interface OrderCreateResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  data: Order;
}

/* ---------------------- CANCEL ---------------------- */
export interface OrderCancelResponse {
  statusCode: number;
  message: string;
  timestamp: string;
}
