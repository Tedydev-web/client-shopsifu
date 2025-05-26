
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
    permissions: Permission[];
    createdAt: number;
    updatedAt: number;
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface RoleGetAllResponse {
  data: Array<{
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    permissions: Permission[]; // Nếu biết rõ kiểu thì thay `any` bằng kiểu cụ thể
    createdById: string;
    updatedById: string;
    deletedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
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

export interface RoleCreateRequest {
    name: string;
    description: string;
    isActive: boolean;
    permissionIds: string[];
}

export interface RoleCreateResponse {
    name: string;
    description: string;
    role: RoleType;
    isActive: boolean;
    createdAt: string;
    permissionIds: string[];
}

export interface RoleUpdateRequest {
    name: string;
    description: string;
    isActive: boolean;
    permissionIds: string[];
}

export interface RoleUpdateResponse {
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