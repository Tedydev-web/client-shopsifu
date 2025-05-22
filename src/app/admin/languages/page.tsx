'use client'
import { LanguagesTable } from "@/components/admin/languages/languages-Table";
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
      <LanguagesTable />
    </div>
  )
}