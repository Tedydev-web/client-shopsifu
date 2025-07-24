'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tag } from 'lucide-react';

export function FooterSection() {
  const orderSummary = {
    subtotal: 1200000,
    shipping: 30000,
    voucherDiscount: 50000,
    total: 1180000
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
      <h2 className="text-lg font-semibold mb-6">Tóm tắt đơn hàng</h2>
      
      <div className="space-y-6">
        {/* Tổng tiền hàng và phí */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tổng tiền hàng</span>
            <span className="font-medium">{formatPrice(orderSummary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="font-medium">{formatPrice(orderSummary.shipping)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá voucher</span>
            <span className="font-medium text-green-600">
              -{formatPrice(orderSummary.voucherDiscount)}
            </span>
          </div>
        </div>

        <Separator />
        
        {/* Mã giảm giá */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input 
                placeholder="Nhập mã giảm giá" 
                className="h-10 text-sm"
              />
            </div>
            <Button 
              variant="secondary" 
              className="h-10 px-6 text-sm font-medium"
            >
              Áp dụng
            </Button>
          </div>
          
          <div className="flex justify-end">
            <p className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer flex items-center gap-1.5 hover:underline transition-colors">
              <Tag className="h-3.5 w-3.5" />
              Xem thêm mã giảm giá
            </p>
          </div>
        </div>

        <Separator />
        
        {/* Tổng cộng */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">Tổng thanh toán</span>
            <span className="text-xl font-semibold text-primary">
              {formatPrice(orderSummary.total)}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-right">
            (Đã bao gồm VAT nếu có)
          </p>
        </div>
      </div>
      
      <div className="pt-6 mt-6 border-t">
        <Button className="w-full h-11 text-base font-medium">
          Đặt hàng
        </Button>
        <p className="text-xs text-center mt-3 text-gray-500">
          Vui lòng kiểm tra lại thông tin trước khi đặt hàng
        </p>
      </div>
    </div>
  );
}
