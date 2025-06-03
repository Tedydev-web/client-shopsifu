"use client"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { SheetRework } from '@/components/ui/component/sheet-rework'
import { useTranslation } from 'react-i18next'

interface ProfileUpdateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    name: string
    email: string
    language: string
  }
}

export function ProfileUpdateSheet({ open, onOpenChange, initialData }: ProfileUpdateSheetProps) {
  const [name, setName] = useState(initialData.name)
  const [email, setEmail] = useState(initialData.email)
  const [language, setLanguage] = useState(initialData.language)
  const {t} = useTranslation()

  return (
    <SheetRework
      open={open}
      onOpenChange={onOpenChange}
      title={t('admin.profileUpdate.title')}
      subtitle={t('admin.profileUpdate.subtitle')}
      onCancel={() => onOpenChange(false)}
      onConfirm={() => { /* handle save here */ }}
      confirmText={t('user.account.profile.save')}
      cancelText={t('user.account.profile.cancel')}
    >
      <form className="flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('admin.profileUpdate.name')}</label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">{t('admin.profileUpdate.lang')}</label>
          <Input id="language" value={language} onChange={e => setLanguage(e.target.value)} />
        </div>
      </form>
    </SheetRework>
  )
}
