import { BaseResponse } from "./base.interface";

/**
 * @interface GetGuestDiscountList
 * @description API Lấy danh sách mã giảm giá dành cho Users Client
 */
export interface GetGuestDiscountListResponse extends BaseResponse{
    data: [
        {
            id: string;
            name: string;
            description: string;
            value: number;
            code: string;
            startDate: string;
            endDate: string;
            usesCount: number;
            usersUsed: string[];
            maxUsesPerUser: number;
            minOrderValue: number;
            maxUses: number;
            shopId: string;
            maxDiscountValue: number;
            displayType: string;
            voucherType: string;
            isPlatform: boolean;
            discountApplyType: string;
            discountStatus: string;
            discountType: string;
            createdById: string;
            updatedById: string;
            deletedById: string;
            deletedAt: string;
            createdAt: string;
            updatedAt: string;
        }
    ]
}

/**
 * @interface ValidateDiscount
 * @description API Kiểm tra mã giảm giá
 */
export interface ValidateDiscountRequest{
    code: string;
    cartItemIds: string[];
}
export interface ValidateDiscountResponse extends BaseResponse{
    data: {
        isValid: boolean;
        discount: {
            id: string;
            name: string;
            description: string;
            value: number;
            code: string;
            startDate: string;
            endDate: string;
            usesCount: number;
            usersUsed: string[];
            maxUsesPerUser: number;
            minOrderValue: number;
            maxUses: number;
            shopId: string;
            maxDiscountValue: number;
            displayType: string;
            voucherType: string;
            isPlatform: boolean;
            discountApplyType: string;
            discountStatus: string;
            discountType: string;
            createdById: string;
            updatedById: string;
            deletedById: string;
            deletedAt: string;
            createdAt: string;
            updatedAt: string;
        },
        discountAmount: number,
        finalOrderTotal: number
    }
}

// ------------------------------------------------------------------
/**
 * @interface ManageDiscount
 * @description API Quản lý mã giảm giá (Create, Update, Delete)
 */
export interface ListDiscountResponse extends BaseResponse
{
    data:[
        {
            id: string;
            name: string;
            description: string;
            value: number;
            code: string;
            startDate: string;
            endDate: string;
            usesCount: number;
            usersUsed: string[];
            maxUsesPerUser: number;
            minOrderValue: number;
            maxUses: number;
            shopId: string;
            maxDiscountValue: number;
            displayType: string;
            voucherType: string;
            isPlatform: boolean;
            discountApplyType: string;
            discountStatus: string;
            discountType: string;
            createdById: string;
            updatedById: string;
            deletedById: string;
            deletedAt: string;
            createdAt: string;
            updatedAt: string
        }
    ]
}

/**
 * @interface CreateDiscountRequest
 * @description API Tạo mã giảm giá
 */
export interface CreateDiscountRequest
{
    name: string;
    description: string;
    value: number;  
    code: string;
    startDate: string;
    endDate: string;
    maxUsesPerUser: number;
    minOrderValue: number;
    maxUses: number;
    maxDiscountValue: number;
    displayType: string;
    voucherType: string;
    isPlatform: boolean;
    shopId?: string;
    discountApplyType: string;
    discountStatus: string;
    discountType: string;
}
