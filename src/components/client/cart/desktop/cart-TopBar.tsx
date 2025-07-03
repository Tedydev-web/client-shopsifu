'use client';

import Link from 'next/link';
import {
  Bell,
  HelpCircle,
  ShoppingCart,
  Globe,
  User
} from 'lucide-react';
import LanguageDropdown from "@/components/ui/languagedropdown";

export function CartTopBar() {
  return (
    <div className="bg-white border-b">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center h-9 text-xs text-gray-700 gap-10">

          {/* Left Column - Static links */}
          <div className="flex items-center gap-4 text-[13px]">
            <Link href="#" className="flex items-center gap-1.5 hover:opacity-70 hover:underline transition-opacity">
              <Bell className="h-4 w-4" />
              <span>Thông báo</span>
            </Link>
            <Link href="#" className="flex items-center gap-1.5 hover:opacity-70 hover:underline transition-opacity">
              <HelpCircle className="h-4 w-4" />
              <span>Hỗ trợ</span>
            </Link>
            <Link href="#" className="flex items-center gap-1.5 hover:opacity-70 hover:underline transition-opacity">
              <ShoppingCart className="h-4 w-4" />
              <span>Đăng ký bán hàng</span>
            </Link>
          </div>

          {/* Right Column - Language & Account */}
          <div className="flex items-center space-x-6 shrink-0 text-[13px] font-medium">
            <LanguageDropdown />
            <Link href="#" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
              <User className="h-4 w-4" />
              <span>Tài khoản</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
