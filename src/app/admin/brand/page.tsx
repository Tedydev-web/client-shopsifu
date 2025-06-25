'use client'

import BrandTableWrapper from "@/components/admin/brand/brand-Wrapper";
import { useTranslation } from "react-i18next";

export default function BrandPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.brand.title", "Quản lý thương hiệu")}</h2>
        <p className="text-muted-foreground">
          {t("admin.brand.subtitle", "Quản lý các thương hiệu trong hệ thống.")}
        </p>
      </div>
      <BrandTableWrapper />
    </div>
  )
}
