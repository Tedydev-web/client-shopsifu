"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { orderService } from "@/services/orderService";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Order, OrderItem } from "@/types/order.interface";

export default function DashboardOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    orderService
      .getAll({ page: 1, limit: 8 }, controller.signal)
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const statusMap: Record<string, { label: string; className: string }> = {
    PENDING_PAYMENT: {
      label: "Chờ thanh toán",
      className: "bg-yellow-100 text-yellow-600",
    },
    PENDING_PICKUP: {
      label: "Chờ lấy hàng",
      className: "bg-blue-100 text-blue-600",
    },
    PENDING_DELIVERY: {
      label: "Đang giao hàng",
      className: "bg-purple-100 text-purple-600",
    },
    DELIVERED: {
      label: "Đã giao hàng",
      className: "bg-green-100 text-green-600",
    },
    RETURNED: {
      label: "Đã trả hàng",
      className: "bg-gray-100 text-gray-600",
    },
    CANCELLED: {
      label: "Đã hủy",
      className: "bg-red-100 text-red-600",
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm text-center">
        Đang tải...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm text-center h-full max-h-full">
        <Image
          src="/images/client/profile/logo mini.png"
          alt="Đơn hàng"
          width={120}
          height={120}
          className="mx-auto"
        />
        <p className="text-gray-600 mt-2 text-sm">
          Bạn chưa có đơn hàng nào gần đây? Hãy bắt đầu mua sắm ngay nào!
        </p>
        <Link
          href="/"
          className="text-[#D70018] text-sm font-medium mt-1 inline-block hover:underline"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  const handleViewDetail = (orderId: string, productId: string) => {
    router.push(`/user/orders/${orderId}?productId=${productId}`);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">Đơn hàng gần đây</h2>
        <Link
          href="/user/orders"
          className="text-[#D70018] text-sm font-medium hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="space-y-3">
        {orders.map((order) =>
          order.items.map((item: OrderItem) => {
            const totalAmount = item.skuPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 h-[120px] flex flex-col justify-between"
                onClick={() => handleViewDetail(order.id, item.productId)}
              >
                {/* Header: thông tin đơn hàng */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <p className="text-base text-neutral-500">
                      Đơn hàng:{" "}
                      <span className="text-sm text-neutral-800 font-semibold">
                        #{order.paymentId}
                      </span>
                    </p>
                    <p className="text-base text-neutral-500">
                      Ngày đặt:{" "}
                      <span className="text-sm text-neutral-800 font-semibold">
                        {format(new Date(order.createdAt), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      statusMap[order.status]?.className ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusMap[order.status]?.label || order.status}
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex justify-between items-end mt-2">
                  <div className="flex gap-3">
                    <Image
                      src={item.image || "/static/no-image.png"}
                      alt={item.productName || "Sản phẩm"}
                      width={70}
                      height={70}
                      className="rounded-md object-cover w-[70px] h-[70px]"
                    />
                    <div className="text-left max-w-[400px]">
                      <p className="text-sm text-gray-800 font-semibold truncate">
                        {item.productName}
                      </p>
                      {item.skuValue && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          Phân loại: {item.skuValue}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-neutral-500">
                      Tổng thanh toán:{" "}
                      <span className="text-sm font-semibold text-red-600">
                        {totalAmount.toLocaleString()}đ
                      </span>
                    </p>
                    <div className="text-sm text-blue-500 hover:underline mt-1">
                      Xem chi tiết →
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
