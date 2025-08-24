"use client";

import {
  FileText,
  DollarSign,
  Package,
  Truck,
  Star,
  XCircle,
} from "lucide-react";
import { OrderStatus } from "@/types/order.interface";

interface OrderTimelineProps {
  status: OrderStatus;
  createdAt: string;
  finalAmount?: number;
}

export function OrderTimeline({ status, finalAmount, createdAt }: OrderTimelineProps) {
  // Hủy đơn -> không hiển thị timeline
  if (status === OrderStatus.CANCELLED) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-red-50 rounded-2xl border border-red-200">
        <XCircle className="w-16 h-16 text-red-500 mb-3" />
        <p className="text-lg font-semibold text-red-600">Đơn hàng đã bị hủy</p>
        <p className="text-sm text-gray-500 mt-1">
          Nếu có thắc mắc, vui lòng liên hệ bộ phận hỗ trợ.
        </p>
      </div>
    );
  }

  const isPickuped =
    (OrderStatus as any).PENDING_PICKUP === status ||
    status === (OrderStatus as any).PICKUPED;

  // ===== Labels =====
let step2Label = "Đã Xác Nhận Thông Tin Thanh Toán";  // Simplified step 2
let step3Label = "Đang Chuẩn Bị Hàng";

if (status === OrderStatus.PENDING_PACKAGING) {
  step3Label = "Người Bán Đang Chuẩn Bị Hàng";
} else if (isPickuped) {
  step3Label = "ĐVVC Đã Lấy Hàng Thành Công";
}

  let step4Label = "Đang Vận Chuyển";
  if (status === OrderStatus.PENDING_DELIVERY)
    step4Label = "Đơn Hàng Đang Vận Chuyển";
  if (status === OrderStatus.DELIVERED) step4Label = "Đã Giao Hàng Thành Công";

  const steps = [
    { label: "Đơn Hàng Đã Đặt", icon: FileText },
    { label: step2Label, icon: DollarSign },
    { label: step3Label, icon: Package },
    { label: step4Label, icon: Truck },
    { label: "Đơn Hàng Hoàn Thành", icon: Star },
  ];

  // ===== currentStepIndex =====
  let currentStepIndex = 0;

  if (
    status === OrderStatus.VERIFY_PAYMENT ||
    status === OrderStatus.PENDING_PACKAGING
  ) {
    currentStepIndex = 2; // cột 3
  } else if (isPickuped || status === OrderStatus.PENDING_DELIVERY) {
    currentStepIndex = 3; // cột 4
  } else if (status === OrderStatus.DELIVERED) {
    currentStepIndex = 4; // cột 5
  } else if (status === OrderStatus.PENDING_PAYMENT) {
    currentStepIndex = 0; // cột 1
  }

  return (
    <div className="w-full px-6 py-8">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between relative w-full">
        <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-gray-200">
          <div
            className="h-[2px] bg-green-500 transition-[width] duration-300"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon as any;
          const isActive = index <= currentStepIndex;
          return (
            <div
              key={index}
              className="relative flex flex-col items-center flex-1 text-center"
            >
              <div
                className={`absolute top-[22px] w-8 h-8 rounded-full transition-colors duration-300 ${
                  isActive ? "bg-green-100" : "bg-gray-100"
                }`}
              />
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full z-10 ${
                  isActive ? "text-green-500" : "text-gray-400"
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p
                className={`mt-3 text-sm font-medium leading-snug break-words px-4 max-w-[200px] ${
                  isActive ? "text-green-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-6 md:hidden relative">
        {steps.map((step, index) => {
          const Icon = step.icon as any;
          const isActive = index <= currentStepIndex;
          return (
            <div key={index} className="flex items-start gap-4 relative">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 z-10 shrink-0 ${
                  isActive
                    ? "border-green-500 text-green-500"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p
                className={`text-sm font-medium leading-snug ${
                  isActive ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-6 top-12 w-[2px] h-full ${
                    index < currentStepIndex ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
