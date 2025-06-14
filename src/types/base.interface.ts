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
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}


