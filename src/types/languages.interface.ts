export interface LangCreateRequest {
    id: string;
    name: string;
}

export interface LangCreateResponse {
    id: string;
    name: string;
    createdById: string;
    updatedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface LangGetAllRequest {
    page?: number;
    limit?: number;
    search?: string;
}

export interface LangGetAllResponse {
    data: Array<{
        id: string;
        name: string;
        createdById: string;
        updatedById: string;
        deletedAt: string;
        createdAt: string;
        updatedAt: string;
    }>;
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

export interface LangUpdateRequest {
    name: string;
}

export interface LangUpdateResponse {
    id: string;
    name: string;
    createdById: string;
    updatedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface LangDeleteRequest {
    id: string;
}

export interface LangDeleteResponse {
    message: string;
}

export interface LangGetByIdResponse {
    id: string;
    name: string;
    createdById: string;
    updatedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}
