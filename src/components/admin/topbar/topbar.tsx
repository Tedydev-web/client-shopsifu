'use client';

import { Menu, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="h-16 flex items-center justify-between bg-[#063547] text-[#F0F4F8] border-b border-[#0B2E3D] px-4 shadow-sm relative">
      <button className="md:hidden" onClick={onMenuClick}>
        <Menu size={24} />
      </button>

      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="relative">
        <button onClick={() => setShowDropdown(prev => !prev)} className="focus:outline-none">
          <Image
            src="/avatar.png"
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-full border border-white hover:ring-2 hover:ring-[#D0201C] transition"
          />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50">
            <div className="px-4 py-2 text-sm font-semibold">Admin</div>
            <hr />
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