'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Bell,
  Search,
  Settings,
  User,
  ChevronDown,
  Store,
  Globe,
  LogOut,
  Menu
} from 'lucide-react'
import { useResponsive } from '@/hooks/useResponsive'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useLogout } from '@/hooks/useLogout'

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { isMobile } = useResponsive()
  const { handleLogout, loading } = useLogout() // Sử dụng hook useLogout để lấy handleLogout và loading

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 h-16 z-30">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Logo + Hamburger */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button onClick={onToggleSidebar} className="text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
          )}
          <Link href="/admin" className="flex items-center">
            <Image 
              src="/images/logo/logofullred.png" 
              alt="Shopsifu Logo" 
              width={116} 
              height={66} 
              className="mr-2"
            />
          </Link>
        </div>

        {/* Search bar */}
        {!isMobile && (
          <div className="flex items-center max-w-md w-full relative">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 bg-red-600 rounded-full w-2 h-2"></span>
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          {/* Dropdown Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer space-x-2 px-2 py-1 hover:bg-gray-100 rounded-md">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  Hello, tung63soi
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 mr-4">
              <div className="flex flex-col items-center py-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-sm font-medium">tung63soi</p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Store className="w-4 h-4 mr-2" />
                Hồ Sơ Shop
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Thiết Lập Shop
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Globe className="w-4 h-4 mr-2" />
                Tiếng Việt (Vietnamese)
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Đăng xuất */}
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={handleLogout} 
                disabled={loading} // Vô hiệu hóa nút khi đang loading
              >
                <LogOut className="w-4 h-4 mr-2" />
                {loading ? 'Đang đăng xuất...' : 'Đăng xuất'} {/* Hiển thị loading */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
