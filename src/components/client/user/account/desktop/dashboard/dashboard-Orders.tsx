"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { orderService } from "@/services/orderService";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
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

  const handleViewDetail = (orderId: string) => {
    router.push(`/user/orders/${orderId}`);
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

      <div className="space-y-2">
        {orders.map((order) => {
          const firstItem = order.items[0];
          const totalAmount = order.items.reduce(
            (sum, item) => sum + item.skuPrice * item.quantity,
            0
          );

          return (
            <div
              key={order.id}
              className="flex items-start justify-between border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => handleViewDetail(order.id)}
            >
              <div className="flex gap-3">
                <Image
                  src={firstItem?.image || "/static/no-image.png"}
                  alt={firstItem?.productName || "Sản phẩm"}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    Ngày đặt hàng:{" "}
                    {format(new Date(order.createdAt), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </p>
                  <p className="text-sm mt-1 text-gray-800 font-semibold">
                    {firstItem?.productName}
                  </p>
                  <div className="text-sm font-medium text-red-600">
                    {totalAmount.toLocaleString()}đ
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    statusMap[order.status]?.className ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statusMap[order.status]?.label || order.status}
                </span>
                <div className="block mt-2 text-sm text-blue-500 hover:underline">
                  Xem chi tiết →
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
