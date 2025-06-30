"use client"

import Link from 'next/link'
import { ChevronLeft, Pencil } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface MobileCartHeaderProps {
  title: string;
  onEdit?: () => void;
}

export default function MobileCartHeader({ title, onEdit }: MobileCartHeaderProps) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const isNestedRoute = pathname.split('/').length > 2
  const backUrl = isNestedRoute ? '/user' : '/'

  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="px-4 pt-4 pb-3 flex items-center border-b border-gray-200 justify-between">
        <Link href={backUrl} className="p-1 -ml-2">
          <ChevronLeft className="w-6 h-7 text-gray-600" />
        </Link>
        <h1 className="text-lg font-bold flex-1 text-center">{title}</h1>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={onEdit}
        >
          <Pencil className="w-5 h-5" />
          <span className="text-sm">{t("user.cart.edit")}</span>
        </Button>
      </div>
    </div>
  )
}