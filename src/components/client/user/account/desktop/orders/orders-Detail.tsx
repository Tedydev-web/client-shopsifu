"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { orderService } from "@/services/order.service";
import { ChevronLeft } from "lucide-react";

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
}

export const OrderDetail = ({ orderId, onBack }: OrderDetailProps) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    orderService
      .getById(orderId)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <Skeleton className="w-full h-[300px]" />;
  if (!order) return <div className="text-center text-red-500">Không tìm thấy đơn hàng</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chi tiết đơn hàng #{order.code}</h2>
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Quay lại
        </Button>
      </div>

      <div className="bg-white border rounded-md shadow-sm p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm">
          <div className="space-y-2">
            <p><strong>Ngày đặt:</strong> {order.createdAt}</p>
            <p><strong>Trạng thái:</strong> {order.status}</p>
            <p><strong>Số lượng:</strong> {order.totalQuantity}</p>
          </div>
          <div className="space-y-2">
            <p><strong>Họ tên:</strong> {order.customerName}</p>
            <p><strong>SĐT:</strong> {order.phone}</p>
            <p><strong>Địa chỉ:</strong> {order.address}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Sản phẩm</h3>
          <div className="space-y-4">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnailUrl || "/images/default-product.png"}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-md border"
                  />
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-sm">{item.price.toLocaleString()}đ</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm space-y-1 border-t pt-4">
            <p><strong>Tạm tính:</strong> {order.subtotal.toLocaleString()}đ</p>
            <p><strong>Giảm giá:</strong> -{order.discount.toLocaleString()}đ</p>
            <p><strong>Phí vận chuyển:</strong> {order.shippingFee.toLocaleString()}đ</p>
            <p className="text-base font-semibold text-primary">
              Tổng cộng: {order.totalAmount.toLocaleString()}đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
