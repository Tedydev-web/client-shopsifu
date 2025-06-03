"use client";
import { PasswordSecurityTable } from "@/components/client/user/account/security/security-Table";
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation();
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('user.account.security.title')}</h2>
        {/* <p className="text-muted-foreground">
          {t('user.account.security.subtitle')}
        </p> */}
      </div>
      <PasswordSecurityTable />
    </div>
  );
}