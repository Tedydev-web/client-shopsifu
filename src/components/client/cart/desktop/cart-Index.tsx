'use client'

import { mockCartItems } from "@/components/client/cart/desktop/cart-MockData"
import CartItem from "@/components/client/cart/desktop/cart-Items"
import { Checkbox } from "@/components/ui/checkbox"

export default function CartPageMobile() {
  const total = 0

  return (
    <div className="space-y-6">
      {mockCartItems.map((group, index) => (
        <div key={group.shop + '-' + index} className="border rounded-md bg-white">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="flex items-center gap-2">
              <Checkbox />
              <span className="font-medium text-sm">{group.shop}</span>
            </div>
            <button className="text-sm text-primary">Edit</button>
          </div>
          {group.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}