'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { SearchInput } from './search-Input';
import { CartDropdown } from './cart-Dropdown';
import Image from 'next/image';
import { TopBar } from './header-TopBar';
import './style.css';

export function Header() {
  return (
    <>
      <TopBar />
      <header
        className="text-white max-h-[125px] h-[110px]"
        style={{
          background: '#D70018',
        }}
      >
        <div className="max-w-[1100px] mx-auto h-full">
          <div className="px-4 h-full flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="header-logo">
                <Image
                  src="/images/logo/png-jpeg/Logo-Full-White.png"
                  alt="Shopsifu Logo"
                  width={140}
                  height={40}
                  priority
                  className="object-contain"
                />
              </div>
            </Link>

            <div className="flex-1 max-w-[1000px] flex flex-col">
              <div className="flex items-center">
                <SearchInput />
              </div>
            </div>

            <CartDropdown />
          </div>
        </div>
      </header>
    </>
  );
} 