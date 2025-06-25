'use client'
import ProfileSettingsTableWrapper from "@/components/admin/settings/profile/profile-Wrapper";
import { useTranslation } from "react-i18next";

export default function AdminProfileSettingsPage() {
    const { t } = useTranslation()
    return (
      <div className="space-y-6">
        <ProfileSettingsTableWrapper />
      </div>
    )
  }
  


