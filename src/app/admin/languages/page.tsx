'use client'
import LanguagesTableWrapper from "@/components/admin/languages/languages-Wrapper";
import { useTranslations } from "next-intl";

export default function LanguagesPage() {
  const t = useTranslations()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.languages.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.languages.subtitle")}
        </p>
      </div>
      <LanguagesTableWrapper />
    </div>
  )
}