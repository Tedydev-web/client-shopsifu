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
      className="
    w-full bg-white
    min-h-[70vh]              /* Mobile default */
    rounded-none shadow-none  /* Mobile bỏ shadow và bo góc */
    md:min-h-[85vh]           /* Desktop override */
    md:rounded-xl md:shadow-sm
  "
    >
      {/* Tabs list */}
      <OrderTabs />

      {/* Bộ lọc ngày */}
      <OrderDateFilter />

      {/* Nội dung tab */}
      <OrderTabContent currentTab={currentTab} onTabChange={setCurrentTab} />
    </Tabs>
  );
}
