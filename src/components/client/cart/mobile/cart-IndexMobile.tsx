'use client'

import { mockCartItems } from "@/components/client/cart/mobile/cart-MockData"
import CartItem from "@/components/client/cart/mobile/cart-Items"
import CartFooter from "@/components/client/cart/mobile/cart-Footer"
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

      {/* Footer cố định dưới cùng */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t">
        <CartFooter total={total} />
      </div>
    </div>
  );
}