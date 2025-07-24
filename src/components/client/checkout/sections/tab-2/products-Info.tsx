'use client';

import { Store, Tag } from "lucide-react";
import Image from "next/image";
import { VoucherButton } from "@/components/client/cart/desktop/cart-ModalVoucher";
import { ShopCart } from "@/types/cart.interface";
import { PiStorefrontLight } from "react-icons/pi";

interface ProductsInfoProps {
  shopCarts: ShopCart[];
}

// Header component cho danh sách sản phẩm
function ProductHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 py-4 px-6 bg-gray-50 text-sm font-medium text-gray-600 border-b">
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
    <div className="grid grid-cols-12 gap-4 py-5 px-6 border-b text-sm hover:bg-gray-50 transition-colors">
      <div className="col-span-6 flex items-center space-x-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={item.sku.product.images[0] || '/placeholder.png'}
            alt={item.sku.product.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-medium text-base line-clamp-2">
            {item.sku.product.name}
          </h3>
          <p className="text-gray-500 mt-1.5 text-sm">
            Phân loại: {item.sku.value}
          </p>
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <div className="text-gray-700 font-medium">
          ₫{item.sku.price.toLocaleString()}
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <div className="text-gray-700">{item.quantity}</div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <div className="text-primary font-semibold text-base">
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
      <div className="flex items-center px-6 py-4 border-b bg-white">
        <PiStorefrontLight className="h-5 w-5 mr-2" />
        <span className="font-sm text-gray-800">{shopCart.shop.name}</span>
      </div>

      {/* Products */}
      <div className="divide-y divide-gray-100">
        {shopCart.cartItems.map((item) => (
          <ProductItem key={item.id} item={item} />
        ))}
      </div>

      {/* Shop footer with voucher and total */}
      <div className="bg-blue-20 py-4">
        {/* Voucher section */}
        <div className="flex items-center justify-between mb-4 px-6">
          <span className="text-gray-700 font-medium text-sm">Voucher của Shop</span>
          <div className="flex items-center gap-6">
            <p className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer flex items-center gap-1.5 hover:underline transition-colors">
              <Tag className="h-3.5 w-3.5" />
              Chọn voucher
            </p>
          </div>
        </div>

        {/* Total section */}
        <div className="flex items-center justify-end border-t pt-4">
          <div className="text-right px-6">
            <span className="text-gray-600 mr-3">Tổng số tiền ({shopCart.cartItems.length} sản phẩm):</span>
            <span className="text-lg font-medium text-primary">
              ₫{shopTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsInfo({ shopCarts }: ProductsInfoProps) {
  const totalAmount = shopCarts.reduce((total, shop) => {
    return total + shop.cartItems.reduce(
      (shopTotal, item) => shopTotal + item.sku.price * item.quantity,
      0
    );
  }, 0);

  return (
    <div className="space-y-6">
      {/* Separate shop sections */}
      {shopCarts.map((shopCart) => (
        <ShopSection key={shopCart.shop.id} shopCart={shopCart} />
      ))}

      {/* Final total */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Tổng thanh toán:</span>
          <span className="text-xl font-semibold text-primary">
            ₫{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
