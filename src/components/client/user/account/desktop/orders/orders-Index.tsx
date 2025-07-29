"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { OrderTabs } from "./orders-Tabs";
import { OrderDateFilter } from "./orders-DateFilter";
import { OrderTabContent } from "./orders-TabsContents";

export default function OrderHistory() {
  const [currentTab, setCurrentTab] = useState("all");

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      // className="w-full bg-white md:rounded-xl md:shadow-sm md:h-[85vh]"
      className="w-full bg-white md:rounded-xl md:shadow-sm md:min-h-[85vh]"
    >
      {/* Tabs list */}
      <OrderTabs />

      {/* Bộ lọc ngày (nếu có) */}
      <OrderDateFilter />

      {/* Nội dung tab (dùng hook useOrder) */}
      <OrderTabContent
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />
    </Tabs>
  );
}
