"use client";

import { useRouter } from "next/navigation";
import OrderDetail from "@/components/admin/orders/detail/orders-Detail";

export default function OrderDetailPage() {
  const router = useRouter();

  return <OrderDetail onBack={() => router.push("/admin/order")} />;
}
