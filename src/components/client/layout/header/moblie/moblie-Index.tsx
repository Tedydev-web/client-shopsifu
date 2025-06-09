// src/components/client/layout/header/mobile/mobile-Index.tsx
'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { CartDropdown } from '../desktop/desktop-Cart';
import { ProfileDropdown } from '../desktop/desktop-Profile';
import { motion, AnimatePresence } from 'framer-motion';
import { DropdownProvider } from '../dropdown-context';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { MobileSearchInput } from './moblie-SearchInput';
import '../style.css';

export function MobileHeader() {
  const showHeader = useScrollHeader();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <DropdownProvider>
      {/* Header Container */}
      <header
        className={`fixed top-0 left-0 right-0 text-white h-[60px] text-[13px] 
          bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg 
          transition-transform duration-500 ease-in-out
          ${showHeader ? 'translate-y-0' : '-translate-y-full'} 
          md:hidden z-50`}
      >
        <div className="h-full">
          {/* Header Content */}
          <div className="px-3 h-full flex items-center justify-between">
            {/* Left Section - Menu & Logo */}
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-red-800 rounded-full transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6 text-white" />
              </motion.button>

              <Link href="/" className="flex items-center">
                <div className="rounded-xl overflow-hidden">
                  <Image
                    src="/images/logo/png-jpeg/Logo-Full-White.png"
                    alt="ShopSifu Logo"
                    width={80}
                    height={30}
                    priority
                    className="object-contain rounded-xl"
                  />
                </div>
              </Link>
            </div>

            {/* Right Section - Search, Cart, Profile */}
            <div className="flex items-center gap-3">
              {/* Search Component */}
              <MobileSearchInput />
              
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

        {/* Mobile Navigation Menu with Animation */}
        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <>
              {/* Dark Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={handleCloseMenu}
              />
              
              {/* Navigation Menu */}
              {/* <MobileNavigation onClose={handleCloseMenu} /> */}
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[60px] md:hidden" />
    </DropdownProvider>
  );
}