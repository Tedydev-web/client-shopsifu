import { privateAxios } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import {
  OrderGetAllParams,
  OrderGetAllResponse,
  OrderGetByIdResponse,
  OrderCreateRequest,
  OrderCreateResponse,
  OrderCancelResponse,
} from "@/types/order.interface";

export const orderService = {
  // Lấy tất cả đơn hàng (có hỗ trợ filter, sort, search, pagination)
  getAll: async (
    params?: OrderGetAllParams,
    signal?: AbortSignal
  ): Promise<OrderGetAllResponse> => {
    try {
      const response = await privateAxios.get(API_ENDPOINTS.ORDERS.GETALL, {
        params,
        signal,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  getById: async (
    orderId: string,
    signal?: AbortSignal
  ): Promise<OrderGetByIdResponse> => {
    try {
      const url = API_ENDPOINTS.ORDERS.GET_BY_ID.replace(":orderId", orderId);
      const response = await privateAxios.get(url, { signal });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo đơn hàng mới
  create: async (
    data: OrderCreateRequest,
    signal?: AbortSignal
  ): Promise<OrderCreateResponse> => {
    try {
      const response = await privateAxios.post(
        API_ENDPOINTS.ORDERS.CREATE,
        data,
        { signal }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Huỷ đơn hàng theo ID
  cancel: async (
    orderId: string,
    signal?: AbortSignal
  ): Promise<OrderCancelResponse> => {
    try {
      const url = API_ENDPOINTS.ORDERS.CANCEL.replace(":orderId", orderId);
      const response = await privateAxios.delete(url, { signal });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
