"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrder } from "../useOrders";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { 
  ArrowLeft, 
  Package, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard,
  DollarSign,
  ShoppingBag,
  Loader2
} from "lucide-react";

export default function OrderDetail({ onBack }: { onBack?: () => void }) {
  const { id } = useParams<{ id: string }>();
  const { orderDetail, loading, fetchOrderDetail, cancelOrder } = useOrder();

  useEffect(() => {
    if (id) fetchOrderDetail(id);
  }, [id, fetchOrderDetail]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-600 text-base">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  
  if (!orderDetail)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 text-lg font-medium">Không tìm thấy đơn hàng</p>
          <p className="text-slate-500 mt-1">Vui lòng kiểm tra lại mã đơn hàng</p>
        </div>
      </div>
    );

  const statusConfig: Record<string, { color: string; label: string; bgColor: string }> = {
    PENDING_PAYMENT: {
      color: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-200",
      label: "Chờ thanh toán",
    },
    PENDING_PICKUP: {
      color: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-200",
      label: "Chờ lấy hàng",
    },
    PENDING_DELIVERY: {
      color: "text-purple-700",
      bgColor: "bg-purple-50 border-purple-200",
      label: "Đang giao hàng",
    },
    DELIVERED: { 
      color: "text-emerald-700", 
      bgColor: "bg-emerald-50 border-emerald-200",
      label: "Đã giao" 
    },
    RETURNED: { 
      color: "text-slate-700", 
      bgColor: "bg-slate-50 border-slate-200",
      label: "Đã trả hàng" 
    },
    CANCELLED: { 
      color: "text-red-700", 
      bgColor: "bg-red-50 border-red-200",
      label: "Đã hủy" 
    },
  };

  const status = statusConfig[orderDetail.status] || {
    color: "text-slate-700",
    bgColor: "bg-slate-50 border-slate-200",
    label: orderDetail.status,
  };

  const totalAmount = orderDetail.items.reduce(
    (sum, item) => sum + item.skuPrice * item.quantity,
    0
  );

  const showCancelButton = orderDetail.status === "PENDING_PAYMENT";

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 xl:p-10 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 border-slate-300 hover:bg-slate-50 h-11 px-5 font-normal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Đơn hàng #{orderDetail.id}
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-normal">
                Tạo lúc {format(new Date(orderDetail.createdAt), "dd/MM/yyyy 'lúc' HH:mm")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge
              className={`${status.bgColor} ${status.color} border px-4 py-2 rounded-full font-medium text-sm`}
            >
              {status.label}
            </Badge>
            {showCancelButton && id && (
              <Button
                variant="outline"
                onClick={() => cancelOrder(id)}
                className="text-red-600 border-red-300 hover:bg-red-50 h-11 px-5 font-normal"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang hủy...
                  </>
                ) : (
                  "Hủy đơn hàng"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Receiver Information */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-medium text-slate-700">Thông tin người nhận</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-normal text-slate-500">Họ và tên</p>
                      <p className="text-base font-medium text-slate-800">{orderDetail.receiver.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-normal text-slate-500">Số điện thoại</p>
                      <p className="text-base font-medium text-slate-800">{orderDetail.receiver.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-normal text-slate-500">Địa chỉ giao hàng</p>
                      <p className="text-base font-medium text-slate-800 leading-relaxed">
                        {orderDetail.receiver.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-medium text-slate-700">
                  Sản phẩm ({orderDetail.items.length} mặt hàng)
                </h2>
              </div>
              
              <div className="space-y-5">
                {orderDetail.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row gap-5 p-5 rounded-xl border border-slate-200 bg-slate-50/30 ${
                      index !== orderDetail.items.length - 1 ? 'mb-4' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        width={85}
                        height={85}
                        className="rounded-xl object-cover border-2 border-white shadow-sm"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="font-medium text-slate-800 text-base leading-snug">
                        {item.productName}
                      </h3>
                      <p className="text-slate-600 font-normal text-sm">{item.skuValue}</p>
                      <div className="flex items-center justify-between pt-1">
                        <p className="text-slate-500 text-sm font-normal">
                          Số lượng: <span className="font-medium text-slate-700">{item.quantity}</span>
                        </p>
                        <div className="text-right">
                          <p className="text-sm text-slate-500 font-normal">
                            {item.skuPrice.toLocaleString()}₫ × {item.quantity}
                          </p>
                          <p className="font-semibold text-base text-emerald-600">
                            {(item.skuPrice * item.quantity).toLocaleString()}₫
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-medium text-slate-700">Tóm tắt đơn hàng</h2>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 font-normal">Ngày đặt</span>
                  </div>
                  <span className="font-medium text-slate-800">
                    {format(new Date(orderDetail.createdAt), "dd/MM/yyyy")}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 font-normal">Mã thanh toán</span>
                  </div>
                  <span className="font-medium text-slate-800 text-sm">
                    {orderDetail.paymentId}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-5 bg-emerald-50 rounded-xl px-5 mt-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-800 font-semibold text-base">Tổng cộng</span>
                  </div>
                  <span className="font-semibold text-xl text-emerald-600">
                    {totalAmount.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}