'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Home,
  ShoppingCart,
  Users,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
  href?: string;
};

function SidebarItem({ icon, label, children, href }: SidebarItemProps) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!children;

  const toggle = () => {
    if (hasChildren) setOpen(!open);
  };

  return (
    <div>
      <div
        onClick={toggle}
        className={cn(
          'flex items-center justify-between rounded px-2 py-1.5 hover:bg-[#D0201C]/20 hover:text-[#D0201C] transition cursor-pointer',
          hasChildren && 'select-none'
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          {href ? (
            <Link href={href}>
              <span className="hover:underline">{label}</span>
            </Link>
          ) : (
            <span>{label}</span>
          )}
        </div>
        {hasChildren && (open ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </div>

      {hasChildren && open && (
        <div className="ml-6 mt-1 flex flex-col space-y-1">{children}</div>
      )}
    </div>
  );
}

function SubItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-[#F0F4F8]/70 hover:text-[#D0201C] text-sm transition"
    >
      {label}
    </Link>
  );
}

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
    <>
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
          <SidebarItem href="/admin/dashboard" icon={<Home size={18} />} label="Dashboard" />

          <SidebarItem icon={<ShoppingCart size={18} />} label="Products">
            <SubItem href="/admin/product" label="Products" />
            <SubItem href="/admin/products/add" label="Add Product" />
            <SubItem href="/admin/products/categories" label="Product Categories" />
          </SidebarItem>

          <SidebarItem href="/admin/users" icon={<Users size={18} />} label="Users" />
        </nav>
      </aside>
    </>
  );
}
