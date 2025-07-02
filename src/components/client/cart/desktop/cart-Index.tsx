"use client";

import DesktopCartItem from "./cart-Items";
import { mockCartItems } from "@/components/client/cart/desktop/cart-MockData";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import DesktopCartHeader from "./cart-ProductTitle";
import { CartGroup } from "./cart-MockData";
import CartFooter from "./cart-Footer"; // ✅ nhớ import

export default function DesktopCartPageMobile() {
  const [cartItems, setCartItems] = useState<CartGroup[]>(mockCartItems);
  const [selectedShops, setSelectedShops] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);

  const handleToggleShop = (shop: string, items: CartGroup["items"]) => {
    const isChecked = !selectedShops[shop];
    const updatedItems = { ...selectedItems };

    items.forEach((item) => {
      updatedItems[item.id] = isChecked;
    });

    setSelectedShops((prev) => ({ ...prev, [shop]: isChecked }));
    setSelectedItems(updatedItems);
  };

  const handleToggleItem = (
    shop: string,
    itemId: string,
    shopItems: CartGroup["items"]
  ) => {
    const updatedItems = { ...selectedItems, [itemId]: !selectedItems[itemId] };
    setSelectedItems(updatedItems);

    const allSelected = shopItems.every((item) => updatedItems[item.id]);
    setSelectedShops((prev) => ({ ...prev, [shop]: allSelected }));
  };

  const handleToggleAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);

    const updatedShops: Record<string, boolean> = {};
    const updatedItems: Record<string, boolean> = {};

    cartItems.forEach((group) => {
      updatedShops[group.shop] = newValue;
      group.items.forEach((item) => {
        updatedItems[item.id] = newValue;
      });
    });

    setSelectedShops(updatedShops);
    setSelectedItems(updatedItems);
  };

  const handleVariationChange = (itemId: string, newVariation: string) => {
    setCartItems((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === itemId ? { ...item, variation: newVariation } : item
        ),
      }))
    );
  };

  // ✅ Tính toán các giá trị footer
  const selectedItemList = cartItems.flatMap((group) =>
    group.items.filter((item) => selectedItems[item.id])
  );

  const total = selectedItemList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSaved = selectedItemList.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-4">
      <DesktopCartHeader allSelected={selectAll} onToggleAll={handleToggleAll} />

      {cartItems.map((group, index) => (
        <div key={group.shop + "-" + index} className="bg-white border rounded-sm">
          {/* Shop Header */}
          <div className="flex items-center px-3 py-4 border-b">
            <Checkbox
              className="mr-4 ml-[30px]"
              checked={!!selectedShops[group.shop]}
              onCheckedChange={() => handleToggleShop(group.shop, group.items)}
            />
            <span className="font-medium text-sm">{group.shop}</span>
          </div>

          {/* Items */}
          {group.items.map((item) => (
            <DesktopCartItem
              key={item.id}
              item={item}
              checked={!!selectedItems[item.id]}
              onCheckedChange={() =>
                handleToggleItem(group.shop, item.id, group.items)
              }
              onVariationChange={handleVariationChange}
            />
          ))}
        </div>
      ))}

      {/* ✅ Footer bên dưới tất cả cart */}
      <CartFooter
        total={total}
        totalSaved={totalSaved}
        selectedCount={selectedItemList.length}
        allSelected={selectAll}
        onToggleAll={handleToggleAll}
      />
    </div>
  );
}
