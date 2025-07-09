import { BaseResponse } from "@/types/base.interface";

export interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  search?: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  username?: string;
  phoneNumber: string;
  bio: string;
  avatar: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedById: string | null;
  updatedById: string | null;
  createdById: string | null;
}

// export interface User {
//   id: number;
//   email: string;
//   status: string;
//   roleId: number;
//   isEmailVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
//   userProfile?: UserProfile;
// }

export interface UserRole {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  status: string;
  roleId: number;
  createdById: number | null;
  updatedById: number | null;
  deletedById: number | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
}

// LẤY TẤT CẢ DANH SÁCH NGƯỜI DÙNG - GET ALL USER
export interface UserGetAllResponse extends BaseResponse {
  data: User[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// TẠO NGƯỜI DÙNG - CREATE USER
export interface UserCreateRequest {
  email: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  password: string;
  confirmPassword?: string; // Made optional since it's only used for frontend validation
  roleId: number;
  status: string;
}

export interface UserCreateResponse extends BaseResponse {
  data: User;
}

// SỬA NGƯỜI DÙNG - UPDATE USER
export interface UserUpdateRequest {
  // id excluded from the request body as it should be provided as URL parameter only
  email?: string;
  name?: string;
  phoneNumber?: string;
  avatar?: string;
  roleId?: number;
  status?: string;
}

export interface UserUpdateResponse extends BaseResponse {
  data: User;
}

// XÓA NGƯỜI DÙNG - DELETE USER
export interface UserDeleteResponse extends BaseResponse {}
