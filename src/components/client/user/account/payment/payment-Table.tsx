// components/PaymentTable.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Plus } from "lucide-react";

export default function PaymentTable() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Credit/Debit Card Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">{t('user.account.payment.creditDebitCard')}</h2>
        <Button className="bg-red-500 text-white hover:bg-red-600">
          <Plus className="w-4 h-4" />
          {t('user.account.payment.addNewCard')}
        </Button>
      </div>
      <div className="border-b border-gray-200 mb-6"></div>
      <div className="p-4 text-center text-gray-500 mb-8 min-h-32">
        {t('user.account.payment.noCardLinked')}
      </div>

      {/* Bank Account Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">{t('user.account.payment.bankAccount')}</h2>
        <Button className="bg-red-500 text-white hover:bg-red-600">
          <Plus className="w-4 h-4" />
          {t('user.account.payment.addBankLink')}
        </Button>
      </div>
      <div className="border-b border-gray-200 mb-6"></div>
      <div className="p-4 text-center text-gray-500">
        {t('user.account.payment.noBankLinked')}
      </div>
    </div>
  )
}