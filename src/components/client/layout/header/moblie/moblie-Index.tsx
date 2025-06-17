// src/components/client/layout/header/mobile/mobile-Index.tsx
'use client';

import { CartDropdown } from '../desktop/desktop-Cart';
import { ProfileDropdown } from '../moblie/mobile-Profile';
import { DropdownProvider } from '../dropdown-context';
import { MobileSearchInput } from './moblie-SearchInput';
import '../style.css';

export function MobileHeader() {
  return (
    <DropdownProvider>
      {/* Header Container */}
      <header
        className={`fixed top-0 left-0 right-0 text-white h-[60px] text-[13px] 
          bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg 
          md:hidden z-[999] w-full`}
        style={{ position: 'fixed' }}
      >
        <div className="h-full">
          {/* Header Content */}
          <div className="px-4 h-full flex items-center justify-between gap-3">
            {/* Search Component with flex-1 to take available space */}
            <MobileSearchInput />

            {/* Right Section - Cart and Profile */}
            <div className="flex items-center gap-2">
              {/* Cart Dropdown */}
              <div className="relative">
                <CartDropdown />
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </div>
      </header>
    </DropdownProvider>
  );
}