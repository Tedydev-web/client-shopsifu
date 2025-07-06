'use client'
import ProfileSettingsTableWrapper from "@/components/admin/settings/profile/profile-Wrapper";
import { useTranslations } from "next-intl";

export default function AdminProfileSettingsPage() {
    const t = useTranslations()
    return (
      <div className="space-y-6">
        <ProfileSettingsTableWrapper />
      </div>
    )
  }
  


