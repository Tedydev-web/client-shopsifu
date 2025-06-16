'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SearchInput } from './desktop-SearchInput';
import { CartDropdown } from './desktop-Cart';
import { Categories } from './desktop-Categories';
import { DropdownProvider, useDropdown } from '../dropdown-context';
import { ProfileDropdown } from './desktop-Profile';
import { ChangeLangs } from './desktop-ChangeLangs';
import DesktopCommit from "./desktop-Commit";
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { TopBar } from './header-TopBar';
import '../style.css';

function HeaderLayout() {
  const { openDropdown } = useDropdown();
  const showHeader = useScrollHeader();
  const [showTopAndCommit, setShowTopAndCommit] = useState(true);

  // Determine if the overlay should be shown. Include only search and categories
  const showOverlay = openDropdown === 'search' || openDropdown === 'categories';

  useEffect(() => {
    if (showOverlay) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }

    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [showOverlay]);

  // Effect to handle TopBar and Commit visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowTopAndCommit(false);
      } else {
        setShowTopAndCommit(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* TopBar */}
      <div className={`fixed top-0 left-0 right-0 z-[61] hidden md:block transition-transform duration-300 ease-in-out 
        ${showTopAndCommit ? 'translate-y-0' : '-translate-y-full'}`}>
        <TopBar />
      </div>

      {/* Main Header */}
      <header className={`text-white h-[75px] bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg
        fixed left-0 right-0 z-[60] hidden md:block transition-all duration-300 ease-in-out
        ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        style={{ top: showTopAndCommit ? '40px' : '0' }}
      >
        <div className="max-w-[1350px] mx-auto h-full header-container">
          <div className="px-4 h-full flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 header-logo">
              <div className="rounded-xl overflow-hidden">
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
                <div className="header-item transition-all duration-300 ease-in-out">
                  <Categories />
                </div>
                <div className="header-item flex-1 transition-all duration-300 ease-in-out">
                  <SearchInput />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="header-item transition-all duration-300 ease-in-out">
                <ProfileDropdown />
              </div>
              <div className="header-item transition-all duration-300 ease-in-out">
                <ChangeLangs />
              </div>
              <div className="header-item transition-all duration-300 ease-in-out">
                <CartDropdown />
              </div>
            </div>
          </div>
        </div>
      </header>
     
      {/* Spacer - adjusts based on visibility */}
      <div className={`transition-all duration-300 ease-in-out hidden md:block`}
        style={{ height: showTopAndCommit ? '115px' : showHeader ? '75px' : '0' }}
      />

      {/* Desktop Commit */}
      <div className={`transition-transform duration-300 ease-in-out fixed left-0 right-0 z-[55] hidden md:block
        ${showTopAndCommit ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        style={{ top: showTopAndCommit ? '115px' : '75px' }}
      >
        <DesktopCommit />
      </div>

      {/* Body Overlay */}
      <div className={`fixed inset-0 bg-black/20 transition-opacity duration-300 z-[52]
        ${showOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
      />
    </>
  );
}

export function Header() {
  return (
    <DropdownProvider>
      <HeaderLayout />
    </DropdownProvider>
  );
}
