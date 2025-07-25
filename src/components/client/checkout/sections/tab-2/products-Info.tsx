'use client';

import { Store, Tag } from "lucide-react";
import Image from "next/image";
import { VoucherButton } from "@/components/client/cart/desktop/cart-ModalVoucher";
import { ShopCart } from "@/types/cart.interface";
import { PiStorefrontLight } from "react-icons/pi";

interface ProductsInfoProps {
  shopCarts: ShopCart[];
}

// Header component cho danh sách sản phẩm - chỉ hiển thị trên desktop
function ProductHeader() {
  return (
    <div className="hidden lg:grid grid-cols-12 gap-4 py-3 px-6 bg-gray-50 text-sm font-medium text-gray-500 border-b">
      <div className="col-span-6">Sản phẩm</div>
      <div className="col-span-2 text-center">Đơn giá</div>
      <div className="col-span-2 text-center">Số lượng</div>
      <div className="col-span-2 text-center">Thành tiền</div>
    </div>
  );
}

// Component hiển thị một sản phẩm
function ProductItem({ item }: { item: any }) {
  const total = item.sku.price * item.quantity;

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-4 py-4 lg:py-5 px-4 lg:px-6 border-b text-sm hover:bg-gray-50 transition-colors">
      {/* Mobile & Desktop: Product Info */}
      <div className="lg:col-span-6 flex items-start space-x-3 lg:space-x-4">
        <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0">
          <Image
            src={item.sku.product.images[0] || '/placeholder.png'}
            alt={item.sku.product.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-medium text-sm lg:text-base line-clamp-2">
            {item.sku.product.name}
          </h3>
          <p className="text-gray-500 mt-1 text-xs lg:text-sm">
            Phân loại: {item.sku.value}
          </p>
          {/* Mobile Only: Price & Quantity */}
          <div className="flex items-center justify-between mt-2 lg:hidden">
            <div className="text-gray-500 text-xs">
              ₫{item.sku.price.toLocaleString()} x {item.quantity}
            </div>
            <div className="text-primary font-medium">
              ₫{total.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Only: Price, Quantity, Total */}
      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
        <div className="text-gray-700 font-medium">
          ₫{item.sku.price.toLocaleString()}
        </div>
      </div>
      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
        <div className="text-gray-700">{item.quantity}</div>
      </div>
      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
        <div className="text-primary font-medium text-base">
          ₫{total.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// Component hiển thị một shop và các sản phẩm của nó
function ShopSection({ shopCart }: { shopCart: ShopCart }) {
  const shopTotal = shopCart.cartItems.reduce(
    (sum, item) => sum + item.sku.price * item.quantity,
    0
  );

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Shop header */}
      <div className="flex items-center px-4 lg:px-6 py-3 border-b bg-white">
        <PiStorefrontLight className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-gray-500" />
        <span className="text-sm text-gray-700 font-medium">{shopCart.shop.name}</span>
      </div>

      {/* Products */}
      <ProductHeader />
      <div className="divide-y divide-gray-100">
        {shopCart.cartItems.map((item) => (
          <ProductItem key={item.id} item={item} />
        ))}
      </div>

      {/* Shop footer with voucher and total */}
      <div className="bg-gray-50 py-3 lg:py-4">
        {/* Voucher section */}
        <div className="flex items-center justify-between mb-3 lg:mb-4 px-4 lg:px-6">
          <span className="text-gray-700 font-medium text-sm">Voucher của Shop</span>
          <div className="flex items-center gap-4 lg:gap-6">
            <p className="text-xs lg:text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer flex items-center gap-1.5 hover:underline transition-colors">
              <Tag className="h-3.5 w-3.5" />
              Chọn voucher
            </p>
          </div>
        </div>

        {/* Total section */}
        <div className="flex items-center justify-end border-t pt-3 lg:pt-4">
          <div className="text-right px-4 lg:px-6">
            <span className="text-gray-600 text-sm mr-2 lg:mr-3">Tổng số tiền ({shopCart.cartItems.length} sản phẩm):</span>
            <span className="text-base lg:text-lg font-medium text-primary">
              ₫{shopTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsInfo({ shopCarts }: ProductsInfoProps) {
  return (
    <div className="space-y-4 lg:space-y-6">
      {shopCarts.map((shopCart) => (
        <ShopSection key={shopCart.shop.id} shopCart={shopCart} />
      ))}
    </div>
  );
}
