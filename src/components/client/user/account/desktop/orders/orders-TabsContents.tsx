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
import {
  ShoppingCart,
  Truck,
  TicketPercent,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusInfo {
  label: string;
  className: string;
}

const statusLabel: Record<OrderStatus, StatusInfo> = {
  PENDING_PAYMENT: {
    label: "Chờ thanh toán",
    className:
      "bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-700 border border-amber-200",
  },
  PENDING_PACKAGING: {
    label: "Đang đóng gói",
    className:
      "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200",
  },
  PICKUPED: {
    label: "Chờ lấy hàng",
    className:
      "bg-gradient-to-r from-sky-50 to-blue-100 text-sky-700 border border-sky-200",
  },
  PENDING_DELIVERY: {
    label: "Đang giao hàng",
    className:
      "bg-gradient-to-r from-violet-50 to-purple-100 text-violet-700 border border-violet-200",
  },
  DELIVERED: {
    label: "Đã giao hàng",
    className:
      "bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-700 border border-emerald-200",
  },
  RETURNED: {
    label: "Đã trả hàng",
    className:
      "bg-gradient-to-r from-slate-50 to-gray-100 text-slate-700 border border-slate-200",
  },
  CANCELLED: {
    label: "Đã hủy",
    className:
      "bg-gradient-to-r from-red-50 to-rose-100 text-red-700 border border-red-200",
  },
  VERIFY_PAYMENT: {
    label: "Đã xác nhận thanh toán",
    className:
      "bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-700 border border-emerald-200",
  },
};

interface Props {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const OrderTabContent = ({ currentTab, onTabChange }: Props) => {
  const router = useRouter();
  const {
    orders,
    loading,
    error,
    metadata,
    fetchAllOrders,
    fetchOrdersByStatus,
  } = useOrder();
  const [visibleCount, setVisibleCount] = useState(6);
  const [fetchedAll, setFetchedAll] = useState(false);

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

  // OrderTabContent.tsx
  const handleViewDetail = (orderId: string) => {
    router.push(
      `/user/orders/${orderId}?code=${
        orders.find((o) => o.id === orderId)?.orderCode
      }`
    );
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
                const totalAmount = order.totalPayment;

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
                          <span
                            className={`text-xs font-semibold px-3 py-2 rounded-full ${
                              statusLabel[order.status]?.className ||
                              "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {statusLabel[order.status]?.label || order.status}
                          </span>
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

              {metadata?.totalItems && visibleCount < metadata.totalItems && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      // 🔹 Nếu chưa load hết thì gọi API với limit = totalItems
                      if (orders.length < (metadata?.totalItems ?? 0)) {
                        if (currentTab === "all") {
                          await fetchAllOrders(1, metadata.totalItems);
                        } else {
                          await fetchOrdersByStatus(
                            currentTab as OrderStatus,
                            1,
                            metadata.totalItems
                          );
                        }
                      }
                      // 🔹 Sau đó hiển thị thêm
                      setVisibleCount((prev) => prev + 10);
                    }}
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
