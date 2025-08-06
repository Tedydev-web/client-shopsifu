"use client";

import { useCallback, useState } from "react";
import { orderService } from "@/services/orderService";
import {
  OrderGetAllResponse,
  OrderGetByIdResponse,
  OrderStatus,
  OrderCreateRequest,
  OrderCreateResponse,
  OrderCancelResponse,
  Order,
} from "@/types/order.interface";

// Định nghĩa type Pagination nếu chưa có
interface Pagination {
  page: number;
  limit: number;
  total: number;
  search?: string;
}

export function useOrder() {
  const [orders, setOrders] = useState<OrderGetAllResponse["data"]>([]);
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    search: "",
  });

  // 🔹 Lấy tất cả đơn hàng
  const fetchAllOrders = useCallback(async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getAll({ page, limit, search });
      setOrders(res.data);
      setPagination((prev) => ({
        ...prev,
        page,
        limit,
        total: res.metadata?.totalItems || 0,
        search,
      }));
      return res;
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải danh sách đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Lọc theo trạng thái
  const fetchOrdersByStatus = useCallback(
    async (status: OrderStatus, page = 1, limit = 10) => {
      setLoading(true);
      setError(null);
      try {
        const res = await orderService.getByStatus(status, { page, limit });
        setOrders(res.data);
        setPagination((prev) => ({
          ...prev,
          page,
          limit,
          total: res.metadata?.totalItems || 0,
        }));
        return res;
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải đơn hàng theo trạng thái");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 🔹 Tìm kiếm
  const handleSearch = (searchValue: string) => {
    setPagination((prev) => ({ ...prev, page: 1, search: searchValue }));
    fetchAllOrders(1, pagination.limit, searchValue);
  };

  // 🔹 Chuyển trang
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchAllOrders(page, pagination.limit, pagination.search);
  };

  // 🔹 Đổi limit
  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
    fetchAllOrders(1, limit, pagination.search);
  };

  // 🔹 Lấy chi tiết đơn hàng
  const fetchOrderDetail = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getById(orderId);
      setOrderDetail(res.data ?? null);
      return res;
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải chi tiết đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Tạo đơn hàng
  const createOrder = useCallback(async (data: OrderCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res: OrderCreateResponse = await orderService.create(data);
      return res;
    } catch (err: any) {
      setError(err.message || "Lỗi khi tạo đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Huỷ đơn hàng
  const cancelOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: OrderCancelResponse = await orderService.cancel(orderId);
      return res;
    } catch (err: any) {
      setError(err.message || "Lỗi khi huỷ đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    orderDetail,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    fetchAllOrders,
    fetchOrdersByStatus,
    fetchOrderDetail,
    createOrder,
    cancelOrder,
  };
}
