'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SearchInput } from './cart-SearchInput';
import { DropdownProvider } from '../dropdown-context';

export function CartHeader() {
  return (
    <DropdownProvider>
      <header
        className=" text-white h-[60px] text-[13px] relative z-50 
        bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-md
        hidden md:block"
      >
        <div className="max-w-[1250px] mx-auto h-full flex items-center justify-between px-4 sm:px-6 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/images/logo/png-jpeg/Logo-Full-White.png"
                alt="Shopsifu Logo"
                width={120}
                height={36}
                priority
                className="object-contain rounded-xl"
              />
            </div>
          </Link>

          {/* Search Input */}
          <div className="flex-1 max-w-[600px]">
            <SearchInput />
          </div>
        </div>
      </header>
    </DropdownProvider>
  );
}
