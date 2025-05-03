'use client';

import { X, Home, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProductSubItems } from './productitem';
import Image from 'next/image'; // Thêm nếu dùng ảnh logo

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed z-50 inset-y-0 left-0 w-50 bg-[#D0201C] border-r border-gray-200 p-4 transition-transform transform md:translate-x-0 md:static md:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between mb-6">
        {/* Nếu dùng ảnh logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo/Shopifu.png"
            alt=""
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Nút đóng trên mobile */}
        <button onClick={() => setIsOpen(false)} className="md:hidden">
          <X className="text-[#000000]" />
        </button>
      </div>

      <nav className="space-y-2 text-[#000000]">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 p-2 rounded hover:bg-[#D0201C]/90 hover:text-[#F0F4F8]"
        >
          <Home size={30} />
          Dashboard
        </Link>

        <div>
          <div className="flex items-center gap-2 p-2 rounded hover:bg-[#D0201C]/90 hover:text-[#F0F4F8]">
            <ShoppingCart size={30} />
            Products
          </div>
          <ProductSubItems />
        </div>

        <Link
          href="/admin/users"
          className="flex items-center gap-2 p-2 rounded hover:bg-[#D0201C]/90 hover:text-[#F0F4F8]"
        >
          <Users size={30} />
          Users
        </Link>
      </nav>
    </aside>
  );
}
