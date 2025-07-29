"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone } from "lucide-react";
import { orderService } from "@/services/orderService";
import { Order, OrderItem } from "@/types/order.interface";

interface OrderDetailProps {
  orderId: string;
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (orderId) {
      orderService.getById(orderId).then((res: Order) => setOrder(res));
    }
  }, [orderId]);

  if (!order) return <div>Đang tải...</div>;

  const firstItem = order.items?.[0];
  const totalQuantity = order.items?.reduce(
    (sum: number, item: OrderItem) => sum + item.quantity,
    0
  );
  const totalAmount = order.items?.reduce(
    (sum: number, item: OrderItem) => sum + item.skuPrice * item.quantity,
    0
  );

  return (
    <div className="space-y-4">
      {/* Nút quay lại */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        ← Quay lại
      </Button>

      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Lịch sử mua hàng /{" "}
        <span className="text-foreground">Chi tiết đơn hàng</span>
      </div>

      {/* Tổng quan */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-x-3">
            <span className="text-sm font-medium">Đơn hàng: #{order.id}</span>
            <span className="text-sm text-muted-foreground">
              Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <Badge variant="destructive">{order.status}</Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <img
              src={firstItem?.image}
              alt={firstItem?.productName}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <p className="font-medium">{firstItem?.productName}</p>
              <p className="text-muted-foreground text-sm">
                {firstItem?.skuValue}
              </p>
              <p className="text-lg font-semibold">
                {(firstItem?.skuPrice ?? 0).toLocaleString()}đ
              </p>
              <p className="text-sm">Số lượng: {firstItem?.quantity}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Mua lại
          </Button>
        </CardContent>
      </Card>

      {/* Grid 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Thông tin khách hàng */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khách hàng</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Họ và tên: </span>
              {order.receiver?.name}
            </p>
            <p>
              <span className="font-medium">Số điện thoại: </span>
              {order.receiver?.phone}
            </p>
            <p>
              <span className="font-medium">Địa chỉ: </span>
              {order.receiver?.address}
            </p>
          </CardContent>
        </Card>

        {/* Thông tin thanh toán */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin thanh toán</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Tổng số sản phẩm: </span>
              {totalQuantity}
            </p>
            <p className="font-semibold text-lg">
              Tổng số tiền: {totalAmount?.toLocaleString()}đ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Thông tin hỗ trợ */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin hỗ trợ</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            <span>0123 456 789</span>
          </div>
          <Button variant="outline" size="sm">
            Liên hệ
          </Button>
        </CardContent>
      </Card>

      {/* Trung tâm bảo hành */}
      <Card>
        <CardHeader>
          <CardTitle>Trung tâm bảo hành</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Danh sách trung tâm bảo hành</span>
            <Button variant="link" className="text-primary px-0">
              Truy cập
            </Button>
          </div>
          <div className="flex justify-between">
            <span>Bảo hành tại CellphoneS</span>
            <Button variant="link" className="text-primary px-0">
              Truy cập
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
