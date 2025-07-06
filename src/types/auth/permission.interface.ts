import { BaseResponse, PaginationRequest } from "../base.interface";

// Định nghĩa chi tiết dữ liệu permission
export interface PermissionDetail {
    id: number;
    name: string;
    description: string;
    module: string;
    path: string;
    method: string;
    createdById: string;
    updatedById: string;
    deletedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

// Interface request và response
export interface PerCreateRequest {
    name: string;
    module: string;
    path: string;
    method: string;
}

export interface PerUpdateRequest {
    name: string;
    module: string;
    path: string;
    method: string;
}

// Loại bỏ generic và định nghĩa rõ kiểu data 
export interface PerGetAllResponse extends BaseResponse {
    data: PermissionDetail[]; // Chỉ định rõ kiểu dữ liệu tại đây
}

export interface PerCreateResponse extends BaseResponse {
    data: PermissionDetail; // Chỉ định rõ kiểu dữ liệu tại đây
}

export interface PerUpdateResponse extends BaseResponse {
    data: PermissionDetail;
}

export interface PerDeleteResponse extends BaseResponse {
    data: { message: string };
}

export interface PerGetByIdResponse extends BaseResponse {
    data: PermissionDetail;
}

// Interface khác
export interface PerListResponse {
    data: PermissionDetail[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PerDeleteRequest {
    id: string;
}

export interface PermissionItem {
    id: number;
    action: string;
    description: string;
}