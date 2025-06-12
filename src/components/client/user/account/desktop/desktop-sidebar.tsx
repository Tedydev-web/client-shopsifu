'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { sidebarItems } from './desktop-MockData'

export default function DesktopSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<null | number>(null)
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null)

  const toggleDropdown = (index: number, subItems?: { href: string }[]) => {
    if (openIndex === index) {
      setOpenIndex(null)
    } else {
      if (subItems && subItems.length > 0) {
        router.push(subItems[0].href)
      }
      setOpenIndex(index)
    }
  }

  useEffect(() => {
    sidebarItems.forEach((item, index) => {
      if (item.subItems) {
        const activeSub = item.subItems.find(sub => pathname === sub.href)
        if (activeSub) {
          setActiveSubItem(activeSub.labelKey)
          setOpenIndex(index)
        }
      }
    })
    const activeParent = sidebarItems.find(item => pathname === item.href)
    if (activeParent) {
      setActiveSubItem(activeParent.labelKey)
    }
  }, [pathname])

  return (
    <nav className="w-full ms:w-[240px] px-4 py-6 space-y-2 bg-white">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4 px-2">
        <Link href="/" className="hover:underline">
          {t('user.account.home')}
        </Link>
        <span className="mx-2">{'/'}</span>
        <span>{activeSubItem ? t(activeSubItem) : t('user.account.profile.profile')}</span>
      </div>

      {/* Sidebar Items */}
      {sidebarItems.map((item, index) => (
        <div key={item.href}>
          {item.subItems ? (
            <div>
              <button
                onClick={() => toggleDropdown(index, item.subItems)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-sm font-semibold transition-colors w-full text-left',
                  'text-gray-900 hover:bg-gray-100'
                )}
              >
                <span className="flex items-center text-gray-900 font-semibold">
                  {item.icon}
                  {t(item.labelKey)}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-4 h-4 text-gray-900" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-900" />
                )}
              </button>
              {openIndex === index && (
                <ul className="space-y-1 mt-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        href={subItem.href}
                        onClick={() => setActiveSubItem(subItem.labelKey)}
                        className={cn(
                          'block py-2 px-3 pl-[1.75rem] text-sm font-semibold transition-colors', // 👈 chỉnh lề này
                          pathname === subItem.href
                            ? 'bg-orange-100 text-black border-l-4 border-red-600'
                            : 'text-gray-900 hover:bg-gray-100'
                        )}
                      >
                        {t(subItem.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <Link href={item.href}>
              <div
                onClick={() => setActiveSubItem(item.labelKey)}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-semibold transition-colors',
                  pathname === item.href
                    ? 'bg-orange-100 text-black border-l-4 border-red-600'
                    : 'text-gray-900 hover:bg-gray-100'
                )}
              >
                {item.icon}
                {t(item.labelKey)}
              </div>
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
