'use client';

import Link from 'next/link';
import { Facebook, Instagram, Bell, HelpCircle } from 'lucide-react';
import { ProfileDropdown } from './header-Profile';
import { ChangeLangs } from './header-ChangeLangs';

export function TopBar() {

  return (
    <div className="bg-white">
      <div className="max-w-[1100px] mx-auto">
        <div className="px-4 h-8 flex items-center justify-between text-xs text-black">
          {/* Left Side: Connect + Social Icons */}
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 opacity-80 hover:opacity-100 hover:underline transition-opacity text-[13px] font-medium">
              Kết nối
            </span>
            <div className="flex items-center space-x-3">
              <Link href="#" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Side: Notifications, Support, Language, Profile */}
          <div className="flex items-center space-x-6">
            <Link href="#" className="flex items-center gap-1.5 hover:opacity-70 hover:underline transition-opacity text-[13px] font-medium">
              <Bell className="h-4 w-4" />
              <span>Thông báo</span>
            </Link>
            <Link href="#" className="flex items-center gap-1.5 hover:opacity-70 hover:underline transition-opacity text-[13px] font-medium">
              <HelpCircle className="h-4 w-4" />
              <span>Hỗ trợ</span>
            </Link>            {/* Language Switch */}
            <ChangeLangs />

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </div>
  );
} 