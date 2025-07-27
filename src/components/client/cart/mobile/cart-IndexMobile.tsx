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
    <div className="bg-gray-100 min-h-screen">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <MobileCartHeader title="Giỏ hàng" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-60px)]">
          <Loader className="animate-spin" />
        </div>
      ) : !shopCarts || shopCarts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] bg-gray-50 p-10 text-center">
          <Image src="/images/client/cart/Cart-empty-v2.webp" alt="Empty Cart" width={150} height={150} />
          <div className="text-xl font-medium">Giỏ hàng của bạn đang trống</div>
          <p className="text-gray-500 mt-2">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        </div>
      ) : (
        <div className="pb-24">
          {shopCarts.map((shopCart: ShopCart) => {
            const shopItemIds = shopCart.cartItems.map((item: CartItem) => item.id);
            const isShopSelected = shopItemIds.length > 0 && shopItemIds.every((id: string) => selectedItems[id]);

            return (
              <div key={shopCart.shop.id} className="mt-2 bg-white">
                <div className="flex items-center p-4 border-b">
                  <Checkbox 
                    checked={isShopSelected} 
                    onCheckedChange={() => handleSelectShop(shopCart.shop.id)} 
                    className="mr-3"
                  />
                  <span className="font-semibold text-gray-800">{shopCart.shop.name}</span>
                </div>
                <div>
                  {shopCart.cartItems.map((item: CartItem) => (
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

          <MobileCartFooter
            total={totalPrice}
            selectedCount={selectedItemCount}
            allSelected={areAllItemsSelected}
            onToggleAll={handleSelectAll}
            totalSaved={0} // Pass a default value for totalSaved
          />
        </div>
      )}
    </div>
  );
}
