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
import { ReviewsModal } from "@/components/client/products/products-ReviewsModal";

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

  // state mở modal review
  const [reviewProduct, setReviewProduct] = useState<{
    productId: string;
    productName: string;
    productSlug: string;
    orderId: string;
  } | null>(null);

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
                    className="group border rounded-lg p-3 sm:p-4 bg-white hover:border-[#D70018]/30 hover:shadow-lg transition-all duration-300 cursor-pointer
                               text-xs sm:text-sm transition-all duration-200 hover:from-[#D70018]/5 hover:to-[#FF6B35]/5"
                    onClick={() => handleViewDetail(order.id)}
                  >
                    <div className="flex justify-between items-center gap-4">
                      {/* Left: Image + Info */}
                      <div className="flex gap-3 items-center flex-1 min-w-0">
                        <div className="relative group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                          <img
                            src={firstItem?.image || "/static/no-image.png"}
                            alt={firstItem?.productName || "Sản phẩm"}
                            className="w-12 h-12 sm:w-[60px] sm:h-[60px] object-cover rounded-lg shadow-sm border border-gray-100"
                          />
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 truncate mb-1 group-hover:text-[#D70018] transition-colors duration-200">
                            {firstItem?.productName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            Đơn hàng:{" "}
                            <span className="font-semibold">{order.id}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Ngày đặt:{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Right: Status + Price + Actions */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-gray-400 text-xs sm:text-sm">
                          {statusLabel[order.status]}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">
                            Tổng thanh toán
                          </p>
                          <p className="text-base font-bold text-[#D70018] bg-gradient-to-r from-[#D70018] to-[#FF6B35] bg-clip-text text-transparent">
                            {totalAmount.toLocaleString()}đ
                          </p>
                        </div>
                        <div className="inline-flex items-center text-sm text-[#D70018] font-semibold hover:text-[#B8001A] transition-colors duration-200 group/link">
                          Xem chi tiết
                          <svg
                            className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                        {order.status === "DELIVERED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-500 border-orange-500 hover:bg-orange-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              const productSlug = createProductSlug(
                                firstItem.productName,
                                firstItem.productId
                              );
                              setReviewProduct({
                                productId: firstItem.productId,
                                productName: firstItem.productName,
                                productSlug,
                                orderId: order.id,
                              });
                            }}
                          >
                            Đánh giá
                          </Button>
                        )}
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

      {/* Review Modal */}
      {reviewProduct && (
        <ReviewsModal
          open={!!reviewProduct}
          onOpenChange={(open) => !open && setReviewProduct(null)}
          product={reviewProduct}
        />
      )}
    </>
  );
};
