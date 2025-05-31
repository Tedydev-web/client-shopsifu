'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Bell, HelpCircle, Globe, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useChangeLang } from '@/hooks/useChangeLang';
import { useState, useRef, useEffect } from 'react';
import { ProfileDropdown } from './header-Profile';

export function TopBar() {
  const { changeLanguage, currentLangName, currentSelectedLang } = useChangeLang();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLanguageDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsLanguageDropdownOpen(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
            </Link>

            {/* Language Switch */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <DropdownMenu open={isLanguageDropdownOpen} onOpenChange={setIsLanguageDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="cursor-pointer bg- hover:bg- h-auto px-0 flex items-center gap-1.5 text-black hover:opactity-70 text-[13px] font-medium"
                  >
                    <Globe className="h-4 w-4" />
                    <span>{currentLangName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-40 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-700 text-[11px] [&>button]:hover:bg-none [&>button]:hover:underline"
                  sideOffset={5}
                >
                  <DropdownMenuItem 
                    className="hover:bg-none px-4 py-2 cursor-pointer" 
                    onClick={() => changeLanguage('vi')}
                  >
                    Tiếng Việt
                    {currentSelectedLang === 'vi' && <Check className="w-3.5 h-3.5 text-green-500 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-none px-4 py-2 cursor-pointer" 
                    onClick={() => changeLanguage('en')}
                  >
                    English
                    {currentSelectedLang === 'en' && <Check className="w-3.5 h-3.5 text-green-500 ml-auto" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </div>
  );
} 