'use client'

import BrandTableWrapper from "@/components/admin/brand/brand-Wrapper";
import { useTranslations } from "next-intl";

export default function BrandPage() {
  const t = useTranslations()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.brand.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.brand.subtitle")}
        </p>
      </div>
      <BrandTableWrapper />
    </div>
  )
}
