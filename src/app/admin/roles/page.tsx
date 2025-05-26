'use client'
import RolesTable from "@/components/admin/roles/roles-Table"
import { useTranslation } from "react-i18next";

export default function LanguagesPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.languages.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.languages.subtitle")}
        </p>
      </div>
      <RolesTable />
    </div>
  )
}