'use client'

import { Tabs } from "@/components/ui/tabs"

import { OrderDateFilter } from "./orders-DateFilter"
import { OrderTabContent } from "./orders-TabsContents"
import { OrderTabs } from "./orders-Tabs";


export default function OrderHistory() {
  return (
    <Tabs defaultValue="all" className="w-full bg-white rounded-xl shadow-sm h-[85vh]">
      <OrderTabs />
      <OrderDateFilter />
      <OrderTabContent />
    </Tabs>
  )
}
