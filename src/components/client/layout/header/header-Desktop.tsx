'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { SearchInput } from './search-Input';
import { CartDropdown } from './header-Cart';
import Image from 'next/image';
import { Categories } from './header-Categories';
import { DropdownProvider } from './dropdown-context';
import { ProfileDropdown } from './header-Profile';
import { ChangeLangs } from './header-ChangeLangs';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import './style.css';

export function Header() {
  const showHeader = useScrollHeader();

  return (
    <DropdownProvider>
      <header
        className={`text-white max-h-[125px] h-[75px] text-[13px] relative z-50 bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg transition-transform duration-500 ease-in-out hidden md:block ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-[1400px] mx-auto h-full">
          <div className="px-4 h-full flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="header-logo rounded-xl overflow-hidden">
                <Image
                  src="/images/logo/png-jpeg/Logo-Full-White.png"
                  alt="Shopsifu Logo"
                  width={125}
                  height={40}
                  priority
                  className="object-contain rounded-xl"
                />
              </div>
            </Link>

            <div className="flex-1 max-w-[1000px] flex flex-col">
              <div className="flex items-center gap-4">
                <Categories />
                <SearchInput />
              </div>
            </div>
            <ProfileDropdown />
            <ChangeLangs />
            <CartDropdown />
          </div>
        </div>
      </header>
    </DropdownProvider>
  );
}
