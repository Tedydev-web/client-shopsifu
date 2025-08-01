import { PaginationRequest } from "@/types/base.interface";

export interface OrderGetAllParams extends PaginationRequest {
  sortOrder?: OrderStatus;
  sortBy?: "asc" | "desc";
  search?: string;
}

import { PaginationMetadata } from "./base.interface";

export enum OrderStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PENDING_PICKUP = "PENDING_PICKUP",
  PENDING_DELIVERY = "PENDING_DELIVERY",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
  CANCELLED = "CANCELLED",
}

// --- Interfaces cho Tạo Đơn hàng (Create Order) ---
interface ReceiverInfo {
  name: string;
  phone: string;
  address: string;
}

interface OrderCreationInfo {
  shopId: string;
  cartItemIds: string[];
  receiver: ReceiverInfo;
  discountCodes: string[];
  paymentGateway: string;
}

export type OrderCreateRequest = OrderCreationInfo[];

export interface OrderCreateResponse {
  // Dữ liệu trả về sau khi tạo đơn hàng thành công
  // Ví dụ: có thể chứa danh sách các orderId đã được tạo
  [key: string]: any;
}

// --- Interfaces cho Lấy Đơn hàng (Get Order) ---

interface ProductTranslation {
  id: string;
  name: string;
  description: string;
  languageId: string;
}

interface OrderItem {
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
  status: OrderStatus;
  shopId: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

/**
 * @interface ProductInfo
 * @description Thông tin chi tiết sản phẩm cho trang checkout
 */
export interface ProductInfo {
  shopName: string;
  name: string;
  image: string;
  variation: string;
  quantity: number;
  subtotal: number;
  price: number;
}

export interface OrderGetAllResponse {
  data: Order[];
  metadata: PaginationMetadata;
}

export type OrderGetByIdResponse = Order;


export interface OrderCancelResponse {
  // Dữ liệu trả về sau khi huỷ đơn
  message: string;
}

export interface CreatePaymentVnPayUrl{
  amount: number;
  orderInfo: string;
  orderId: string;
  locale: string | "vn";  
}