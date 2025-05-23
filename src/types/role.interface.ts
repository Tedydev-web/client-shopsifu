
export interface Permission {
    id: string;
    name: string;
    code: string;
    description: string;
    groupName: string;
}

export type RoleType = 'admin' | 'seller' | 'customer';

export interface RoleRequest {
    name: string;
    description: string;
    role: RoleType;
    status: 'active' | 'inactive';
}

export interface RoleResponse {
    id: string;
    fullName: string;
    image?: string;
    name: string;
    description: string;
    role: RoleType;
    status: 'active' | 'inactive';
    permissions: Permission[];
    createdAt: number;
    updatedAt: number;
}

export interface RoleCreateRequest {
    id: string;
    name: string;
    description: string;
    role: RoleType;
    status: 'active' | 'inactive';
    permissions: string[];
}

export interface RoleCreateResponse {
    id: string;
    name: string;
    description: string;
    role: RoleType;
    status: 'active' | 'inactive';
    permissions: Permission[];
    createdAt: number;
}

export interface RoleUpdateRequest {
    id: string;
    name: string;
    description: string;
    role: RoleType;
    status: 'active' | 'inactive';
    permissions: string[];
}