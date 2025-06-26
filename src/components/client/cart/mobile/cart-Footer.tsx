'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface CartFooterProps {
  total: number;
  isEditing?: boolean;
}

export default function CartFooter({
  total,
  isEditing = false,
}: CartFooterProps) {
  return (
    <div className="bg-white border-t overflow-hidden">
      {/* Shopee Voucher */}
      <section
        className={`
          transition-all duration-300 ease-in-out px-4
          ${isEditing ? 'max-h-0 opacity-0 translate-y-2' : 'max-h-[50px] opacity-100 translate-y-0 py-2'}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-primary">🎟️ Shopee Voucher</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-1">Nhập mã</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Coin toggle */}
      <section
        className={`
          transition-all duration-300 ease-in-out px-4 border-t
          ${isEditing ? 'max-h-0 opacity-0 translate-y-2' : 'max-h-[50px] opacity-100 translate-y-0 py-2'}
        `}
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 font-medium">S</span>
            <span>Không có sản phẩm được chọn</span>
          </div>
          <div className="w-10 h-6 rounded-full bg-gray-200 relative">
            <div className="w-5 h-5 bg-white rounded-full shadow absolute left-0.5 top-0.5" />
          </div>
        </div>
      </section>

      {/* Select all & total (normal) */}
      <section
        className={`
          transition-all duration-300 ease-in-out px-4 border-t
          ${isEditing ? 'max-h-0 opacity-0 translate-y-2 overflow-hidden' : 'max-h-[60px] opacity-100 translate-y-0 py-2'}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Checkbox id="select-all" />
            <label htmlFor="select-all">Chọn tất cả</label>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              Tổng: <span className="text-primary font-semibold">₫{total}</span>
            </span>
            <Button className="bg-primary text-white px-4 py-1.5 text-sm rounded">
              Thanh toán
            </Button>
          </div>
        </div>
      </section>

      {/* Edit mode */}
      <section
        className={`
          transition-all duration-300 ease-in-out px-4 border-t
          ${isEditing ? 'max-h-[60px] opacity-100 translate-y-0 py-2' : 'max-h-0 opacity-0 translate-y-2 overflow-hidden'}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Checkbox id="select-all-edit" />
            <label htmlFor="select-all-edit">Select All</label>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-sm px-3 py-1 rounded border-gray-300 h-auto"
            >
              Move to My Likes
            </Button>
            <Button
              variant="outline"
              className="text-red-500 border-red-500 text-sm px-3 py-1 rounded h-auto"
            >
              Delete
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
