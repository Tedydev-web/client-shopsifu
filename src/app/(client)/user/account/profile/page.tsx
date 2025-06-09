"use client";
import { ProfileMain } from '@/components/client/user/account/profile/profile-Main';
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
      <ProfileMain />
    </div>
  );
}