export interface BaseResponse {
    status?: number;
    success?: boolean;
    statusCode?: number;
    title?: string;
    message: string;
    timestamp?: string;
    requestId?: string;
  }


export interface PaginationRequest {
    meta?:{
      totalItems: number,
      page: number,
      limit: number,
      totalPages: number
    };
    page?: number;
    limit?: number;
    search?: string;
    "all-records"?: boolean;
}
