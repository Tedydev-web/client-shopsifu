// SidebarComponents.tsx
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function SidebarItem({
  icon,
  label,
  children,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
  href?: string;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!children;

  return (
    <div>
      <div
        onClick={() => hasChildren && setOpen(!open)}
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

export function SubItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="text-[#F0F4F8]/70 hover:text-[#D0201C] text-sm transition"
    >
      {label}
    </Link>
  );
}
