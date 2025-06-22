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
    metadata?:{
      totalItems?: number,
      page?: number,
      limit?: number,
      totalPages?: number
      search?: string
    };
    page?: number;
    limit?: number;
    search?: string;
    "all-records"?: boolean;
}
