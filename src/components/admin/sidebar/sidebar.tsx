'use client';

import { X, Home, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProductSubItems } from './productitem';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed z-50 inset-y-0 left-0 w-64 bg-[#042940] p-4 transition-transform transform md:translate-x-0 md:static md:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h2 className="text-lg font-semibold text-white">Menu</h2>
        <button onClick={() => setIsOpen(false)}>
          <X className="text-white" />
        </button>
      </div>

      <nav className="space-y-2 text-[#F0F4F8]">
        <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-[#064663] rounded">
          <Home size={18} />
          Dashboard
        </Link>

        <div>
          <div className="flex items-center gap-2 p-2 hover:bg-[#064663] rounded">
            <ShoppingCart size={18} />
            Products
          </div>
          <ProductSubItems />
        </div>

        <Link href="/admin/users" className="flex items-center gap-2 p-2 hover:bg-[#064663] rounded">
          <Users size={18} />
          Users
        </Link>
      </nav>
    </aside>
  );
}
