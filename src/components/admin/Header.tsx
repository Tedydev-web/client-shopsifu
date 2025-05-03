import Link from 'next/link'
import { 
  Bell, 
  Search, 
  Settings, 
  User,
  ChevronDown
} from 'lucide-react'
import Image from 'next/image'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center">
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
        <div className="hidden md:flex items-center max-w-md w-full relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Right section: notifications, settings, profile */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 bg-red-600 rounded-full w-2 h-2"></span>
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-2 hidden md:block">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@shopsifu.com</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
          </div>
        </div>
      </div>
    </header>
  )
}