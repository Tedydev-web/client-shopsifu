"use client";
import ProfileIndex from "@/components/client/user/account/profile/profile-Index";
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation();
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('user.account.profile.title')}</h2>
        <p className="text-muted-foreground">
          {t('user.account.profile.subtitle')}
        </p>
      </div>
      <ProfileIndex />
    </div>
  );
}