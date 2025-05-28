'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Search, Facebook, Instagram, Bell, HelpCircle, Globe, ChevronDown, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchInput } from './search-Input';
import { CartDropdown } from './cart-Dropdown';
import Image from 'next/image';
import { ProfileDropdown } from './profile-Dropdown';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useChangeLang } from '@/hooks/useChangeLang';
import { useState, useRef, useEffect } from 'react';

export function Header() {
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
    }, 500); // 2 seconds delay
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-[linear-gradient(to_bottom,#D0201C,#FF4040,#FF6666)] text-white">
      {/* Top Bar */}
      <div className="container mx-auto px-4 h-8 flex items-center justify-between text-xs">
        {/* Left Side: Connect + Social Icons */}
        <div className="flex items-center space-x-2">
          <span className="flex items-center gap-1 opacity-80 hover:opacity-100 hover:underline transition-opacity text-[11px]">
            Kết nối
          </span>
          <div className="flex items-center space-x-2">
            <Link href="#" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">
              <Facebook className="h-3.5 w-3.5" />
            </Link>
            <Link href="#" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">
              <Instagram className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Side: Notifications, Support, Language, Profile */}
        <div className="flex items-center space-x-4">
          <Link href="#" className="flex items-center gap-1 opacity-80 hover:opacity-100 hover:underline transition-opacity text-[11px]">
            <Bell className="h-3.5 w-3.5" />
            <span>Thông báo</span>
          </Link>
          <Link href="#" className="flex items-center gap-1 opacity-80 hover:opacity-100 hover:underline transition-opacity text-[11px]">
            <HelpCircle className="h-3.5 w-3.5" />
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
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 py-1 flex items-center gap-1 text-white opacity-80 bg-none hover:bg-none hover:underline transition-opacity text-[11px]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{currentLangName}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
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

      {/* Main Header - Orange Section */}
      <div className="py-4">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* Use next/image for the logo */}
            <Image
              src="/images/logo/Logo-img-White-(PNG).png"
              alt="Shopsifu Logo"
              width={120} // Adjust width as needed
              height={40} // Adjust height as needed based on aspect ratio
              priority // Prioritize loading for LCP
            />
          </Link>

           <SearchInput />

          <CartDropdown />
        </div>
      </div>
    </header>
  );
} 