'use client'

import { useState } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import UserSidebar from '@/components/client/user/layout/user-Sidebar'
import { cn } from '@/lib/utils'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isMobile } = useResponsive()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    // <div className="min-h-screen bg-background text-foreground">
    <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto">
      {/* MOBILE HEADER + SIDEBAR SHEET */}
      {isMobile && (
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold">Account</h1>
            <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* MOBILE SIDEBAR */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div 
            className={cn(
              "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className={cn(
            "fixed top-0 left-0 bottom-0 w-64 bg-white z-50 transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <UserSidebar />
          </div>
        </>
      )}

      {/* MAIN CONTENT */}
      <div className={isMobile ? 'mt-[50px]' : 'flex'}>
        {!isMobile && (
          <aside className="w-64 h-screen sticky top-0">
            <UserSidebar />
          </aside>
        )}

        <main className={cn(
          "relative w-full",
          isMobile ? "px-4" : "flex-1 p-4 pl-0"
        )}>
          <div className="max-w-4xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
// Chia 2 Layout giữa Desktop và Moblie ở đây
// Riêng Desktop thì sẽ xử lý Layout chia 1 bên Sidebar 1 bên Nội dung Children để có thể hiển thị được nội dung 
// Của Page Layout Desktop