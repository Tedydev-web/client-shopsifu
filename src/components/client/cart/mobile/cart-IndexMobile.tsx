"use client";

import { useCart } from "@/providers/CartContext";
import { Checkbox } from "@/components/ui/checkbox";
import MobileCartItem from "./cart-ItemsMobile";
import MobileCartHeader from "./cart-HeaderMobile";
import MobileCartFooter from "./cart-FooterMobile";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Loader } from "lucide-react";
import { CartItem, ShopCart } from "@/types/cart.interface";
import { PiStorefrontLight } from "react-icons/pi";

export default function MobileCartIndex() {
  const { 
    shopCarts, 
    isLoading, 
    updateItemQuantity, 
    removeItemFromCart, 
    handleVariationChange 
  } = useCart();

  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const allItemIds = useMemo(() => 
    shopCarts.flatMap((shop: ShopCart) => shop.cartItems.map((item: CartItem) => item.id)), 
    [shopCarts]
  );

  const selectedItemCount = Object.values(selectedItems).filter(Boolean).length;
  const areAllItemsSelected = allItemIds.length > 0 && selectedItemCount === allItemIds.length;

  const handleSelectAll = () => {
    const newSelectedState = !areAllItemsSelected;
    const newSelectedItems: Record<string, boolean> = {};
    allItemIds.forEach((id: string) => {
      newSelectedItems[id] = newSelectedState;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSelectShop = (shopId: string) => {
    const shop = shopCarts.find((s: ShopCart) => s.shop.id === shopId);
    if (!shop) return;

    const shopItemIds = shop.cartItems.map((item: CartItem) => item.id);
    const areAllShopItemsSelected = shopItemIds.every((id: string) => selectedItems[id]);
    const newSelectedState = !areAllShopItemsSelected;

    const newSelectedItems = { ...selectedItems };
    shopItemIds.forEach((id: string) => {
      newSelectedItems[id] = newSelectedState;
    });
    setSelectedItems(newSelectedItems);
  };

  const totalPrice = useMemo(() => {
    return shopCarts.reduce((total: number, shop: ShopCart) => {
      return total + shop.cartItems.reduce((shopTotal: number, item: CartItem) => {
        if (selectedItems[item.id]) {
          const itemPrice = item.sku?.price ?? 0;
          return shopTotal + itemPrice * item.quantity;
        }
        return shopTotal;
      }, 0);
    }, 0);
  }, [shopCarts, selectedItems]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <MobileCartHeader title="Giỏ hàng" />
      </div>

      <main className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader className="animate-spin" />
          </div>
        ) : shopCarts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-4">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src="/images/empty-cart.png"
                alt="Empty Cart"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-gray-500">Giỏ hàng của bạn còn trống</p>
          </div>
        ) : (
          <div className="pb-4">
            {shopCarts.map((shop: ShopCart) => {
              const shopItemIds = shop.cartItems.map((item: CartItem) => item.id);
              const areAllShopItemsSelected = shopItemIds.every(
                (id: string) => selectedItems[id]
              );

              return (
                <div key={shop.shop.id} className="bg-white mb-2 shadow-sm">
                  <div className="p-4 border-b flex items-center gap-3">
                    <Checkbox
                      checked={areAllShopItemsSelected}
                      onCheckedChange={() => handleSelectShop(shop.shop.id)}
                    />
                    <PiStorefrontLight className="h-5 w-5" />
                    <span className="text-base">Shop {shop.shop.name}</span>
                  </div>
                  <div>
                    {shop.cartItems.map((item: CartItem) => (
                      <MobileCartItem
                        key={item.id}
                        item={item}
                        isSelected={!!selectedItems[item.id]}
                        onSelectionChange={handleSelectItem}
                        onRemove={removeItemFromCart}
                        onUpdateQuantity={updateItemQuantity}
                        onVariationChange={handleVariationChange}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {!isLoading && shopCarts.length > 0 && (
        <MobileCartFooter
          total={totalPrice}
          selectedCount={selectedItemCount}
          allSelected={areAllItemsSelected}
          onToggleAll={handleSelectAll}
          totalSaved={0} // Pass a default value for totalSaved
        />
      )}
    </div>
  );
}
