"use client";

import DesktopCartItem from "./cart-Items";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import DesktopCartHeader from "./cart-ProductTitle";
import CartFooter from "./cart-Footer";
import { Store, Loader2 } from "lucide-react";
import { VoucherButton } from "./cart-ModalVoucher";
import { useCart } from "@/context/CartContext";
import { ShopCart, CartItem } from "@/types/cart.interface";
import { ProductItem } from "./cart-MockData";

export default function DesktopCartPageMobile() {
  // Sử dụng CartContext thay vì mock data
  const { 
    cart, 
    shopCarts, 
    isLoading, 
    updateCartItem, 
    removeItems,
    selectAllItems,
    lastUpdated,
    forceRefresh 
  } = useCart();

  const [selectedShops, setSelectedShops] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  
  // Đồng bộ trạng thái selected từ API với state local
  useEffect(() => {
    if (shopCarts && shopCarts.length > 0) {
      const shopSelectedState: Record<string, boolean> = {};
      const itemSelectedState: Record<string, boolean> = {};
      
      let allSelected = true;
      
      shopCarts.forEach((shopCart: ShopCart) => {
        const allItemsSelected = shopCart.cartItems.every((item: CartItem) => item.isSelected);
        shopSelectedState[shopCart.shop.id] = allItemsSelected;
        
        if (!allItemsSelected) allSelected = false;
        
        shopCart.cartItems.forEach((item: CartItem) => {
          itemSelectedState[item.id] = item.isSelected || false;
        });
      });
      
      setSelectedShops(shopSelectedState);
      setSelectedItems(itemSelectedState);
      setSelectAll(allSelected);
    }
  }, [shopCarts, lastUpdated]);

  // Chọn/bỏ chọn tất cả sản phẩm của một shop
  const handleToggleShop = async (shopId: string, items: CartItem[]) => {
    const isChecked = !selectedShops[shopId];
    
    // Cập nhật UI ngay lập tức để có phản hồi tốt
    const updatedItems = { ...selectedItems };
    const updatedShops = { ...selectedShops, [shopId]: isChecked };
    
    items.forEach((item) => {
      updatedItems[item.id] = isChecked;
    });
    
    setSelectedShops(updatedShops);
    setSelectedItems(updatedItems);
    
    // Gửi yêu cầu cập nhật lên server
    try {
      // Lấy danh sách ID các sản phẩm của shop
      const cartItemIds = items.map(item => item.id);
      
      // Gọi API để cập nhật trạng thái chọn
      await selectAllItems(isChecked, true);
    } catch (error) {
      console.error("Error updating shop items selection:", error);
      // Nếu có lỗi, khôi phục lại trạng thái trước đó
      forceRefresh();
    }
  };

  // Chọn/bỏ chọn một sản phẩm
  const handleToggleItem = async (
    shopId: string,
    itemId: string,
    shopItems: CartItem[]
  ) => {
    const newIsSelected = !selectedItems[itemId];
    
    // Cập nhật UI ngay lập tức để có phản hồi tốt
    const updatedItems = { ...selectedItems, [itemId]: newIsSelected };
    setSelectedItems(updatedItems);
    
    const allSelected = shopItems.every((item) => updatedItems[item.id]);
    setSelectedShops((prev) => ({ ...prev, [shopId]: allSelected }));
    
    // Gửi yêu cầu cập nhật lên server
    try {
      await updateCartItem(itemId, { 
        skuId: shopItems.find(item => item.id === itemId)?.skuId || "",
        quantity: shopItems.find(item => item.id === itemId)?.quantity || 1,
        isSelected: newIsSelected 
      });
    } catch (error) {
      console.error("Error updating item selection:", error);
      // Nếu có lỗi, khôi phục lại trạng thái trước đó
      forceRefresh();
    }
  };

  // Chọn/bỏ chọn tất cả sản phẩm
  const handleToggleAll = async () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    
    // Cập nhật UI ngay lập tức
    const updatedShops: Record<string, boolean> = {};
    const updatedItems: Record<string, boolean> = {};
    
    shopCarts.forEach((shopCart: ShopCart) => {
      updatedShops[shopCart.shop.id] = newValue;
      shopCart.cartItems.forEach((item: CartItem) => {
        updatedItems[item.id] = newValue;
      });
    });
    
    setSelectedShops(updatedShops);
    setSelectedItems(updatedItems);
    
    // Gửi yêu cầu lên server
    try {
      await selectAllItems(newValue);
    } catch (error) {
      console.error("Error updating all items selection:", error);
      // Nếu có lỗi, khôi phục lại trạng thái trước đó
      forceRefresh();
    }
  };

  // Thay đổi SKU của sản phẩm
  const handleVariationChange = async (itemId: string, newSkuId: string) => {
    try {
      const item = shopCarts.flatMap((sc: ShopCart) => sc.cartItems).find((item: CartItem) => item.id === itemId);
      
      if (item) {
        await updateCartItem(itemId, {
          skuId: newSkuId,
          quantity: item.quantity,
          isSelected: item.isSelected
        });
      }
    } catch (error) {
      console.error("Error updating item variation:", error);
      forceRefresh();
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItems([itemId]);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // ✅ Tính toán các giá trị footer
  // Sử dụng thông tin từ Cart Context thay vì tính toán lại
  const selectedItemList = cart?.shops.flatMap((shop: ShopCart) => 
    shop.cartItems.filter((item: CartItem) => item.isSelected)
  ) || [];
  
  const total = cart?.totalSelectedPrice || 0;
  
  // Tính toán số tiền tiết kiệm
  const totalSaved = selectedItemList.reduce((sum: number, item: CartItem) => {
    const regularPrice = item.sku.product.virtualPrice || 0;
    const currentPrice = item.sku.price || 0;
    if (regularPrice > currentPrice) {
      return sum + (regularPrice - currentPrice) * item.quantity;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-4">
      <DesktopCartHeader allSelected={selectAll} onToggleAll={handleToggleAll} />

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Đang tải giỏ hàng...</span>
        </div>
      ) : shopCarts && shopCarts.length > 0 ? (
        <>
          {shopCarts.map((shopCart: ShopCart, index: number) => (
            <div key={shopCart.shop.id + "-" + index} className="bg-white border rounded-sm">
              {/* Shop Header */}
              <div className="flex items-center px-3 py-4 border-b">
                <Checkbox
                  className="mr-4 ml-[30px]"
                  checked={!!selectedShops[shopCart.shop.id]}
                  onCheckedChange={() => handleToggleShop(shopCart.shop.id, shopCart.cartItems)}
                />
                <Store className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium text-base">{shopCart.shop.name}</span>
              </div>

              {/* Items */}
              {shopCart.cartItems.map((cartItem: CartItem) => (
                <DesktopCartItem
                  key={cartItem.id}
                  item={{
                    id: cartItem.id,
                    name: cartItem.sku.product.name,
                    image: cartItem.sku.image,
                    variation: cartItem.sku.value,
                    // Xử lý variations nếu có
                    variations: cartItem.sku.product.variants?.length > 0 
                      ? cartItem.sku.product.variants[0].options 
                      : undefined,
                    price: cartItem.sku.price,
                    originalPrice: cartItem.sku.product.virtualPrice,
                    quantity: cartItem.quantity,
                    soldOut: cartItem.sku.stock <= 0
                  }}
                  checked={!!selectedItems[cartItem.id]}
                  onCheckedChange={() =>
                    handleToggleItem(shopCart.shop.id, cartItem.id, shopCart.cartItems)
                  }
                  onVariationChange={handleVariationChange}
                  onRemove={() => handleRemoveItem(cartItem.id)}
                />
              ))}
              
              {/* Voucher Button */}
              <div className="p-3 border-t">
                <VoucherButton 
                  shopId={shopCart.shop.id} 
                  shopName={shopCart.shop.name} 
                  onApplyVoucher={(voucher) => {
                    console.log("Applied voucher:", voucher);
                    // Xử lý logic áp dụng voucher ở đây
                  }}
                />
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="bg-white p-10 text-center">
          <div className="text-xl font-medium">Giỏ hàng của bạn đang trống</div>
          <p className="text-gray-500 mt-2">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        </div>
      )}

      {/* ✅ Footer bên dưới tất cả cart */}
      {(shopCarts && shopCarts.length > 0) && (
        <CartFooter
          total={total}
          totalSaved={totalSaved}
          selectedCount={selectedItemList.length}
          allSelected={selectAll}
          onToggleAll={handleToggleAll}
        />
      )}
    </div>
  );
}
