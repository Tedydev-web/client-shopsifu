'use client'
import PermissionsTableWrapper from "@/components/admin/permissions/permissions-Wrapper";
import { useTranslations } from "next-intl";

export default function PermissionsPage() {
  const t = useTranslations()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.permissions.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.permissions.subtitle")}
        </p>
      </div>
      <PermissionsTableWrapper />
    </div>
  )
}