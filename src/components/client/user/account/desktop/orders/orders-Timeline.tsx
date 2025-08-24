"use client";

import { FileText, DollarSign, Truck, Package, Star } from "lucide-react";

const steps = [
  { label: "Đơn Hàng Đã Đặt", icon: FileText },
  { label: "Đã Xác Nhận Thanh Toán", icon: DollarSign },
  { label: "Đã Giao Cho ĐVVC", icon: Truck },
  { label: "Đã Nhận Được Hàng", icon: Package },
  { label: "Đơn Hàng Hoàn Thành", icon: Star },
];

// giả sử bước hiện tại là số 2
const currentStepIndex = 2;

export function OrderTimeline() {
  return (
    <div className="relative flex items-center justify-between w-full px-10">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= currentStepIndex;

        return (
          <div key={index} className="relative flex flex-col items-center flex-1">
            {/* Circle */}
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-full border-2 z-10 ${
                isActive
                  ? "border-green-500 text-green-500 bg-white"
                  : "border-gray-300 text-gray-400 bg-white"
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>

            {/* Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-1/2 left-1/2 right-[-50%] h-[3px] -translate-y-1/2 ${
                  index < currentStepIndex ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
