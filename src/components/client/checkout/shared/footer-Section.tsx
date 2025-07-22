'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function FooterSection() {
  const orderSummary = {
    subtotal: 1200000,
    shipping: 30000,
    discount: 0,
    total: 1230000
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg border p-6 sticky top-6">
      <h2 className="text-lg font-medium mb-4">Tóm tắt đơn hàng</h2>
      
      <div className="space-y-4 mb-6">
        <div className="h-48 overflow-auto border rounded-md p-3 bg-gray-50">
          <div className="space-y-3">
            {/* Placeholder for items */}
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-medium">Sản phẩm mẫu 1</p>
                <p className="text-sm text-gray-500">Size: M, Màu: Đen</p>
                <p className="text-sm">x1 | {formatPrice(400000)}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-medium">Sản phẩm mẫu 2</p>
                <p className="text-sm text-gray-500">Size: L, Màu: Trắng</p>
                <p className="text-sm">x2 | {formatPrice(800000)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Tạm tính</span>
            <span>{formatPrice(orderSummary.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span>{formatPrice(orderSummary.shipping)}</span>
          </div>
          {orderSummary.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Giảm giá</span>
              <span className="text-green-600">-{formatPrice(orderSummary.discount)}</span>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-medium">
          <span>Tổng cộng</span>
          <span className="text-lg">{formatPrice(orderSummary.total)}</span>
        </div>
        
        <p className="text-xs text-gray-500">
          (Đã bao gồm VAT nếu có)
        </p>
      </div>
      
      <div className="pt-4 border-t">
        <Button disabled className="w-full">Đặt hàng</Button>
        <p className="text-xs text-center mt-2 text-gray-500">
          Vui lòng hoàn thành thông tin đặt hàng
        </p>
      </div>
    </div>
  );
}
