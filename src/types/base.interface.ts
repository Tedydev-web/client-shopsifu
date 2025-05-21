export interface ErrorResponse {
    message: Array<{
      message: string
      path: string
    }>
    error: string;
    statusCode: number;
  }


export interface PaginationRequest {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}