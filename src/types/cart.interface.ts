import { BaseResponse, BaseEntity, PaginationMetadata } from "./base.interface"

/**
 * @interface CartItem
 * @description Đại diện cho một mặt hàng trong giỏ hàng
 */
export interface CartItem extends BaseEntity {
    skuId: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    variant?: string;
    stock?: number;
    isSelected?: boolean;
}

/**
 * @interface Cart
 * @description Đại diện cho toàn bộ giỏ hàng của người dùng
 */
export interface Cart extends BaseEntity {
    userId?: string;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    totalSelectedItems?: number;
    totalSelectedPrice?: number;
}

/**
 * @interface CartResponse
 * @description Đại diện cho response API khi lấy thông tin giỏ hàng
 */
export interface CartResponse extends BaseResponse {
    data: Cart;
}

/**
 * @interface CartListResponse
 * @description Đại diện cho response API khi lấy danh sách giỏ hàng (nếu cần)
 */
export interface CartListResponse extends BaseResponse {
    data: Cart[];
    metadata?: PaginationMetadata;
}

/**
 * @interface CartItemRequest
 * @description Request để thêm hoặc cập nhật sản phẩm vào giỏ hàng
 */
export interface CartItemRequest {
    skuId: string;
    quantity: number;
}

/**
 * @interface UpdateCartItemRequest
 * @description Request để cập nhật sản phẩm trong giỏ hàng
 */
export interface UpdateCartItemRequest {
    quantity: number;
    isSelected?: boolean;
}

/**
 * @interface DeleteCartRequest
 * @description Request để xóa các sản phẩm khỏi giỏ hàng
 */
export interface DeleteCartRequest {
    itemIds: string[];
}