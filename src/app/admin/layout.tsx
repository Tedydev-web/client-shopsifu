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
    <div className="relative min-h-screen bg-background">
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div
        className={cn(
          "min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out",
          isMobile
            ? "mt-16"
            : "mt-16 ml-64" // Always keep margin for desktop/laptop
        )}
      >
        <main className="p-6">
          <div className="max-w-[2000px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
