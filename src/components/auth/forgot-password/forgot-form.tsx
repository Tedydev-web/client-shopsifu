'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Home, ShoppingCart, Users } from 'lucide-react'

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'w-64 shrink-0 border-r bg-white p-6 shadow-sm',
        className
      )}
    >
      <div className="mb-8 text-2xl font-bold">Admin Panel</div>
      <nav className="flex flex-col space-y-4 text-sm font-medium">
        <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-primary">
          <Home size={18} />
          Dashboard
        </Link>
        <Link href="/admin/products" className="flex items-center gap-2 hover:text-primary">
          <ShoppingCart size={18} />
          Products
        </Link>
        <Link href="/admin/users" className="flex items-center gap-2 hover:text-primary">
          <Users size={18} />
          Users
        </Link>
      </nav>
    </aside>
  )
}
