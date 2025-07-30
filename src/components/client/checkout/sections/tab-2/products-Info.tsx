'use client';

import { useSelector } from 'react-redux';
import { selectShopProducts } from '@/store/features/checkout/ordersSilde';
import { ProductInfo } from '@/types/order.interface';
import Image from 'next/image';
import { PiStorefrontLight } from 'react-icons/pi';
import { VoucherButton } from '@/components/client/cart/desktop/cart-ModalVoucher';

// Header component for the product list - desktop only
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

// Component to display a single product
function ProductItem({ item }: { item: ProductInfo }) {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-4 py-4 lg:py-5 px-4 lg:px-6 border-b text-sm hover:bg-gray-50 transition-colors">
      {/* Mobile & Desktop: Product Info */}
      <div className="lg:col-span-6 flex items-start space-x-3 lg:space-x-4">
        <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0">
          <Image
            src={item.image || '/placeholder.png'}
            alt={item.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-medium text-sm lg:text-base line-clamp-2">
            {item.name}
          </h3>
          <p className="text-gray-500 mt-1 text-xs lg:text-sm">
            Phân loại: {item.variation}
          </p>
          {/* Mobile Only: Price & Quantity */}
          <div className="flex items-center justify-between mt-2 lg:hidden">
            <div className="text-gray-500 text-xs">
              ₫{item.price.toLocaleString()} x {item.quantity}
            </div>
            <div className="text-primary font-medium">
              ₫{item.subtotal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Only: Price, Quantity, Total */}
      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
        <div className="text-gray-700 font-medium">
          ₫{item.price.toLocaleString()}
        </div>
      </div>
      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
        <div className="text-gray-700">{item.quantity}</div>
      </div>
      <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
        <div className="text-primary font-medium text-base">
          ₫{item.subtotal.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// Component to display a shop and its products
function ShopSection({ shopId, products }: { shopId: string; products: ProductInfo[] }) {
  const shopName = products.length > 0 ? products[0].shopName : 'Shop';
  const shopTotal = products.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Shop header */}
      <div className="flex items-center px-4 lg:px-6 py-3 border-b bg-white">
        <PiStorefrontLight className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm text-gray-700 font-medium">{shopName}</span>
      </div>

      {/* Products */}
      <ProductHeader />
      <div className="divide-y divide-gray-100">
        {products.map((item, index) => (
          <ProductItem key={`${shopId}-${index}`} item={item} />
        ))}
      </div>

      {/* Footer: Voucher & Total */}
      <div className="px-4 lg:px-6 py-4 bg-gray-50/50 border-t">
        <div className="flex flex-col gap-3">
          <div className="">
            <VoucherButton shopId={shopId} shopName={shopName} />
          </div>
          <div className="flex items-center justify-end gap-3">
            <span className="text-sm text-gray-600">Tổng tiền:</span>
            <span className="text-xl font-bold text-primary">
              ₫{shopTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsInfo() {
  const shopProducts = useSelector(selectShopProducts);

  if (Object.keys(shopProducts).length === 0) {
    return <p>Không có sản phẩm nào trong giỏ hàng.</p>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(shopProducts).map(([shopId, products]) => (
        <ShopSection key={shopId} shopId={shopId} products={products} />
      ))}
    </div>
  );
}
