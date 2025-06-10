export interface BaseResponse {
    status: number;
    title: string;
    message: string;
    timestamp: string;
    requestId: string;
  }


export interface PaginationRequest {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}


