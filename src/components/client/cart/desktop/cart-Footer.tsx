"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface CartFooterProps {
  total: number;
  isEditing?: boolean;
}

export default function CartFooter({
  total,
  isEditing = false,
}: CartFooterProps) {
  if (isEditing) {
    // Chế độ chỉnh sửa (Edit Mode)
    return (
      <div className="border-t bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Checkbox id="select-all-edit" />
            <label htmlFor="select-all-edit">Select All</label>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-sm px-4 py-1.5 rounded border-gray-300"
            >
              Move to My Likes
            </Button>
            <Button
              variant="outline"
              className="text-red-500 border-red-500 text-sm px-4 py-1.5 rounded"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Chế độ mặc định
  return (
    <div className="border-t bg-white p-4 space-y-3">
      {/* Shopee Voucher */}
      <div
        className={`flex items-center justify-between transition-all duration-500 ease-in-out overflow-hidden ${
          isEditing
            ? "max-h-0 opacity-0 pointer-events-none"
            : "max-h-20 opacity-100"
        }`}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-primary">🎟️ Shopee Voucher</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="mr-1">Nhập mã</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      <hr
        className={`my-2 transition-all duration-500 ease-in-out ${
          isEditing
            ? "max-h-0 opacity-0 pointer-events-none"
            : "max-h-4 opacity-100"
        }`}
      />

      {/* Coin toggle */}
      <div
        className={`flex items-center justify-between text-sm transition-all duration-500 ease-in-out overflow-hidden ${
          isEditing
            ? "max-h-0 opacity-0 pointer-events-none"
            : "max-h-16 opacity-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 font-medium">S</span>
          <span>Không có sản phẩm được chọn</span>
        </div>
        <div>
          <div className="w-10 h-6 rounded-full bg-gray-200 relative">
            <div className="w-5 h-5 bg-white rounded-full shadow absolute left-0.5 top-0.5"></div>
          </div>
        </div>
      </div>

      <hr
        className={`my-2 transition-all duration-500 ease-in-out ${
          isEditing
            ? "max-h-0 opacity-0 pointer-events-none"
            : "max-h-4 opacity-100"
        }`}
      />

      {/* Select all & Total */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-sm">
          <Checkbox id="select-all" />
          <label htmlFor="select-all">Chọn tất cả</label>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Tổng: <span className="text-primary font-semibold">₫{total}</span>
          </span>
          <Button className="bg-primary text-white px-4 py-2 text-sm rounded">
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
