'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
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
  const showTopElements = useScrollHeader();

  // Determine if the overlay should be shown. Exclude 'cart' and 'none'.
  const showOverlay = openDropdown !== 'none' && openDropdown !== 'cart';

  // Handle scroll locking when overlay is active
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

  return (
    <>
 {/* Container for TopBar with transition */}
      <div className={`transition-all duration-300 ease-in-out ${showTopElements ? 'h-[40px]' : 'h-0'} overflow-hidden hidden md:block`}>
        <TopBar />
      </div>


      {/* Main Header - Always Fixed */}
      <header className="text-white h-[75px] bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg
        fixed top-0 left-0 right-0 z-[60] hidden md:block">
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
     
      {/* Desktop Commit with transition */}
      <div className={`transition-all duration-300 ease-in-out ${showTopElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <DesktopCommit />
      </div>

      {/* Body Overlay controlled by dropdown context */}
      <div className={`body-overlay ${showOverlay ? 'overlay-active' : ''}`} />
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
