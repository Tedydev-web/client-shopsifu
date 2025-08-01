"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { OrderEmpty } from "./orders-Empty";
import { useOrder } from "./useOrder";
import { OrderStatus } from "@/types/order.interface";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react"

const statusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PENDING_PICKUP: "Chờ lấy hàng",
  PENDING_DELIVERY: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  RETURNED: "Đã trả hàng",
  CANCELLED: "Đã huỷ",
};

interface Props {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const OrderTabContent = ({ currentTab, onTabChange }: Props) => {
  const router = useRouter();
  const { orders, loading, error, fetchAllOrders, fetchOrdersByStatus } =
    useOrder();
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (!currentTab) onTabChange("all");
  }, [currentTab, onTabChange]);

  useEffect(() => {
    if (currentTab === "all") {
      fetchAllOrders();
    } else {
      fetchOrdersByStatus(currentTab as OrderStatus);
    }
    setVisibleCount(6);
  }, [currentTab, fetchAllOrders, fetchOrdersByStatus]);

  const handleViewDetail = (orderId: string) => {
    router.push(`/user/orders/${orderId}`);
  };

  const tabs = ["all", ...Object.values(OrderStatus)];
  const displayedOrders = orders.slice(0, visibleCount);

  return (
    <>
      {tabs.map((value) => (
        <TabsContent
          key={value}
          value={value}
          className="bg-white rounded-xl min-h-[70vh] px-4 pb-2 data-[state=active]:shadow-lg transition-all"
        >
          {value !== currentTab ? null : loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Đang tải đơn hàng...
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-destructive">
              {error}
            </div>
          ) : orders.length ? (
            <div className="space-y-3">
              {displayedOrders.map((order) => {
                const firstItem = order.items[0];
                const totalAmount = order.items.reduce(
                  (sum, item) => sum + item.skuPrice * item.quantity,
                  0
                );

                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border rounded-lg p-4 bg-white hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetail(order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={firstItem?.image}
                        alt={firstItem?.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <div className="text-sm text-gray-500">
                          Đơn hàng:{" "}
                          <span className="font-semibold">{order.id}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Ngày đặt hàng:{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div className="font-medium text-gray-800 mt-1 text-sm">
                          {firstItem?.productName}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between min-w-[160px]">
                      <div className="text-xs text-gray-400 mb-1">
                        {statusLabel[order.status]}
                      </div>
                      <div className="text-xs font-medium text-gray-700">
                        Tổng thanh toán:{" "}
                        <span className="text-[#D70018]] text-sm font-semibold">
                          {totalAmount.toLocaleString()}đ
                        </span>
                      </div>
                      <div className="text-blue-500 text-xs mt-1">
                        Xem chi tiết →
                      </div>
                    </div>
                  </div>
                );
              })}

              {visibleCount < orders.length && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                    className=" text-base text-[#3B82F6]"
                  >
                    Xem thêm
                    <ChevronDown/>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <OrderEmpty />
          )}
        </TabsContent>
      ))}
    </>
  );
};
