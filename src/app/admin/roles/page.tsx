'use client'
import RolesTableWrapper from "@/components/admin/roles/roles-Wrapper"
import { useTranslations } from "next-intl";

export default function RolesPage() {
  const t = useTranslations()
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