"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrder } from "../useOrders";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function OrderDetail({ onBack }: { onBack?: () => void }) {
  const { id } = useParams<{ id: string }>();
  const { orderDetail, loading, fetchOrderDetail, cancelOrder } = useOrder();

  useEffect(() => {
    if (id) fetchOrderDetail(id);
  }, [id, fetchOrderDetail]);

  if (loading)
    return (
      <div className="p-4 text-gray-600">Đang tải chi tiết đơn hàng...</div>
    );
  if (!orderDetail)
    return <div className="p-4 text-red-500">Không tìm thấy đơn hàng</div>;

  const statusConfig: Record<string, { color: string; label: string }> = {
    PENDING_PAYMENT: {
      color: "bg-yellow-100 text-yellow-700",
      label: "Chờ thanh toán",
    },
    PENDING_PICKUP: {
      color: "bg-blue-100 text-blue-700",
      label: "Chờ lấy hàng",
    },
    PENDING_DELIVERY: {
      color: "bg-purple-100 text-purple-700",
      label: "Đang giao hàng",
    },
    DELIVERED: { color: "bg-green-100 text-green-700", label: "Đã giao" },
    RETURNED: { color: "bg-gray-100 text-gray-700", label: "Đã trả hàng" },
    CANCELLED: { color: "bg-red-100 text-red-700", label: "Đã hủy" },
  };

  const status = statusConfig[orderDetail.status] || {
    color: "bg-slate-100 text-slate-700",
    label: orderDetail.status,
  };

  const totalAmount = orderDetail.items.reduce(
    (sum, item) => sum + item.skuPrice * item.quantity,
    0
  );

  const showCancelButton = !["DELIVERED", "CANCELLED", "RETURNED"].includes(
    orderDetail.status
  );

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      {/* Header: Back + Cancel */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 text-sm px-3 py-1.5"
        >
          <ArrowLeft size={18} /> Quay lại
        </Button>
        {showCancelButton && id && (
          <Button
            variant="outline"
            onClick={() => cancelOrder(id)}
            className="text-red-600 border-red-400 hover:bg-red-50 text-sm px-4 py-2"
            disabled={loading}
          >
            {loading ? "Đang hủy..." : "Hủy đơn hàng"}
          </Button>
        )}
      </div>

      {/* Title + Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl font-semibold">Đơn hàng #{orderDetail.id}</h1>
        <Badge
          className={`${status.color} px-3 py-1 rounded-full text-xs w-fit`}
        >
          {status.label}
        </Badge>
      </div>

      {/* Receiver Info */}
      <div className="rounded-xl border p-6 shadow-sm bg-white space-y-5 text-sm sm:text-base">
        <h2 className="text-base font-semibold flex items-center gap-2 mb-1">
          📦 Thông tin người nhận
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <div className="space-y-1">
            <p className="text-gray-500">👤 Tên người nhận</p>
            <p className="font-medium">{orderDetail.receiver.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">📞 Số điện thoại</p>
            <p className="font-medium">{orderDetail.receiver.phone}</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p className="text-gray-500">📍 Địa chỉ giao hàng</p>
            <p className="font-medium">{orderDetail.receiver.address}</p>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="rounded-xl border p-6 shadow-sm bg-white space-y-5 text-sm sm:text-base">
        <h2 className="text-base font-semibold flex items-center gap-2 mb-1">
          🧾 Thông tin đơn hàng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <div className="space-y-1">
            <p className="text-gray-500">🆔 Mã đơn hàng</p>
            <p className="font-medium">{orderDetail.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">📅 Ngày tạo</p>
            <p className="font-medium">
              {format(new Date(orderDetail.createdAt), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">💳 Mã thanh toán</p>
            <p className="font-medium">{orderDetail.paymentId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">💰 Tổng tiền</p>
            <p className="font-semibold text-green-600">
              {totalAmount.toLocaleString()}₫
            </p>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="rounded-xl border p-6 shadow-sm bg-white">
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          🛍️ Danh sách sản phẩm
        </h2>
        <div className="space-y-5">
          {orderDetail.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-3 border-b pb-5 last:border-none"
            >
              <Image
                src={item.image}
                alt={item.productName}
                width={90}
                height={90}
                className="rounded-md object-cover border"
              />
              <div className="flex-1 space-y-1 text-sm">
                <p className="font-semibold text-base">{item.productName}</p>
                <p className="text-gray-500">{item.skuValue}</p>
                <p className="text-gray-600">Số lượng: {item.quantity}</p>
              </div>
              <div className="font-semibold text-green-600 text-sm sm:text-base whitespace-nowrap">
                {(item.skuPrice * item.quantity).toLocaleString()}₫
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
