'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { CartDropdown } from './header-Cart';
import { ProfileDropdown } from './header-Profile';
import { motion, AnimatePresence } from 'framer-motion';
import { DropdownProvider } from './dropdown-context';
import { cn } from '@/lib/utils';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import './style.css';

export function MobileHeader() {
  const showHeader = useScrollHeader();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchTerm('');
    }
  };

  return (
    <DropdownProvider>
      <header
        className={`text-white h-[60px] text-[13px] relative z-50 bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg transition-transform duration-500 ease-in-out ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        } md:hidden`}
      >
        <div className="h-full">
          <div className="px-3 h-full flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="rounded-xl overflow-hidden">
                <Image
                  src="/images/logo/png-jpeg/Logo-Full-White.png"
                  alt="Shopsifu Logo"
                  width={100}
                  height={35}
                  priority
                  className="object-contain rounded-xl"
                />
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {/* Search Icon & Input */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSearch}
                  className="flex items-center justify-center p-2"
                >
                  <Search className="h-5 w-5 text-white" />
                </motion.button>

                <AnimatePresence>
                  {isSearchActive && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "calc(100vw - 120px)" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-0 top-0 z-50 flex items-center"
                    >
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 px-3 text-black text-sm rounded-l-md focus:outline-none"
                        placeholder="Tìm sản phẩm..."
                        autoFocus
                      />
                      <Link
                        href={searchTerm ? `/search?q=${encodeURIComponent(searchTerm)}` : '#'}
                        onClick={(e) => !searchTerm && e.preventDefault()}
                      >
                        <button className="bg-red-500 hover:bg-red-600 h-full py-2 px-3 rounded-r-md">
                          <Search className="h-4 w-4 text-white" />
                        </button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <div className="relative">
                <CartDropdown />
              </div>

              {/* User Profile */}
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
