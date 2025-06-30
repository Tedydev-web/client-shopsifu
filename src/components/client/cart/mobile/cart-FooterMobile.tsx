'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronRight, Ticket, Coins, Trash2, Heart } from 'lucide-react';

interface CartFooterMobileProps {
  total: number;
  totalSaved: number;
  isEditing?: boolean;
  selectedCount: number;
}

export default function CartFooterMobile({
  total,
  totalSaved,
  isEditing = false,
  selectedCount,
}: CartFooterMobileProps) {
  return (
    <div className="bg-white border-t overflow-hidden shadow-md">
      <TransitionSection show={!isEditing}>
        <VoucherSection />
      </TransitionSection>

      {/* Divider giữa các section */}
      {!isEditing && <Divider />}

      <TransitionSection show={!isEditing}>
        <CoinSection hasSelection={selectedCount > 0} />
      </TransitionSection>

      {/* Divider giữa các section */}
      {!isEditing && <Divider />}

      <TransitionSection show={!isEditing}>
        <TotalSection total={total} saved={totalSaved} />
      </TransitionSection>

      <TransitionSection show={isEditing}>
        <EditSection />
      </TransitionSection>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-200" />;
}

// ===================== Smooth Toggle =====================
function TransitionSection({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`transition-all duration-300 ease-in-out transform
        ${show ? 'opacity-100 scale-100 translate-y-0 h-auto py-2' : 'opacity-0 scale-95 -translate-y-2 h-0 overflow-hidden'}
        px-4
      `}
    >
      {children}
    </div>
  );
}

// ===================== Sections =====================
function VoucherSection() {
  return (
    <div className="flex items-center justify-between text-xs h-10">
      <span className="font-medium text-primary flex items-center gap-1">
        <Ticket className="w-4 h-4 text-primary" />
        Shopee Voucher
      </span>
      <div className="flex items-center text-muted-foreground">
        <span className="mr-1">Nhập mã</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}

function CoinSection({ hasSelection }: { hasSelection: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs h-10">
      <div className="flex items-center gap-2">
        <Coins className="w-4 h-4 text-yellow-500" />
        <span>{hasSelection ? 'Insufficient Coin Balance' : 'Không có sản phẩm được chọn'}</span>
      </div>
      <div className="w-10 h-6 rounded-full bg-gray-200 relative">
        <div className="w-5 h-5 bg-white rounded-full shadow absolute left-0.5 top-0.5" />
      </div>
    </div>
  );
}

function TotalSection({ total, saved }: { total: number; saved: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <Checkbox id="select-all" />
        <label htmlFor="select-all">Chọn tất cả</label>
      </div>
      <div className="text-right">
        <div>
          Tổng:{' '}
          <span className="text-primary font-semibold">
            ₫{total.toLocaleString('vi-VN')}
          </span>
        </div>
        {saved > 0 && (
          <div className="text-xs text-red-500">
            Saved ₫{saved.toLocaleString('vi-VN')}
          </div>
        )}
      </div>
      <Button className="bg-primary text-white px-4 py-1.5 text-xs rounded h-8 ml-2">
        Thanh toán
      </Button>
    </div>
  );
}

function EditSection() {
  return (
    <div className="flex items-center justify-between text-xs h-10">
      <div className="flex items-center gap-2">
        <Checkbox id="select-all-edit" />
        <label htmlFor="select-all-edit">Select All</label>
      </div>
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
    </div>
  );
}
