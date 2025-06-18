import { BaseResponse, PaginationRequest } from "../base.interface";


export interface Permission {
    id: string;
    name: string;
    description: string;
    path: string;
    method: string;
    createdById: string;
    updatedById: string;
    deletedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export type RoleType = 'admin' | 'seller' | 'client' | 'editor';

export interface RoleRequest {
    name: string;
    description: string;
    role: RoleType;
    isActive: boolean;
}

export interface RoleResponse {
    id: string;
    name: string;
    description: string;
    role: RoleType;
    isActive: boolean;
    permissions: Array<Permission>;
    createdAt: number;
    updatedAt: number;
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface RoleGetAllResponse extends BaseResponse {
  data: Array<{
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdById: string;
    updatedById: string;
    deletedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
    permissions: Array<{
        id: number,
        description: string,
        createdById: string,
        updatedById: string,
        deletedById: string,
        deletedAt: string,
        action: string,
        subject: string,
        conditions: string,
        createdAt: string,
        updatedAt: string,
        isSystemPermission: boolean
        }>;
  }>;
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoleGetByIdResponse {
    id: string;
    name: string;
    description: string;
    role: RoleType;
    isActive: boolean;
    permissions: Permission[];
    createdById: string,
    updatedById: string,
    deletedById: string,
    deletedAt: string,
    createdAt: string;
    updatedAt: string;
}

export interface RoleCreateRequest extends BaseResponse {
    name: string;
    description?: string;
    isSystemRole?: boolean;
    isSuperAdmin?: boolean;
    permissionIds?: number[];
}

export interface RoleCreateResponse extends BaseResponse {
    data:{
        id: number,
        name: string,
        description: string,
        createdById: string,
        updatedById: string,
        deletedById: string,
        deletedAt: string,
        createdAt: string,
        updatedAt: string,
        isSystemRole: boolean,
        isSuperAdmin: boolean,
        permissions: Permission[]
    }
   
}

export interface RoleUpdateRequest extends BaseResponse {
    name?: string;
    description?: string;
    isActive?: boolean;
    isSystemRole?: boolean;
    isSuperAdmin?: boolean;
    permissionIds?: number[];
}

export interface RoleUpdateResponse extends BaseResponse {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    permissions: Permission[];
    createdById: string;
    updatedById: string;
    deletedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface RoleDeleteRequest {
    id: string;
    hardDelete?: boolean;
}

export interface RoleDeleteResponse {
    message: string;
}

export interface RoleAssignPermissionRequest {
    id: string;
    permissionIds: string[];
}

export interface RoleAssignPermissionResponse {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    permissions: Permission[];
    createdById: string;
    updatedById: string;
    deletedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface Role {
  id?: number
  name: string
  description?: string
  isActive: boolean
  permissionIds?: string[]
}