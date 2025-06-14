export interface BaseResponse {
    status: number;
    success: boolean;
    statusCode: number;
    title: string;
    message: string;
    timestamp: string;
    requestId: string;
  }


export interface PaginationRequest {
    meta:{
      currentPage: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
    }
}


