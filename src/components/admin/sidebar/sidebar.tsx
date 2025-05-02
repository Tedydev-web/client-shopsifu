// sidebar.tsx
'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { X } from 'lucide-react';
import { DashboardItem, ProductItem, UserItem } from './sidebaritem';

export function Sidebar({
  className,
  isOpen,
  setIsOpen,
}: {
  className?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <aside
      className={cn(
        'fixed md:static top-0 left-0 z-50 h-full w-64 shrink-0 border-r bg-[#042940] text-[#F0F4F8] p-6 shadow-sm transition-transform transform',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:relative',
        className
      )}
    >
      <div className="flex items-center justify-between mb-6 md:hidden">
        <div className="text-2xl font-bold">Admin Panel</div>
        <button onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
        <span className="text-xl font-bold text-white">Admin Panel</span>
      </div>

      <nav className="flex flex-col space-y-2 text-sm font-medium">
        <DashboardItem />
        <ProductItem />
        <UserItem />
      </nav>
    </aside>
  );
}
