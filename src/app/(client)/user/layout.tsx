'use client'

import { useResponsive } from '@/hooks/useResponsive'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sidebar } from '@/components/client/user/layout/user-Sidebar'
import MobileHeader from '@/components/client/user/account/moblie/moblie-Header'

interface AccountLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AccountLayout({ children, title = '' }: AccountLayoutProps) {
  const { isMobile } = useResponsive()

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <MobileHeader title={title} />
        <main className="px-4 h-[calc(100vh-72px)] overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto">
      <div className="flex">
        <aside className="w-64 h-screen sticky top-0">
          <Sidebar />
        </aside>

        <main className="flex-1 p-4 pl-0">
          <div className="max-w-4xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}