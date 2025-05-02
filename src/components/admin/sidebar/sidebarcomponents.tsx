'use client';

import Link from 'next/link';

type SubItemProps = {
  href: string;
  label: string;
};

export function SubItem({ href, label }: SubItemProps) {
  return (
    <Link href={href} className="block text-sm pl-2 py-1 hover:underline text-[#F0F4F8]">
      {label}
    </Link>
  );
}
