"use client"

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface MobileHeaderProps {
  title: string;
}

export default function MobileHeader({ title }: MobileHeaderProps) {
  const pathname = usePathname()
  const isNestedRoute = pathname.split('/').length > 2
  const backUrl = isNestedRoute ? '/user' : '/'

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <Link href={backUrl} className="p-1 -ml-2">
          <ChevronLeft className="w-6 h-7 text-gray-600" />
        </Link>
        <h1 className="text-lg font-bold flex-1 text-center">{title}</h1>
        <div className="w-9" /> {/* Spacer to center title */}
      </div>
    </div>
  )
}