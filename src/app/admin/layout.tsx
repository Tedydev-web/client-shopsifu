'use client';

import { Sidebar } from '@/components/admin/sidebar/sidebar';
import { Topbar } from '@/components/admin/topbar/topbar';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white text-[#1A1A1A]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1">
        <Topbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
