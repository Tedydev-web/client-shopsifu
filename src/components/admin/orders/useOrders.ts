"use client";

import { useCallback, useState } from "react";
import { orderService, manageOrderService } from "@/services/orderService";
import {
  OrderGetAllResponse,
  OrderGetByIdResponse,
  OrderStatus,
  OrderCreateRequest,
  OrderCreateResponse,
  OrderCancelResponse,
  Order,
  ManageOrderGetAllResponse,
  ManageOrderGetByIdResponse,
  ManageOrder,
  UpdateStatusRequest,
} from "@/types/order.interface";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  search?: string;
}

export function useOrder() {
  const [orders, setOrders] = useState<ManageOrder[]>([]);
  const [orderDetail, setOrderDetail] = useState<ManageOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    search: "",
  });

  // 🔹 Lấy tất cả đơn hàng (Manage Orders)
  const fetchAllOrders = useCallback(
    async (page = 1, limit = 10, search = "") => {
      setLoading(true);
      setError(null);
      try {
        const res = await manageOrderService.getAll({ page, limit, search });
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
    },
    []
  );

  // 🔹 Lọc theo trạng thái - sử dụng manageOrderService
  const fetchOrdersByStatus = useCallback(
    async (status: OrderStatus, page = 1, limit = 10) => {
      setLoading(true);
      setError(null);
      try {
        const res = await manageOrderService.getAll({ 
          page, 
          limit, 
          status 
        });
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
    const page = 1;
    const limit = pagination.limit ?? 10;
    fetchAllOrders(page, limit, searchValue);
  };

  // 🔹 Chuyển trang
  const handlePageChange = (page: number) => {
    const limit = pagination.limit ?? 10;
    const search = pagination.search ?? "";
    fetchAllOrders(page, limit, search);
  };

  // 🔹 Đổi limit
  const handleLimitChange = (limit: number) => {
    const page = 1;
    const search = pagination.search ?? "";
    fetchAllOrders(page, limit, search);
  };

  // 🔹 Lấy chi tiết đơn hàng (Manage Order)
  const fetchOrderDetail = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await manageOrderService.getById(orderId);
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

  // 🔹 Cập nhật trạng thái đơn hàng
  const updateOrderStatus = useCallback(async (orderId: string, data: UpdateStatusRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await manageOrderService.updateStatus(orderId, data);
      return res;
    } catch (err: any) {
      setError(err.message || "Lỗi khi cập nhật trạng thái đơn hàng");
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
    updateOrderStatus,
  };
}
