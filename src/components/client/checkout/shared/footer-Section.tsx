'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tag, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { selectShopProducts } from '@/store/features/checkout/ordersSilde';
import { formatCurrency } from '@/utils/formatter';
import { useEffect } from 'react';

interface FooterSectionProps {
  variant?: 'default' | 'mobile';
  step?: 'information' | 'payment';
  onPrevious?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
  onTotalChange?: (total: number) => void;
}

// Helper component for displaying a single price line
function PriceLine({ label, value, isBold = false }: { label: string; value: string; isBold?: boolean }) {
  return (
    <div className={`flex justify-between items-center ${isBold ? 'font-semibold text-lg' : 'text-sm'}`}>
      <span className="text-gray-600">{label}</span>
      <span className={`${isBold ? 'text-red-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}

export function FooterSection({ 
  variant = 'default',
  step = 'information',
  onPrevious,
  onNext,
  isSubmitting = false,
  onTotalChange
}: FooterSectionProps) {
  const shopProducts = useSelector(selectShopProducts);

  // Calculate subtotal from all products in all shops
  const subtotal = Object.values(shopProducts).reduce((total, shopProducts) => {
    return total + shopProducts.reduce((shopTotal, product) => {
      return shopTotal + (product.price * product.quantity);
    }, 0);
  }, 0);

  // For now, shipping and discount are not implemented
  const shippingFee = 0;
  const voucherDiscount = 0;

  // Calculate the final total
  const totalPayment = subtotal + shippingFee - voucherDiscount;
  
  // Gửi tổng tiền thanh toán lên component cha nếu có callback
  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(totalPayment);
    }
  }, [totalPayment, onTotalChange]);

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
            {formatCurrency(totalPayment)}
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
          <PriceLine label="Tổng tiền hàng" value={formatCurrency(subtotal)} />
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
          <div className="my-3"></div>
          <PriceLine label="Tổng thanh toán" value={formatCurrency(totalPayment)} isBold={true} />
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
