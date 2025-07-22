'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { CartItem, ShopCart } from '@/types/cart.interface';
import { formatPrice } from '@/lib/utils';

export function CheckoutOrderSummary() {
  const { cart } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const totalItems = cart?.reduce((acc, shop) => {
    return acc + shop.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0);
  }, 0) || 0;

  const subtotal = cart?.reduce((acc, shop) => {
    return acc + shop.items.reduce((itemAcc, item) => itemAcc + item.price * item.quantity, 0);
  }, 0) || 0;

  const shipping = 30000; // Giá ship cố định, sau này sẽ tính dựa theo địa chỉ và phương thức giao hàng
  const discount = 0; // Giảm giá, sau này sẽ tính dựa theo voucher áp dụng
  const total = subtotal + shipping - discount;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    
    setIsApplying(true);
    // Giả lập việc áp dụng mã giảm giá
    setTimeout(() => {
      setIsApplying(false);
      // Giả lập lỗi khi áp dụng mã giảm giá không tồn tại
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }, 1000);
  };

  const renderCartItems = (items: CartItem[]) => {
    return items.map((item) => (
      <div key={item.id} className="flex items-center py-3 border-b last:border-b-0">
        <div className="relative w-16 h-16 rounded overflow-hidden mr-4 border bg-gray-50">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-xs text-gray-500">No image</span>
            </div>
          )}
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs">
            {item.quantity}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium line-clamp-2">{item.name}</p>
          <p className="text-sm text-gray-500">{item.variant || ''}</p>
          <p className="text-sm font-semibold">{formatPrice(item.price)}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Tóm tắt đơn hàng</h2>
          <button
            onClick={toggleExpand}
            className="text-gray-500 md:hidden"
            aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="p-4 border-b">
          <div className="max-h-80 overflow-y-auto space-y-4">
            {cart?.map((shopCart: ShopCart) => (
              <div key={shopCart.shopId} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center mb-2">
                  {shopCart.shopLogo && (
                    <Image
                      src={shopCart.shopLogo}
                      alt={shopCart.shopName}
                      width={20}
                      height={20}
                      className="mr-2 rounded-full"
                    />
                  )}
                  <h3 className="font-medium text-sm">{shopCart.shopName}</h3>
                </div>
                {renderCartItems(shopCart.items)}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center">
            <Input
              placeholder="Mã giảm giá"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="mr-2"
            />
            <Button
              variant="outline"
              onClick={handleApplyPromo}
              disabled={isApplying || !promoCode.trim()}
            >
              {isApplying ? 'Đang áp dụng...' : 'Áp dụng'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính ({totalItems} sản phẩm)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá</span>
            <span className="text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="border-t pt-3 mt-2">
          <div className="flex justify-between font-medium">
            <span>Tổng cộng</span>
            <span className="text-lg">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            (Đã bao gồm VAT nếu có)
          </p>
        </div>
      </div>
    </div>
  );
}
