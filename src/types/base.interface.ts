export interface ErrorResponse {
    message: Array<{
      message: string
      path: string
    }>
    error: string;
    statusCode: number;
  }
