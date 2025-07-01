'use client';

import DesktopCartItem from './cart-Items';
import { mockCartItems } from '@/components/client/cart/desktop/cart-MockData';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

export default function DesktopCartPageMobile() {
  const [selectedShops, setSelectedShops] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const handleToggleShop = (shop: string, items: typeof mockCartItems[0]['items']) => {
    const isChecked = !selectedShops[shop];
    const updatedItems = { ...selectedItems };

    items.forEach((item) => {
      updatedItems[item.id] = isChecked;
    });

    setSelectedShops((prev) => ({ ...prev, [shop]: isChecked }));
    setSelectedItems(updatedItems);
  };

  const handleToggleItem = (shop: string, itemId: string, shopItems: typeof mockCartItems[0]['items']) => {
    const updatedItems = { ...selectedItems, [itemId]: !selectedItems[itemId] };
    setSelectedItems(updatedItems);

    // Kiểm tra nếu tất cả item của shop đã được chọn
    const allSelected = shopItems.every((item) => updatedItems[item.id]);
    setSelectedShops((prev) => ({ ...prev, [shop]: allSelected }));
  };

  return (
    <div className="pt-2 space-y-4">
      {mockCartItems.map((group, index) => (
        <div key={group.shop + '-' + index} className="bg-white border rounded-sm">
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
              onCheckedChange={() => handleToggleItem(group.shop, item.id, group.items)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
