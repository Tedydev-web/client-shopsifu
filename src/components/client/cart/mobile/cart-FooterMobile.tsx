"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Ticket, Coins, Trash2, Heart, ChevronRight } from 'lucide-react';

interface CartFooterMobileProps {
  total: number;
  totalSaved: number;
  isEditing?: boolean;
  selectedCount: number;
  allSelected: boolean;
  onToggleAll: () => void;
}

export default function CartFooterMobile({
  total,
  totalSaved,
  isEditing = false,
  selectedCount,
  allSelected,
  onToggleAll,
}: CartFooterMobileProps) {
  return (
    <div className="bg-white border-t overflow-hidden shadow-md">
      {!isEditing && (
        <>
          <div className="flex items-center justify-between text-xs h-8 px-4">
            <span className="font-medium text-primary flex items-center gap-1">
              <Ticket className="w-4 h-4 text-primary" />
              Shopee Voucher
            </span>
            <div className="flex items-center text-muted-foreground">
              <span className="mr-1">Nhập mã</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div className="border-t border-gray-200" />

          <div className="flex items-center justify-between text-xs h-8 px-4">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span>
                {selectedCount > 0 ? 'Insufficient Coin Balance' : 'Không có sản phẩm được chọn'}
              </span>
            </div>
            <div className="w-10 h-6 rounded-full bg-gray-200 relative">
              <div className="w-5 h-5 bg-white rounded-full shadow absolute left-0.5 top-0.5" />
            </div>
          </div>
          <div className="border-t border-gray-200" />
        </>
      )}

      {/* Bottom Row */}
      <div className="flex items-center justify-between px-4 h-12 text-xs">
        <div className="flex items-center gap-2 text-foreground">
          <Checkbox
            id="select-all"
            className="scale-90 w-4 h-4"
            checked={allSelected}
            onCheckedChange={onToggleAll}
          />
          <label htmlFor="select-all">Chọn tất cả</label>
        </div>

        {!isEditing ? (
          <div className="flex items-center gap-2">
            <div className="text-right text-xs">
              <div>
                Tổng:{' '}
                <span className="text-primary font-semibold">
                  ₫{total.toLocaleString('vi-VN')}
                </span>
              </div>
              {totalSaved > 0 && (
                <div className="text-xs text-red-500">
                  Tiết kiệm ₫{totalSaved.toLocaleString('vi-VN')}
                </div>
              )}
            </div>
            <Button className="bg-primary text-white px-4 py-1.5 text-xs rounded h-8">
              Thanh toán
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              className="text-xs px-3 py-1.5 rounded border-gray-300 h-8 flex gap-1 items-center"
            >
              <Heart className="w-4 h-4" />
              Move to My Likes
            </Button>
            <Button
              variant="outline"
              className="text-red-500 border-red-500 text-xs px-3 py-1.5 rounded h-8 flex gap-1 items-center"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
