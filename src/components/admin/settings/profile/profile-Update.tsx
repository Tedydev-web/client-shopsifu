"use client"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { SheetRework } from '@/components/ui/component/sheet-rework'

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

  return (
    <SheetRework
      open={open}
      onOpenChange={onOpenChange}
      title="Chỉnh sửa thông tin tài khoản"
      subtitle="Cập nhật các trường thông tin bên dưới và nhấn lưu để hoàn tất."
      onCancel={() => onOpenChange(false)}
      onConfirm={() => { /* handle save here */ }}
      confirmText="Lưu thay đổi"
      cancelText="Hủy"
    >
      <form className="flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Ngôn ngữ</label>
          <Input id="language" value={language} onChange={e => setLanguage(e.target.value)} />
        </div>
      </form>
    </SheetRework>
  )
}
