'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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
  const showHeader = useScrollHeader(100);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsAtTop(currentScrollY <= 50);
          
          // Cập nhật scale và opacity dựa trên scroll
          const header = document.querySelector('.header-container') as HTMLElement;
          if (header) {
            const scale = Math.max(0.95, 1 - (currentScrollY / 1000));
            const opacity = Math.max(0.8, 1 - (currentScrollY / 500));
            header.style.transform = `scale(${scale})`;
            header.style.opacity = opacity.toString();
          }
          
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* TopBar */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[61] hidden md:block 
          will-change-[transform,opacity] transform-gpu`}
        style={{
          transform: `translate3d(0, ${isAtTop ? '0' : '-100%'}, 0)`,
          opacity: isAtTop ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)',
        }}
      >
        <TopBar />
      </div>

      {/* Main Header */}
      <header 
        className={`text-white h-[75px] bg-gradient-to-r from-red-700 via-red-600 to-red-700
          fixed left-0 right-0 z-[60] hidden md:block transform-gpu will-change-[transform,opacity,top]`}
        style={{ 
          transform: `translate3d(0, ${showHeader ? '0' : '-100%'}, 0)`,
          opacity: showHeader ? 1 : 0,
          top: isAtTop ? '40px' : '0',
          transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)',
        }}
      >
        <div className="max-w-[1350px] mx-auto h-full header-container duration-200">
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
                <div className="header-item">
                  <Categories />
                </div>
                <div className="header-item flex-1">
                  <SearchInput />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="header-item">
                <ProfileDropdown />
              </div>
              <div className="header-item">
                <ChangeLangs />
              </div>
              <div className="header-item">
                <CartDropdown />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div 
        className="hidden md:block"
        style={{ 
          height: isAtTop ? '115px' : '75px',
          transition: 'height 0.3s ease',
        }}
      />

      {/* Desktop Commit */}
      <div 
        className={`fixed left-0 right-0 z-[55] hidden md:block transform-gpu will-change-[transform,opacity,top]`}
        style={{ 
          transform: `translate3d(0, ${isAtTop ? '0' : '100%'}, 0)`,
          opacity: isAtTop ? 1 : 0,
          top: isAtTop ? '115px' : '75px',
          transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)',
        }}
      >
        <DesktopCommit />
      </div>

      {/* Body Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[52]
          transform-gpu will-change-opacity`}
        style={{
          opacity: showOverlay ? 1 : 0,
          visibility: showOverlay ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
        }}
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
