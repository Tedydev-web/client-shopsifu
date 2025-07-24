"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useEffect } from "react";
import { OrderEmpty } from "./orders-Empty";
import { useGetOrders } from "@/hooks/useGetOrder";
import { OrderStatus } from "@/types/order.interface"; // Đã có enum hợp lệ

const tabKeys = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang vận chuyển" },
  { value: "delivered", label: "Đã giao hàng" },
  { value: "cancelled", label: "Đã huỷ" },
];

// ✅ Map từ tab string sang enum
const statusMap: Record<string, OrderStatus | undefined> = {
  pending: OrderStatus.PENDING_PAYMENT,
  confirmed: OrderStatus.PENDING_PICKUP,
  shipping: OrderStatus.PENDING_DELIVERY,
  delivered: OrderStatus.DELIVERED,
  cancelled: OrderStatus.CANCELLED,
};

interface Props {
  currentTab: string;
}

export const OrderTabContent = ({ currentTab }: Props) => {
  const { fetchOrders, orders, loading, error } = useGetOrders();

  useEffect(() => {
    const controller = new AbortController();

    const params =
      currentTab === "all"
        ? { page: 1, limit: 10 }
        : { page: 1, limit: 10, sortOrder: statusMap[currentTab] };

    fetchOrders(params, controller.signal);

    return () => controller.abort();
  }, [currentTab]);

  return (
    <>
      {tabKeys.map(({ value }) => (
        <TabsContent
          key={value}
          value={value}
          className="bg-white rounded-xl h-[85vh] px-4 py-6 data-[state=active]:shadow-lg transition-all"
        >
          {value !== currentTab ? null : loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Đang tải đơn hàng...
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-destructive">
              {error}
            </div>
          ) : orders?.data?.length ? (
            <div className="grid gap-4">
              {orders.data.map((order) => (
                <div
                  key={order.id}
                  className="p-4 border rounded-md shadow-sm bg-gray-50"
                >
                  <div>
                    <strong>Mã đơn:</strong> {order.code}
                  </div>
                  <div>
                    <strong>Trạng thái:</strong> {order.status}
                  </div>
                  <div>
                    <strong>Tổng:</strong> {order.totalAmount.toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <OrderEmpty />
          )}
        </TabsContent>
      ))}
    </>
  );
};
