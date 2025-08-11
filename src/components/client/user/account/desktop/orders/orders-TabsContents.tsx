"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { OrderEmpty } from "./orders-Empty";
import { useOrder } from "./useOrder";
import { OrderStatus } from "@/types/order.interface";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { createProductSlug } from "@/components/client/products/shared/productSlug";

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
          className="
            bg-white rounded-none shadow-none
            min-h-[70vh] px-2 pb-2
            md:rounded-xl md:shadow-sm md:min-h-[85vh]
            transition-all
          "
        >
          {value !== currentTab ? null : loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm sm:text-base">
              Đang tải đơn hàng...
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-destructive text-sm sm:text-base">
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
                    className="flex flex-col sm:flex-row items-start sm:items-center 
                               justify-between border rounded-lg 
                               p-3 sm:p-4 bg-white hover:bg-gray-50 cursor-pointer
                               text-xs sm:text-sm"
                    onClick={() => handleViewDetail(order.id)}
                  >
                    {/* Left: Image + Info */}
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <img
                        src={firstItem?.image}
                        alt={firstItem?.productName}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          Đơn hàng:{" "}
                          <span className="font-semibold">{order.id}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          Ngày đặt:{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div className="font-medium text-gray-800 mt-1 text-sm truncate">
                          {firstItem?.productName}
                        </div>
                      </div>
                    </div>

                    {/* Right: Status + Price + Actions */}
                    <div
                      className="flex flex-row sm:flex-col items-center sm:items-end 
             justify-between sm:justify-start 
             gap-2 mt-3 sm:mt-0 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <div className="text-gray-400">
                        {statusLabel[order.status]}
                      </div>
                      <div className="font-medium text-gray-700">
                        Tổng:{" "}
                        <span className="text-[#D70018] font-semibold">
                          {totalAmount.toLocaleString()}đ
                        </span>
                      </div>
                      {order.status === "DELIVERED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-orange-500 border-orange-500 hover:bg-orange-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Tạo slug từ tên và id sản phẩm
                            const productSlug = createProductSlug(
                              firstItem.productName,
                              firstItem.productId
                            );
                            router.push(
                              `/products/${productSlug}?showReview=true`
                            );
                          }}
                        >
                          Đánh giá
                        </Button>
                      )}
                      <div className="text-blue-500">Xem chi tiết →</div>

                      {/* Nút Đánh giá sản phẩm */}
                      {order.status === OrderStatus.DELIVERED && firstItem && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white mt-1"
                          onClick={(e) => {
                            e.stopPropagation(); // tránh trigger xem chi tiết
                            const slug = createProductSlug(
                              firstItem.productName,
                              firstItem.productId
                            );
                            router.push(`/products/${slug}?writeReview=true`);
                          }}
                        >
                          Đánh giá sản phẩm
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}

              {visibleCount < orders.length && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                    className="text-xs sm:text-sm md:text-base text-[#3B82F6]"
                  >
                    Xem thêm
                    <ChevronDown className="ml-1 w-4 h-4" />
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
