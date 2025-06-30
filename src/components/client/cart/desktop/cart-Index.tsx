'use client'

import DesktopCartItem from "./cart-Items"
import { mockCartItems } from "@/components/client/cart/desktop/cart-MockData"
import { Checkbox } from "@/components/ui/checkbox"
import { CartTopBar } from "./cart-TopBar" 
import { SearchInput } from "./cart-HeaderWrapper"

export default function DesktopCartPageMobile() {
  return (
  <>
    <div className="space-y-6">
      {/* <DesktopCartHeader /> */}
      {mockCartItems.map((group, index) => (
        <div key={group.shop + '-' + index} className="bg-white">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="flex items-center gap-2">
              <Checkbox />
              <span className="font-medium text-sm">{group.shop}</span>
            </div>
            <button className="text-sm text-primary">Edit</button>
          </div>
          {group.items.map((item) => (
            <DesktopCartItem key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
    </>
  );
}