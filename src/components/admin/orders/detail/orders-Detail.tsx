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
  const { orderDetail, loading, fetchOrderDetail } = useOrder();

  useEffect(() => {
    if (id) fetchOrderDetail(id);
  }, [id, fetchOrderDetail]);

  if (loading) return <div className="p-6">Đang tải chi tiết đơn hàng...</div>;
  if (!orderDetail) return <div className="p-6">Không tìm thấy đơn hàng</div>;

  const statusConfig: Record<string, { color: string; label: string }> = {
    PENDING_PAYMENT: { color: "bg-yellow-100 text-yellow-700", label: "Chờ thanh toán" },
    PENDING_PICKUP: { color: "bg-blue-100 text-blue-700", label: "Chờ lấy hàng" },
    PENDING_DELIVERY: { color: "bg-purple-100 text-purple-700", label: "Đang giao hàng" },
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

  return (
    <div className="p-6 space-y-6">
      {/* Back button */}
      <Button
        variant="outline"
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={18} /> Quay lại
      </Button>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{orderDetail.id}</h1>
        <Badge className={`${status.color} px-4 py-2`}>{status.label}</Badge>
      </div>

      {/* Receiver Info */}
      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="text-lg font-semibold">Thông tin người nhận</h2>
        <p><strong>Tên:</strong> {orderDetail.receiver.name}</p>
        <p><strong>SĐT:</strong> {orderDetail.receiver.phone}</p>
        <p><strong>Địa chỉ:</strong> {orderDetail.receiver.address}</p>
      </div>

      {/* Order Info */}
      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="text-lg font-semibold">Thông tin đơn hàng</h2>
        <p><strong>Mã đơn:</strong> {orderDetail.id}</p>
        <p><strong>Ngày tạo:</strong> {format(new Date(orderDetail.createdAt), "dd/MM/yyyy HH:mm")}</p>
        <p><strong>Phương thức thanh toán:</strong> {orderDetail.paymentId}</p>
        <p className="font-semibold text-green-600">
          <strong>Tổng tiền:</strong> {totalAmount.toLocaleString()}₫
        </p>
      </div>

      {/* Items */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
        <div className="space-y-4">
          {orderDetail.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4 last:border-none"
            >
              <Image
                src={item.image}
                alt={item.productName}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">{item.skuValue}</p>
                <p className="text-sm">Số lượng: {item.quantity}</p>
              </div>
              <div className="font-semibold text-green-600">
                {(item.skuPrice * item.quantity).toLocaleString()}₫
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
