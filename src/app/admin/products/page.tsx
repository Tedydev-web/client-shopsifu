'use client'
import ProductsTableWrapper from "@/components/admin/products/products-Wrapper";
import { useTranslation } from "react-i18next";

export default function ProductsPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.products.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.products.subtitle")}
        </p>
      </div>
      <ProductsTableWrapper />
    </div>
  )
}