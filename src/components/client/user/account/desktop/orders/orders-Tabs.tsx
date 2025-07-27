"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";

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
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "shipping", label: "Đang vận chuyển" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "cancelled", label: "Đã huỷ" },
  ];

  return (
    <div className="relative w-full">
      <div ref={scrollRef} className="w-full overflow-x-auto scrollbar-hide">
        <TabsList className="w-full flex rounded-none bg-white px-2 py-2 h-14 gap-4">
          {tabValues.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative text-sm font-medium text-muted-foreground px-4 py-2 bg-transparent border-none shadow-none rounded-none hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 data-[state=active]:text-[#d70018] data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-1 data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#d70018]"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {showLeftArrow && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 from-white to-transparent h-full w-10 flex items-center justify-start pointer-events-none">
          <ChevronLeft className="text-gray-400 w-5 h-5" />
        </div>
      )}

      {showRightArrow && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white to-transparent h-full w-10 flex items-center justify-end pointer-events-none">
          <ChevronRight className="text-gray-400 w-5 h-5" />
        </div>
      )}
    </div>
  );
};
