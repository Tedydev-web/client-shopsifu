/**
 * API adapter utilities to transform API responses to a consistent format
 * required by hooks like useServerDataTable
 */
import { BaseResponse, PaginationMetadata } from "@/types/base.interface";

/**
 * Generic adapter function to make any API response compatible with the useServerDataTable hook
 * 
 * @param fetchFunction - Original API function that returns a Promise with API response
 * @returns A function that returns data in the format expected by useServerDataTable
 */
export function createDataTableAdapter<T, P = any>(
  fetchFunction: (params?: P) => Promise<BaseResponse<T[]>>
) {
  return async (params?: P) => {
    const response = await fetchFunction(params);
    
    // Ensure response has proper structure
    return {
      data: response.data || [],
      metadata: response.metadata || {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false
      } as PaginationMetadata
    };
  };
}
