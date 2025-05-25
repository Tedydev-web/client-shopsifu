'use client'
import { ProfileSettingsTable } from "@/components/admin/settings/profile/profile-Table";
import { useTranslation } from "react-i18next";

export default function AdminProfileSettingsPage() {
    const { t } = useTranslation()
    return (
      <div className="space-y-6">
        <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.settings.profile.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.settings.profile.subtitle")}
        </p>
        </div>
        <ProfileSettingsTable />
      </div>
    )
  }
  


