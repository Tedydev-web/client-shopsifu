// export interface BaseResponse<T> {
//   status?: number;
//   success?: boolean;
//   statusCode?: number;
//   title?: string;
//   message?: string;
//   timestamp?: string;
//   requestId?: string;
//   data: T;
//   metadata?: PaginationMetadata;
// }

export interface BaseResponse {
  status?: number;
  success?: boolean;
  statusCode?: number;
  title?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
  data: any; // Sử dụng any thay vì generic type T
  metadata?: PaginationMetadata;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  createdById?: number;
}

export interface PaginationMetadata {
  totalItems?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  hasPrev?: boolean; // Added to support both naming conventions
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  createdById?: number;
}

/**
 * @interface BaseEntity
 * @description A base interface for all entities, containing common properties.
 */
export interface BaseEntity {
    id: number;
    createdById: number;
    updatedById: number | null;
    deletedById: number | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface MediaUploadResponse {
  data: {
    data: {
      url: string;
    }[];
  };
}