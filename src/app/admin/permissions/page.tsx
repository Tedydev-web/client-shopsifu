'use client'
import { PermissionsTable } from "@/components/admin/permissions/permissions-Table";
import { useTranslation } from "react-i18next";

export default function PermissionsPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.permissions.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.permissions.subtitle")}
        </p>
      </div>
      <PermissionsTable />
    </div>
  )
}