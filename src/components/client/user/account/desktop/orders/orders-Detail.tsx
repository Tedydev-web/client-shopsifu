"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, ChevronLeft } from "lucide-react";
import { useOrder } from "./useOrder";
import { Order, OrderItem } from "@/types/order.interface";
import Link from "next/link";
import { createProductSlug } from "@/components/client/products/shared/productSlug"; // Đường dẫn đến hàm tạo slug

interface OrderDetailProps {
  orderId: string;
  status?: string; // Thêm prop status nếu cần
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const { fetchOrderDetail, cancelOrder, loading } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;
      try {
        const res = await fetchOrderDetail(orderId);
        setOrder(res?.data ?? null);
      } catch (err) {}
    };

    loadOrder();
  }, [orderId, fetchOrderDetail]);

  const handleCancel = async () => {
    if (!orderId) return;
    await cancelOrder(orderId);
    const res = await fetchOrderDetail(orderId);
    setOrder(res?.data ?? null);
  };

  if (loading || !order) {
    return <div>Đang tải...</div>;
  }

  const statusMap: Record<
    string,
    { label: string; variant?: "default" | "destructive" }
  > = {
    PENDING_PAYMENT: { label: "Chờ thanh toán" },
    PENDING_PICKUP: { label: "Chờ lấy hàng" },
    PENDING_DELIVERY: { label: "Đang giao hàng" },
    DELIVERED: { label: "Đã giao hàng" },
    RETURNED: { label: "Đã trả hàng" },
    CANCELLED: { label: "Đã hủy", variant: "destructive" },
  };

  const currentStatus = statusMap[order.status] || { label: order.status };

  const selectedItem: OrderItem | undefined =
    order.items?.find((item) => item.productId === productId) ||
    order.items?.[0];

  const totalQuantity =
    selectedItem?.quantity ??
    order.items?.reduce((sum, item) => sum + item.quantity, 0) ??
    0;

  const discount = order.totalVoucherDiscount;
  const shippingFee: number = order.totalShippingFee;

  const totalAmount = order.totalItemCost;

  const finalAmount = order.totalPayment;

  return (
    <div className="mx-auto bg-[#f5f5f5] space-y-4 text-sm rounded-md">
      <Link
        href="/user/orders"
        className="flex items-center gap-1 text-muted-foreground text-sm bg-white rounded-lg p-4 border cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-[#121214] text-sm">
          Lịch sử mua hàng
          <span className="font-medium text-[#CFCFD3]">
            {" "}
            / Chi tiết đơn hàng
          </span>
        </span>
      </Link>

      {/* Tổng quan */}
      <section className="bg-white rounded-lg border p-4 space-y-3">
        <h2 className="text-lg font-semibold">Tổng quan</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">Mã thanh toán: #{order.paymentId}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </span>
          <span className="text-muted-foreground">•</span>
          <Badge
            variant={currentStatus.variant || "default"}
            className="text-xs"
          >
            {currentStatus.label}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={selectedItem?.image}
              alt={selectedItem?.productName}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <p className="font-medium">{selectedItem?.productName}</p>
              <div className="flex items-center gap-2">
                <span className="text-[#d70018] font-semibold">
                  {(selectedItem?.skuPrice ?? 0).toLocaleString()}đ
                </span>
              </div>
              <span className="text-xs bg-gray-100 rounded px-2 py-0.5">
                {selectedItem?.skuValue}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm">Số lượng: {totalQuantity}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#d70018] text-[#d70018] hover:bg-[#d70018] hover:text-white"
                onClick={() => {
                  if (selectedItem) {
                    const slug = createProductSlug(
                      selectedItem.productName,
                      selectedItem.productId
                    );
                    router.push(`/products/${slug}`);
                  }
                }}
              >
                Mua lại
              </Button>

              {order.status === "PENDING_PAYMENT" && (
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={handleCancel}
                >
                  Hủy đơn hàng
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
        {/* Cột trái */}
        <div className="md:col-span-5 flex flex-col space-y-4">
          {/* Thông tin khách hàng */}
          <section className="bg-white rounded-lg border p-4 space-y-3">
            <h2 className="text-lg font-semibold">Thông tin khách hàng</h2>
            <div className="px-2 space-y-2 text-base">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Họ và tên:</span>
                <span className="font-medium">{order.receiver?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Số điện thoại:</span>
                <span className="font-medium">{order.receiver?.phone}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Địa chỉ:</span>
                <span className="font-semibold text-right max-w-[70%]">
                  {order.receiver?.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ghi chú:</span>
                <span className="text-muted-foreground">-</span>
              </div>
            </div>
          </section>

          {/* Thông tin hỗ trợ */}
          <section className="bg-white rounded-lg border p-4 py-6 space-y-3">
            <h2 className="text-lg font-semibold">Thông tin hỗ trợ</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Số điện thoại:</span>
                <span className="font-semibold">18002097</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[#d70018] text-[#d70018] hover:bg-[#d70018] hover:text-white"
              >
                <Phone className="w-4 h-4 mr-1" /> Liên hệ
              </Button>
            </div>
          </section>

          {/* Trung tâm bảo hành */}
          <section className="bg-white rounded-lg border p-4 space-y-3 flex-1">
            <h2 className="text-lg font-semibold">Trung tâm bảo hành</h2>
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
          </section>
        </div>

        {/* Thông tin thanh toán */}
        <section className="bg-white rounded-lg border p-6 space-y-4 md:col-span-5 flex flex-col shadow-sm h-full">
          <h2 className="text-xl font-semibold">Thông tin thanh toán</h2>

          {/* Sản phẩm */}
          <div className="p-2 space-y-3">
            <h3 className="text-base font-medium bg-neutral-100 rounded-xs px-2 py-1">
              Sản phẩm
            </h3>
            <div className="flex px-2 justify-between border-b pb-2">
              <span>Số lượng sản phẩm:</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex px-2 justify-between border-b pb-2">
              <span>Tổng tiền hàng:</span>
              <span>{totalAmount.toLocaleString()}đ</span>
            </div>
            <div className="flex px-2 justify-between border-b pb-2 text-green-600">
              <span>Giảm giá:</span>
              <span>{discount.toLocaleString()}đ</span>
            </div>
            <div className="flex px-2 justify-between text-green-600">
              <span>Phí vận chuyển:</span>
              <span>
                {shippingFee === 0
                  ? "Miễn phí"
                  : `${shippingFee.toLocaleString()}đ`}
              </span>
            </div>
          </div>

          {/* Thanh toán */}
          <div className="p-2 space-y-3 mt-3">
            <h3 className="text-base font-medium bg-neutral-100 rounded-xs px-2 py-1">
              Thanh toán
            </h3>
            <div className="flex px-2 justify-between border-b pb-2 font-semibold text-[#d70018] text-lg">
              <span>Tổng số tiền</span>
              <span>{finalAmount.toLocaleString()}đ</span>
            </div>
            <p className="text-xs px-2 text-muted-foreground border-b pb-2">
              (Đã bao gồm VAT và được làm tròn)
            </p>
            <div className="flex px-2 justify-between text-red-600">
              <span>Tổng số tiền đã thanh toán</span>
              <span>{order.status === "PENDING_PICKUP" || order.status === "PENDING_DELIVERY" || order.status === "DELIVERED" ? order.totalPayment.toLocaleString() : "0"}đ</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
