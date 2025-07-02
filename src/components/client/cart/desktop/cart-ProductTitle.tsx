"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface DesktopCartHeaderProps {
  allSelected: boolean;
  onToggleAll: () => void;
}

export default function DesktopCartHeader({
  allSelected,
  onToggleAll,
}: DesktopCartHeaderProps) {
  return (
    <div className="mt-8">
      <div className="bg-white text-sm text-muted-foreground border rounded-sm">
        <div className="flex items-center px-3 py-4">
          <div className="flex items-center gap-2 w-[45%]">
            <Checkbox
              className="scale-90 ml-[30px]"
              checked={allSelected}
              onCheckedChange={onToggleAll}
            />
            <span className="font-medium text-black">Product</span>
          </div>
          <div className="w-[15%] text-center">Unit Price</div>
          <div className="w-[15%] text-center">Quantity</div>
          <div className="w-[15%] text-center">Total Price</div>
          <div className="w-[10%] text-center">Actions</div>
        </div>
      </div>
    </div>
  );
}
