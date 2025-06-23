'use client'
import { PasswordSecurityWrapper } from "@/components/admin/settings/password-and-security/passwordSecurity-Wrapper";
import { useTranslation } from "react-i18next";

export default function PasswordAndSecuritySettingsPage() {
    const { t } = useTranslation()
    return (
      <div className="space-y-6 max-w-[1000px] mx-auto">
        <PasswordSecurityWrapper />
      </div>
    )
  }
  


