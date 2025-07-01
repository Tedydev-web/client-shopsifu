"use client"

import { Checkbox } from "@/components/ui/checkbox"

export default function DesktopCartHeader() {
  return (
    <div className="mt-8">
      <div className="bg-white text-sm text-muted-foreground">
        <div className="flex items-center px-3 py-4">
          {/* Product (có checkbox) */}
          <div className="flex items-center gap-2 w-[45%]">
            <Checkbox className="scale-90 ml-[30px]" />
            <span className="font-medium text-black">Product</span>
          </div>

          {/* Unit Price */}
          <div className="w-[15%] text-center">Unit Price</div>

          {/* Quantity */}
          <div className="w-[15%] text-center">Quantity</div>

          {/* Total Price */}
          <div className="w-[15%] text-center">Total Price</div>

          {/* Actions */}
          <div className="w-[10%] text-center">Actions</div>
        </div>
      </div>
    </div>
  )
}