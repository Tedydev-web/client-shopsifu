'use client'
import { ProfileSettingsTable } from "@/components/admin/settings/profile/profile-Table";
import { useTranslation } from "react-i18next";

export default function AdminProfileSettingsPage() {
    const { t } = useTranslation()
    return (
      <div className="space-y-6">
        <ProfileSettingsTable />
      </div>
    )
  }
  


