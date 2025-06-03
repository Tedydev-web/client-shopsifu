'use client'

import { useTranslation } from 'react-i18next'

export default function AccountPage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-semibold">{t('user.account.profile.profile')}</h1>
      <p className="text-muted-foreground">{t('user.account.profile.manageProfile')}</p>

      <div className="p-4 border rounded-lg bg-muted">
        <p>Nội dung test layout tài khoản ở đây.</p>
      </div>
    </div>
  )
}
