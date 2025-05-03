'use client';

import { X, Home, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProductSubItems } from './productitem';
import Image from 'next/image';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed z-50 inset-y-0 left-0 w-55 bg-[#D0201C] p-4 transition-transform transform md:translate-x-0 md:static md:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo + Close button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo/Shopifu.png"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        <button onClick={() => setIsOpen(false)} className="md:hidden">
          <X className="text-white" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 text-white">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-[#D0201C] transition"
        >
          <Home size={24} />
          <span>Dashboard</span>
        </Link>

        <div>
          <div className="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-[#D0201C] transition">
            <ShoppingCart size={24} />
            <span>Products</span>
          </div>
          <ProductSubItems />
        </div>

        <Link
          href="/admin/users"
          className="flex items-center gap-3 p-2 rounded hover:bg-white hover:text-[#D0201C] transition"
        >
          <Users size={24} />
          <span>Users</span>
        </Link>
      </nav>
    </aside>
  );
}
