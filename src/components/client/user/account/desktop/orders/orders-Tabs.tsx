"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { OrderStatus } from "@/types/order.interface";

export const OrderTabs = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (el) {
      setShowLeftArrow(el.scrollLeft > 0);
      setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const tabValues = [
    { value: "all", label: "Tất cả" },
    { value: OrderStatus.PENDING_PAYMENT, label: "Chờ thanh toán" },
    { value: OrderStatus.PENDING_PACKAGING, label: "Đang đóng gói" },
    { value: OrderStatus.PENDING_PICKUP, label: "Chờ lấy hàng" },
    { value: OrderStatus.PENDING_DELIVERY, label: "Đang giao hàng" },
    { value: OrderStatus.DELIVERED, label: "Đã giao" },
    { value: OrderStatus.RETURNED, label: "Trả hàng" },
    { value: OrderStatus.CANCELLED, label: "Đã huỷ" },
  ];

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto scrollbar-hide lg:overflow-x-hidden"
      >
        <TabsList
          className="flex w-max min-w-full
            bg-white overflow-x-auto scrollbar-hide
            border-b border-gray-200
            px-1 md:px-2 py-0.5 sm:py-1 
            h-10 sm:h-11 gap-0 md:gap-2"
        >
          {tabValues.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative flex-shrink-0 whitespace-nowrap 
                     text-[11px] sm:text-xs md:text-sm font-medium text-muted-foreground 
                     px-2 sm:px-3 py-1.5 sm:py-2 text-center 
                     bg-transparent border-none shadow-none rounded-md md:rounded-none
                     hover:bg-gray-50 md:hover:bg-transparent
                     focus:outline-none focus:ring-0 focus-visible:ring-0 
                     data-[state=active]:text-[#d70018] 
                     data-[state=active]:after:content-[''] 
                     data-[state=active]:after:absolute 
                     data-[state=active]:after:inset-x-0 
                     data-[state=active]:after:-bottom-0.5 sm:data-[state=active]:after:-bottom-1
                     data-[state=active]:after:-right-0
                     data-[state=active]:after:h-[2px] sm:data-[state=active]:after:h-[3px] 
                     data-[state=active]:shadow-none
                     data-[state=active]:after:bg-[#d70018] 
                     md:flex-1"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Left Arrow */}
      {showLeftArrow && (
        <div className="absolute left-0 top-0 h-full w-8 sm:w-10 flex items-center justify-start pointer-events-none md:hidden bg-gradient-to-r from-white to-transparent">
          <ChevronLeft className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 ml-1" />
        </div>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <div className="absolute right-0 top-0 h-full w-8 sm:w-10 flex items-center justify-end pointer-events-none md:hidden bg-gradient-to-l from-white to-transparent">
          <ChevronRight className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 mr-1" />
        </div>
      )}
    </div>
  );
};
