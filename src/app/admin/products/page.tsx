'use client'
import ProductsTableWrapper from "@/components/admin/products/products-Wrapper";
import { useTranslations } from "next-intl";

export default function ProductsPage() {
  const t = useTranslations('admin.ModuleProduct')
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>
      <ProductsTableWrapper />
    </div>
  )
}