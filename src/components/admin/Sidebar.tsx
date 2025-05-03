'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sidebarConfig, SidebarItem } from '@/constants/sidebarConfig'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleItem = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = expandedItems.includes(item.href)
    const isItemActive = isActive(item.href)

    return (
      <div key={item.href}>
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2 rounded-md',
            'transition-colors duration-200',
            level === 0 && 'hover:bg-primary/10',
            level > 0 && 'hover:text-primary',
            isItemActive && level === 0 && 'bg-primary/10 text-primary',
            level > 0 && 'pl-8'
          )}
          onClick={() => hasSubItems ? toggleItem(item.href) : undefined}
        >
          {hasSubItems ? (
            <div className="flex items-center gap-3 flex-1 cursor-pointer">
              {level === 0 && item.icon}
              <span className={cn(
                "text-sm font-medium",
                level > 0 && "text-muted-foreground"
              )}>{item.title}</span>
            </div>
          ) : (
            <Link
              href={item.href}
              className="flex items-center gap-3 flex-1"
            >
              {level === 0 && item.icon}
              <span className={cn(
                "text-sm font-medium",
                level > 0 && "text-muted-foreground"
              )}>{item.title}</span>
            </Link>
          )}

          {hasSubItems && (
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200 text-muted-foreground',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </div>

        {hasSubItems && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.subItems?.map(subItem => renderItem(subItem, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] bg-white border-r fixed left-0 top-16 overflow-y-auto z-20">
      <div className="p-4">
        <nav className="space-y-2">
          {sidebarConfig.map(item => renderItem(item))}
        </nav>
      </div>
    </aside>
  )
}
