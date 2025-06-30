'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Ticket, Coins } from 'lucide-react';

interface CartFooterProps {
  total: number;
  totalSaved: number;
  isEditing?: boolean;
  selectedCount: number;
}

export default function CartFooter({
  total,
  totalSaved,
  isEditing = false,
  selectedCount,
}: CartFooterProps) {
  return (
    <div className="bg-white border-t text-sm text-muted-foreground">
      {/* Voucher */}
      {!isEditing && (
        <div className="flex items-center justify-between h-10 px-4 border-b">
          <div className="flex items-center gap-1 text-foreground font-medium">
            <Ticket className="w-4 h-4 text-red-500" />
            <span>Platform Voucher</span>
          </div>
          <button className="text-blue-600 hover:underline">Select or enter code</button>
        </div>
      )}

      {/* Coin */}
      {!isEditing && (
        <div className="flex items-center justify-between h-10 px-4 border-b">
          <div className="flex items-center gap-2 opacity-50">
            <input type="checkbox" disabled className="w-3.5 h-3.5" />
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>No item selected</span>
          </div>
          <span className="opacity-50">-₫0</span>
        </div>
      )}

      {/* Bottom Row */}
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-2 text-foreground">
          <Checkbox id="select-all" className="scale-90" />
          <label htmlFor="select-all">Select All ({selectedCount})</label>
          <span className="mx-2">|</span>
          <button className="hover:underline">Delete</button>
          <button className="hover:underline">Remove inactive products</button>
          <button className="text-red-500 hover:underline">Move to My Likes</button>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right text-sm">
            <span className="mr-1">Total ({selectedCount} item):</span>
            <span className="text-red-500 font-medium">₫{total.toLocaleString('vi-VN')}</span>
          </div>
          <Button className="bg-red-500 text-white px-5 py-1.5 text-sm h-8 rounded-sm">
            Check Out
          </Button>
        </div>
      </div>
    </div>
  );
}
