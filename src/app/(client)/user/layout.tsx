'use client'

import { useState } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import UserSidebar from '@/components/client/user/layout/user-Sidebar'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isMobile } = useResponsive()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    // <div className="min-h-screen bg-background text-foreground">
    <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto">
      {/* MOBILE HEADER + SIDEBAR SHEET */}
      {isMobile && (
        <>
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold">Account</h1>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 m-0 p-0 h-screen top-0"
              >
                <UserSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </>
      )}

      {/* MAIN CONTENT */}
      <div className={isMobile ? 'p-4' : 'flex'}>
        {!isMobile && (
          <aside className="w-64 border-r h-screen sticky top-0">
            <UserSidebar />
          </aside>
        )}

        <main className={isMobile ? '' : 'flex-1 p-4'}>
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
