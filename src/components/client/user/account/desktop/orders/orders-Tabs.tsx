"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const tabClass =
  "flex-1 text-center rounded-none no-underline px-3 py-2 text-sm data-[state=active]:text-red-500 data-[state=active]:border-b data-[state=active]:shadow-none";

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

  return (
    <div className="relative w-full">
      <div ref={scrollRef} className="w-full overflow-x-auto scrollbar-hide">
        <TabsList className="w-full flex rounded-none bg-transparent px-2 py-2 h-14">
          <TabsTrigger value="all" className={tabClass}>
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="pending" className={tabClass}>
            Chờ xác nhận
          </TabsTrigger>
          <TabsTrigger value="confirmed" className={tabClass}>
            Đã xác nhận
          </TabsTrigger>
          <TabsTrigger value="shipping" className={tabClass}>
            Đang vận chuyển
          </TabsTrigger>
          <TabsTrigger value="delivered" className={tabClass}>
            Đã giao hàng
          </TabsTrigger>
          <TabsTrigger value="cancelled" className={tabClass}>
            Đã huỷ
          </TabsTrigger>
        </TabsList>
      </div>

      {showLeftArrow && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white to-transparent h-full w-10 flex items-center justify-start pointer-events-none">
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
