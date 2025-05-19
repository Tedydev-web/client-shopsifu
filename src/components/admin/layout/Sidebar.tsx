'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { sidebarConfig, SidebarItem } from '@/constants/sidebarConfig'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/useResponsive'
import { Button } from '@/components/ui/button'
import React from 'react'

interface SidebarProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sidebar({ isOpen: externalOpen, onOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [internalOpen, setInternalOpen] = useState(false)
  const { isMobile } = useResponsive()

  const open = externalOpen ?? internalOpen
  const setOpen = (value: boolean) => {
    setInternalOpen(value)
    onOpenChange?.(value)
  }

  const toggleItem = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const isActive = (href: string, item: SidebarItem) => {
    // Kiểm tra chính xác đường dẫn
    if (pathname === href) return true

    // Kiểm tra submenu items
    if (item.subItems) {
      return item.subItems.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href + '/'))
    }

    // Kiểm tra các trường hợp đặc biệt
    if (href === '/admin/product' && pathname.startsWith('/admin/products')) return true
    if (href === '/admin/orders' && pathname.startsWith('/admin/orders')) return true
    if (href === '/admin/system' && pathname.startsWith('/admin/role')) return true

    return false
  }

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = expandedItems.includes(item.href)
    const isItemActive = isActive(item.href, item)

    return (
      <div key={item.href} className={cn(level > 0 && "pt-1")}>
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2 rounded-md',
            'transition-colors duration-200 cursor-pointer',
            level === 0 && 'hover:bg-primary/10',
            level > 0 && 'hover:text-primary',
            isItemActive && level === 0 && 'bg-primary/10 text-primary',
            level > 0 && 'pl-10'
          )}
          onClick={() => hasSubItems ? toggleItem(item.href) : undefined}
        >
          {hasSubItems ? (
            <div className="flex items-center gap-3 flex-1">
              {level === 0 && item.icon &&
                React.isValidElement(item.icon) && item.icon.type
                  ? React.createElement(item.icon.type, {
                      className: cn("w-5 h-5", isItemActive ? "text-primary" : "text-[#52525B]")
                    })
                  : null
              }
              <span className={cn(
                "text-sm font-medium text-[#52525B]",
                level > 0 && "text-muted-foreground capitalize",
                isItemActive && 'text-primary'
              )}>
                {item.title}
              </span>
            </div>
          ) : (
            <Link href={item.href} className="flex items-center gap-3 flex-1">
              {level === 0 && item.icon &&
                React.isValidElement(item.icon) && item.icon.type
                  ? React.createElement(item.icon.type, {
                      className: cn("w-5 h-5", isItemActive ? "text-primary" : "text-[#52525B]")
                    })
                  : null
              }
              <span className={cn(
                "text-sm font-medium text-[#52525B]",
                level > 0 && "text-muted-foreground capitalize",
                isItemActive && 'text-primary'
              )}>
                {item.title}
              </span>
            </Link>
          )}

          {hasSubItems && (
            <ChevronDown
              className={cn('w-4 h-4 transition-transform duration-200 text-muted-foreground', isExpanded && 'rotate-180')}
            />
          )}
        </div>

        {hasSubItems && isExpanded && (
          <div className="mt-1 space-y-0.5">
            {item.subItems?.map(subItem => renderItem(subItem, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Overlay when mobile menu is open */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'w-64 bg-white border-r h-[calc(100vh-4rem)] fixed top-16',
        {
          // Mobile styles
          'inset-y-0 left-0 z-50 h-screen transition-transform duration-300': isMobile,
          '-translate-x-full': isMobile && !open,
        }
      )}>
        {isMobile && (
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/admin" className="flex items-center">
              <Image 
                src="/images/logo/logofullred.png" 
                alt="Shopsifu Logo" 
                width={116} 
                height={66} 
                className="mr-2"
              />
            </Link>
            <Button 
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
        <div className={cn(
          "h-full overflow-y-auto",
          isMobile && "h-[calc(100vh-4rem)]"
        )}>
          <nav className="p-4 space-y-2">
            {sidebarConfig.map(item => renderItem(item))}
          </nav>
        </div>
      </aside>
    </>
  )
}
