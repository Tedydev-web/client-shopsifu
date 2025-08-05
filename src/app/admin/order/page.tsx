'use client'
import { OrdersTable } from "@/components/admin/orders/orders-Table";
import { useTranslations } from "next-intl";

export default function OrdersPage() {
  const t = useTranslations()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.orders.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.orders.subtitle")}
        </p>
      </div>
      <OrdersTable />
    </div>
  )
}