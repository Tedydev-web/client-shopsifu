export interface PerCreateRequest {
    name: string;
    description: string;
    path: string;
    method: string;
}

export interface PerCreateResponse {
    id: string;
    name: string;
    createdById: string;
    updatedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface PerGetAllResponse {
    data: Array<{
        id: string;
        name: string;
        path: string;
        description: string;
        type: string;
        method: string;
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

export interface PerListResponse {
    data: PerGetAllResponse[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PerUpdateRequest {
    name: string;
    description: string;
    path: string;
    method: string;
}

export interface PerUpdateResponse {
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

export interface PerDeleteRequest {
    id: string;
}

export interface PerDeleteResponse {
    message: string;
}

export interface PerGetByIdResponse {
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