"use client";

import DesktopCartItem from "./cart-Items";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useMemo } from "react";
import DesktopCartHeader from "./cart-ProductTitle";
import CartFooter from "./cart-Footer";
import { Loader2 } from "lucide-react";
import { VoucherButton } from "./cart-ModalVoucher";
import { useCart } from "@/providers/CartContext";
import { ShopCart, CartItem } from "@/types/cart.interface";
import { ProductInfo } from '@/types/order.interface';
import { PiStorefrontLight } from "react-icons/pi";
import Image from "next/image";
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { setShopOrders, setCommonInfo, setShopProducts } from "@/store/features/checkout/ordersSilde";

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
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  
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

      // Initialize quantities state
      const initialQuantities: Record<string, number> = {};
      shopCarts.forEach((shop: ShopCart) => {
        shop.cartItems.forEach((item: CartItem) => {
          initialQuantities[item.id] = item.quantity;
        });
      });
      setItemQuantities(initialQuantities);
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
    
    // API call removed as per request
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

    // API call removed as per request
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

    // API call removed as per request
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

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  // ✅ Tính toán các giá trị footer dựa trên state `selectedItems` và `itemQuantities` để cập nhật UI tức thì
  const { total, totalSaved, selectedCount } = useMemo(() => {
    let currentTotal = 0;
    let currentTotalSaved = 0;
    let count = 0;

    shopCarts.forEach((shopCart: ShopCart) => {
      shopCart.cartItems.forEach((item: CartItem) => {
        if (selectedItems[item.id]) {
          const quantity = itemQuantities[item.id] || item.quantity;
          const price = item.sku.price || 0;
          const regularPrice = item.sku.product.virtualPrice || price;

          currentTotal += price * quantity;
          if (regularPrice > price) {
            currentTotalSaved += (regularPrice - price) * quantity;
          }
          count++;
        }
      });
    });

    return { total: currentTotal, totalSaved: currentTotalSaved, selectedCount: count };
  }, [selectedItems, shopCarts, itemQuantities]);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleCheckout = () => {
    // 1. Lọc ra các shop có sản phẩm được chọn
    const selectedShopCarts = shopCarts
      .map((shopCart: ShopCart) => ({
        ...shopCart,
        // 2. Trong mỗi shop, chỉ giữ lại các cartItems được chọn
        cartItems: shopCart.cartItems.filter((item: CartItem) => selectedItems[item.id]),
      }))
      // 3. Chỉ giữ lại các shop có ít nhất 1 sản phẩm được chọn sau khi lọc
      .filter((shopCart: ShopCart) => shopCart.cartItems.length > 0);

    if (selectedShopCarts.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    // 4. Tạo payload cho Redux action `setShopOrders`
    const shopOrdersPayload = selectedShopCarts.map((shopCart: ShopCart) => ({
      shopId: shopCart.shop.id,
      cartItemIds: shopCart.cartItems.map((item: CartItem) => item.id),
      discountCodes: [], // Tạm thởi để trống
    }));

    // 4b. Tạo payload cho Redux action `setShopProducts`
    const shopProductsPayload = selectedShopCarts.reduce((acc: Record<string, ProductInfo[]>, shopCart: ShopCart) => {
      acc[shopCart.shop.id] = shopCart.cartItems.map((item: CartItem) => ({
        name: item.sku.product.name,
        image: item.sku.image, // Lấy ảnh từ SKU
        variation: item.sku.value,
        quantity: item.quantity,
        subtotal: item.sku.price * item.quantity,
      }));
      return acc;
    }, {});


    // 5. Dispatch các action để cập nhật Redux state
    dispatch(setShopOrders(shopOrdersPayload));
    dispatch(setShopProducts(shopProductsPayload));
    dispatch(setCommonInfo({ amount: total, receiver: null, paymentGateway: null })); // Cập nhật tổng tiền

    // 6. Điều hướng đến trang thanh toán
    router.push('/checkout'); // Thay đổi '/checkout' thành route thanh toán của bạn
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Đang tải giỏ hàng...</span>
        </div>
      ) : shopCarts && shopCarts.length > 0 ? (
        <>
          <DesktopCartHeader allSelected={selectAll} onToggleAll={handleToggleAll} />
          {shopCarts.map((shopCart: ShopCart, index: number) => (
            <div key={shopCart.shop.id + "-" + index} className="bg-white border rounded-sm">
              {/* Shop Header */}
              <div className="flex items-center px-3 py-4 border-b">
                <Checkbox
                  className="mr-4 ml-[30px]"
                  checked={!!selectedShops[shopCart.shop.id]}
                  onCheckedChange={() => handleToggleShop(shopCart.shop.id, shopCart.cartItems)}
                />
                <PiStorefrontLight className="h-5 w-5 mr-2" />
                <span className="text-base">Shop {shopCart.shop.name}</span>
              </div>

              {/* Items */}
               {shopCart.cartItems.map((cartItem: CartItem) => (
                <DesktopCartItem
                  key={cartItem.id}
                  item={cartItem}
                  checked={!!selectedItems[cartItem.id]}
                  quantity={itemQuantities[cartItem.id] || cartItem.quantity}
                  onQuantityChange={handleQuantityChange}
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
                  onApplyVoucher={(voucher: any) => { // You can replace 'any' with a specific Voucher type if available
                    console.log("Applied voucher:", voucher);
                    // Xử lý logic áp dụng voucher ở đây
                  }}
                />
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="p-10 text-center flex flex-col items-center justify-center">
          <Image src="/images/client/cart/Cart-empty-v2.webp" alt="Empty Cart" width={200} height={200} className="object-contain mb-4" />
          <div className="text-xl font-medium">Giỏ hàng của bạn đang trống</div>
          <p className="text-gray-500 mt-2">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        </div>
      )}

      {/* ✅ Footer bên dưới tất cả cart */}
      {(shopCarts && shopCarts.length > 0) && (
        <CartFooter
          total={total}
          totalSaved={totalSaved}
          selectedCount={selectedCount}
          allSelected={selectAll}
          onToggleAll={handleToggleAll}
          onCheckout={handleCheckout} // Truyền hàm checkout xuống footer
        />
      )}
    </div>
  );
}
