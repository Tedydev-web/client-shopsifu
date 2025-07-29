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
        className="w-full overflow-x-auto scrollbar-hide md:overflow-x-hidden"
      >
        <TabsList className="flex w-max md:w-full bg-white px-2 py-2 h-12 gap-2 md:justify-between md:gap-2">
          {tabValues.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative flex-shrink-0 whitespace-nowrap 
                     text-xs md:text-sm font-medium text-muted-foreground 
                     px-3 py-2 text-center 
                     bg-transparent border-none shadow-none rounded-none 
                     hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 
                     data-[state=active]:text-[#d70018] 
                     data-[state=active]:after:content-[''] 
                     data-[state=active]:after:absolute 
                     data-[state=active]:after:inset-x-0 
                     data-[state=active]:after:-bottom-1 
                     data-[state=active]:after:h-[3px] 
                     data-[state=active]:shadow-none
                     data-[state=active]:after:bg-[#d70018] 
                     md:flex-1"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {showLeftArrow && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 from-white to-transparent h-full w-10 flex items-center justify-start pointer-events-none md:hidden">
          <ChevronLeft className="text-gray-400 w-5 h-5" />
        </div>
      )}
      {showRightArrow && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white to-transparent h-full w-10 flex items-center justify-end pointer-events-none md:hidden">
          <ChevronRight className="text-gray-400 w-5 h-5" />
        </div>
      )}
    </div>
  );
};
