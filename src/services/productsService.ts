import { privateAxios } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { PaginationRequest } from "@/types/base.interface";
import {
  Product,
  ProductsResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
} from "@/types/products.interface";

export const productsService = {
  // Lấy danh sách sản phẩm
  getAll: async (params?: PaginationRequest): Promise<ProductsResponse> => {
    try {
      const response = await privateAxios.get(API_ENDPOINTS.MANAGE_PRODUCTS.LIST, {
        params: params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Lấy chi tiết sản phẩm theo ID
  getById: async (id: string): Promise<Product> => {
    try {
      const url = API_ENDPOINTS.MANAGE_PRODUCTS.DETAIL.replace(":id", id);
      const response = await privateAxios.get(url);
      return response.data.data; // Assuming the response is { data: Product }
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },

  // Tạo sản phẩm mới
  create: async (data: ProductCreateRequest): Promise<Product> => {
    try {
      const response = await privateAxios.post(API_ENDPOINTS.MANAGE_PRODUCTS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Cập nhật sản phẩm theo ID
  update: async (
    id: string,
    data: ProductUpdateRequest
  ): Promise<Product> => {
    try {
      const url = API_ENDPOINTS.MANAGE_PRODUCTS.UPDATE.replace(":id", id);
      const response = await privateAxios.put(url, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  },

  // Xoá sản phẩm theo ID
  delete: async (id: string): Promise<void> => {
    try {
      const url = API_ENDPOINTS.MANAGE_PRODUCTS.DELETE.replace(":id", id);
      await privateAxios.delete(url);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  },
};