'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tag, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterSectionProps {
  variant?: 'default' | 'mobile';
  step?: 'information' | 'payment';
  onPrevious?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
}

export function FooterSection({ 
  variant = 'default',
  step = 'information',
  onPrevious,
  onNext,
  isSubmitting = false
}: FooterSectionProps) {
  const orderSummary = {
    subtotal: 1200000,
    shipping: 30000,
    voucherDiscount: 50000,
    total: 1180000
  };

  const formatPrice = (price: number) => {
    return `₫${price.toLocaleString()}`;
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Đang xử lý...';
    return step === 'information' ? 'Tiếp tục thanh toán' : 'Hoàn tất đặt hàng';
  };

  if (variant === 'mobile') {
    return (
      <div className="space-y-3">
        {/* Mobile Order Summary */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tổng thanh toán</span>
          <span className="text-lg font-semibold text-primary">
            {formatPrice(orderSummary.total)}
          </span>
        </div>

        {/* Mobile Voucher Input */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Nhập mã giảm giá"
            className="h-9 text-sm flex-1"
          />
          <Button
            variant="secondary"
            className="h-9 px-4 text-sm font-medium whitespace-nowrap"
          >
            Áp dụng
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2">
          {step === 'payment' && (
            <Button
              variant="outline"
              onClick={onPrevious}
              className="flex-1 h-10 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Quay lại
            </Button>
          )}
          <Button 
            className="flex-1 h-10 text-sm font-medium"
            onClick={onNext}
            disabled={isSubmitting}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-base font-medium mb-6">Tóm tắt đơn hàng</h2>

      <div className="space-y-6">
        {/* Desktop Order Summary */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tổng tiền hàng</span>
            <span className="font-medium">{formatPrice(orderSummary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phí vận chuyển</span>
            <span className="font-medium">{formatPrice(orderSummary.shipping)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Giảm giá voucher</span>
            <span className="font-medium text-green-600">
              -{formatPrice(orderSummary.voucherDiscount)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Desktop Voucher Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Nhập mã giảm giá"
                className="h-9 text-sm"
              />
            </div>
            <Button
              variant="secondary"
              className="h-9 px-4 text-sm font-medium"
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

        {/* Desktop Total */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-sm">Tổng thanh toán</span>
            <span className="text-lg font-medium text-primary">
              {formatPrice(orderSummary.total)}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-right">
            (Đã bao gồm VAT nếu có)
          </p>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="pt-6 mt-6 border-t">
        <div className="flex items-center gap-3">
          {step === 'payment' && (
            <Button
              variant="outline"
              onClick={onPrevious}
              className="flex-1 h-10 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Quay lại
            </Button>
          )}
          <Button 
            className="flex-1 h-10 text-sm font-medium"
            onClick={onNext}
            disabled={isSubmitting}
          >
            {getButtonText()}
          </Button>
        </div>
        <p className="text-xs text-center mt-3 text-gray-500">
          Vui lòng kiểm tra lại thông tin trước khi đặt hàng
        </p>
      </div>
    </div>
  );
}
