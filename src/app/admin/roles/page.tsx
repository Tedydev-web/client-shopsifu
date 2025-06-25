'use client'
import RolesTableWrapper from "@/components/admin/roles/roles-Wrapper"
import { useTranslation } from "react-i18next";

export default function RolesPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.roles.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.roles.subtitle")}
        </p>
      </div>
      <RolesTableWrapper />
    </div>
  )
}