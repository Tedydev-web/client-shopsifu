export interface BaseResponse<T> {
  status?: number;
  success?: boolean;
  statusCode?: number;
  title?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
  data: T;
  metadata?: PaginationMetadata;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface PaginationMetadata {
  totalItems?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}
