// src/components/client/layout/header/mobile/mobile-Index.tsx
'use client';

import Image from 'next/image';
import { CgMenuLeft } from "react-icons/cg";

import { CartDropdown } from '../desktop/desktop-Cart';
import { ProfileDropdown } from './mobile-Profile';
import { DropdownProvider } from '../dropdown-context';
import { MobileSearchInput } from './moblie-SearchInput';
import '../style.css';
import { MobileCategories } from './moblie-Categories';

export function MobileHeader() {
  return (
    <DropdownProvider>
      <header
        className={`top-0 left-0 right-0 text-white h-auto text-[13px] 
          bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg 
          md:hidden z-[999] w-full p-2`}
      >
        <div className="flex flex-col gap-2">
          {/* Row 1: Menu, Logo, Cart, Profile */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <MobileCategories>
                <CgMenuLeft size={28} strokeWidth={0.1} className="cursor-pointer" />
              </MobileCategories>
              <div className="relative h-8 w-28">
                <Image
                  src="/images/logo/png-jpeg/Logo-Full-White.png"
                  alt="Shopsifu Logo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative">
              <ProfileDropdown />
              </div>
              <div className="relative">
                <CartDropdown />
              </div>
            </div>
          </div>

          {/* Row 2: Search Input */}
          <div className="w-full">
            <MobileSearchInput />
          </div>
        </div>
      </header>
    </DropdownProvider>
  );
}