"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Ticket, Coins } from "lucide-react";
import { useTranslations } from "next-intl";


interface CartFooterProps {
  total: number;
  totalSaved: number;
  isEditing?: boolean;
  selectedCount: number;
  allSelected: boolean;
  onToggleAll: () => void;
}

export default function CartFooter({
  total,
  totalSaved,
  isEditing = false,
  selectedCount,
  allSelected,
  onToggleAll,
}: CartFooterProps) {
  const t = useTranslations();

  return (
    <div className="w-full sticky bottom-0 bg-white border-t text-base text-muted-foreground">
      {/* Voucher */}
      {!isEditing && (
        <div className="flex items-center justify-between h-12 px-6 border-b">
          <div className="flex items-center gap-4 text-black">
            <Ticket className="w-5 h-5 text-red-500" />
            <span>Shopsifu Voucher</span>
          </div>
          <button className="text-blue-600 hover:underline">
            Chọn hoặc nhập mã
          </button>
        </div>
      )}

      {/* Coin */}
      {!isEditing && (
        <div className="flex items-center justify-between h-12 px-6 border-b">
          <div className="flex items-center gap-2 opacity-50">
            <input type="checkbox" disabled className="w-4 h-4" title="Sử dụng xu" aria-label="Sử dụng xu" />
            <Coins className="w-5 h-5 text-yellow-400" />
            <span>Chưa có sản phẩm được chọn</span>
          </div>
          <span className="opacity-50">-₫0</span>
        </div>
      )}

      {/* Bottom Row */}
      <div className="flex items-center justify-between px-6 h-14 bg-white">
        <div className="flex items-center gap-3 text-foreground">
          <Checkbox
            id="select-all"
            className="scale-100"
            checked={allSelected}
            onCheckedChange={onToggleAll}
          />
          <label htmlFor="select-all" className="text-base">
            Chọn tất cả ({selectedCount})
          </label>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-base">
            <span className="mr-1 text-black">
              Tổng thanh toán ({selectedCount} sản phẩm):
            </span>
            <span className="text-red-500 font-medium text-lg">
              ₫{total.toLocaleString("vi-VN")}
            </span>
            {totalSaved > 0 && (
              <div className="text-sm text-muted-foreground">
                Tiết kiệm ₫{totalSaved.toLocaleString("vi-VN")}
              </div>
            )}
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-base h-10 rounded-sm">
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
