import { publicAxios } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { 
  ClientProductsResponse, 
  ClientProductDetail, 
  ClientProductsListParams 
} from "@/types/client.products.interface";

export const clientProductsService = {
  /**
   * Get a list of products with flexible filtering options
   * @param params - All parameters for filtering, pagination, etc.
   * @returns Promise with the products response
   */
  getProducts: async (params?: ClientProductsListParams): Promise<ClientProductsResponse> => {
    try {
      const response = await publicAxios.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching client products:", error);
      throw error;
    }
  },

  /**
   * Get detailed information about a specific product
   * @param id - The product ID
   * @returns Promise with the product detail
   */
  getProductDetail: async (id: string): Promise<ClientProductDetail> => {
    try {
      const url = API_ENDPOINTS.PRODUCTS.DETAIL.replace(":id", id);
      const response = await publicAxios.get(url);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching client product detail with id ${id}:`, error);
      throw error;
    }
  }
};