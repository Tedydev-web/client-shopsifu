// dashboarditem.tsx
'use client';

import { Home } from 'lucide-react';

export function DashboardItem() {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-[#0a384f] rounded">
      <Home size={18} />
      <span className="text-white">Dashboard</span>
    </div>
  );
}
