"use client";

import { TabsContent } from "@/components/ui/tabs";
import { OrderEmpty } from "./orders-Empty";

export const OrderTabContent = () => {
  const tabKeys = [
    "all",
    "pending",
    "confirmed",
    "shipping",
    "delivered",
    "cancelled",
  ];
  const contentClass = "bg-white rounded-xl h-[85vh] px-4 py-6";

  return (
    <>
      {tabKeys.map((key) => (
        <TabsContent
          key={key}
          value={key}
          className="bg-white rounded-xl h-[85vh] px-4 py-6 data-[state=active]:shadow-lg transition-all"
        >
          {key === "all" ? (
            <OrderEmpty />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Chưa có đơn hàng
            </div>
          )}
        </TabsContent>
      ))}
    </>
  );
};
