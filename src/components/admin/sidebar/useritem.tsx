// useritem.tsx
'use client';

import { Users } from 'lucide-react';

export function UserItem() {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-[#0a384f] rounded">
      <Users size={18} />
      <span className="text-white">Users</span>
    </div>
  );
}
