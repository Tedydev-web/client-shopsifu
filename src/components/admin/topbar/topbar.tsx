'use client';

import { Menu } from 'lucide-react';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <div className="h-16 flex items-center justify-between bg-white border-b px-4 shadow-sm">
      {/* Hamburger button on mobile */}
      <button className="md:hidden" onClick={onMenuClick}>
        <Menu size={24} />
      </button>

      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        {/* Các nút khác nếu cần */}
      </div>
    </div>
  );
}
