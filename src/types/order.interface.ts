import { PaginationRequest, PaginationMetadata } from "@/types/base.interface";
import { Discount } from './discount.interface';

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
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    orders: {
      id: string;
      userId: string;
      status: OrderStatus;
      receiver: {
        name: string;
        phone: string;
        address: string;
      };
      shopId: string;
      paymentId: number;
      createdById: string;
      updatedById: string | null;
      deletedById: string | null;
      deletedAt: string | null;
      createdAt: string;
      updatedAt: string;
    }[];
    paymentId: number;
  }
}

// --- Interfaces cho Lấy Đơn hàng (Get Order) ---

interface OrderReceiver {
  name: string;
  phone: string;
  address: string;
}

interface ProductTranslation {
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
  status: OrderStatus;
  receiver: OrderReceiver;
  shopId: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  totalItemCost: number;
  totalShippingFee: number;
  totalVoucherDiscount: number;
  totalPayment: number;
}

/**
 * @interface ProductInfo
 * @description Thông tin chi tiết sản phẩm cho trang checkout
 */
export interface ProductInfo {
  id: string;
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

export interface OrderGetByIdResponse {
  data: Order;
  metadata: PaginationMetadata;
}


export interface OrderCancelResponse {
  // Dữ liệu trả về sau khi huỷ đơn
  message: string;
}

export interface CreatePaymentVnPayUrl{
  amount: number;
  orderInfo: string;
  orderId: string | number;  // paymentId có thể là string hoặc number từ API
  locale: string | "vn";  
}
export interface CreatePaymentVnPayUrlResponse{
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
      paymentUrl: string;
  }
}

// Interface cho kết quả trả về từ hàm handleCreateOrder
export interface OrderHandlerResult {
  success: boolean;
  paymentMethod?: string;
  orderData?: {
    orders?: any[];
    paymentId?: number;
    [key: string]: any;
  };
  orderId?: string; // The ID of the order (from the first order in orders array)
  paymentId?: number;
  paymentUrl?: string;
  error?: string;
}






/**
 * @interface Calculate Order
 * @description API Tính toán giá trị đơn hàng kèm mã giảm giá
 */
export interface CalculateOrderRequest{
  cartItemIds: string[];
  discountCodes: string[];
}
export interface CalculateOrderResponse{
  statusCode: number;
    message: string;
    timestamp: string;
    data: {
        totalItemCost: number;
        totalShippingFee: number;
        totalVoucherDiscount: number;
        totalPayment: number;
    }
}

export interface AppliedVoucherInfo {
  code: string;
  discount: Discount;
  discountAmount: number;
}
