'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tag } from 'lucide-react';

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
    <div className="bg-white rounded-lg border p-5 sticky top-6">
      <h2 className="text-base font-semibold mb-4">Tóm tắt đơn hàng</h2>
      
      <div className="space-y-4 mb-5">
        <div className="max-h-48 overflow-auto pr-1">
          <div className="space-y-4">
            {/* Placeholder for items */}
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sản phẩm mẫu 1</p>
                <p className="text-xs text-gray-500">Size: M, Màu: Đen</p>
                <p className="text-xs">x1 | {formatPrice(400000)}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sản phẩm mẫu 2</p>
                <p className="text-xs text-gray-500">Size: L, Màu: Trắng</p>
                <p className="text-xs">x2 | {formatPrice(800000)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2 py-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tạm tính</span>
            <span className="text-sm">{formatPrice(orderSummary.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Phí vận chuyển</span>
            <span className="text-sm">{formatPrice(orderSummary.shipping)}</span>
          </div>
          {orderSummary.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Giảm giá</span>
              <span className="text-sm text-green-600">-{formatPrice(orderSummary.discount)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input 
              placeholder="Nhập mã giảm giá" 
              className="h-9 text-sm"
            />
          </div>
          <Button 
            variant="secondary" 
            className="h-9 text-sm whitespace-nowrap"
          >
            Áp dụng
          </Button>
        </div>
        
        <p className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer flex items-center gap-1 mb-3 hover:underline transition-colors">
          <Tag className="h-3 w-3" />
          Xem thêm mã giảm giá
        </p>
        
        <Separator />
        
        <div className="flex justify-between font-medium mt-3">
          <span className="text-sm">Tổng cộng</span>
          <span className="text-base text-primary">{formatPrice(orderSummary.total)}</span>
        </div>
        
        <p className="text-xs font-light text-gray-500">
          (Đã bao gồm VAT nếu có)
        </p>
      </div>
      
      <div className="pt-4 mt-2 border-t">
        <Button disabled className="w-full text-sm h-10">Đặt hàng</Button>
        <p className="text-xs text-center mt-2 text-gray-500 font-light">
          Vui lòng hoàn thành thông tin đặt hàng
        </p>
      </div>
    </div>
  );
}
