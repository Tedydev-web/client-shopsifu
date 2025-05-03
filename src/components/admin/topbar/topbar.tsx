'use client';

import { Menu, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-16 flex items-center justify-between bg-[#D0201C] text-white border-b border-gray-200 px-4 shadow-sm relative">
      <button className="md:hidden" onClick={onMenuClick}>
        <Menu size={24} />
      </button>

      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="focus:outline-none"
        >
          <Image
            src="/images/logo/Logo-img-White.jpeg"
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-full border border-white hover:ring-2 hover:ring-white transition"
          />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-[#1A1A1A] rounded shadow-md z-50">
            <div className="px-4 py-2 text-sm font-semibold border-b">Admin</div>
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
