'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { Header } from '@/components/admin/Header'
import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/useResponsive'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isMobile } = useResponsive()

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  return (
    <div className="min-h-screen">
      <Header onToggleSidebar={handleToggleSidebar} />
      <div className="pt-16 flex">
        <Sidebar isOpen={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className={cn(
          "flex-1 transition-[margin] duration-300 ease-in-out",
          !isMobile && (sidebarOpen ? "ml-64" : "ml-0")
        )}>
          <main className="p-6">
            <div className="max-w-[2000px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
