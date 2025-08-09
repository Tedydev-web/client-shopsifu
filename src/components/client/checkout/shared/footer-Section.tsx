'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tag, ArrowLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectShopProducts,
  selectTotalDiscountAmount,
  selectAppliedPlatformVoucher,
  removePlatformVoucher,
  setCommonInfo,
} from '@/store/features/checkout/ordersSilde';
import { formatCurrency } from '@/utils/formatter';
import { useEffect, useState } from 'react';
import { PlatformVoucherModal } from './cart-PlatformVoucher';
import { AppliedVoucherInfo } from '@/types/order.interface';

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
  const dispatch = useDispatch();
  const shopProducts = useSelector(selectShopProducts);
  const totalDiscount = useSelector(selectTotalDiscountAmount);
  const appliedPlatformVoucher = useSelector(selectAppliedPlatformVoucher);
  const [isPlatformModalOpen, setPlatformModalOpen] = useState(false);

  // Calculate subtotal from all products in all shops
  const subtotal = Object.values(shopProducts).reduce((total, shopProducts) => {
    return total + shopProducts.reduce((shopTotal, product) => {
      return shopTotal + (product.price * product.quantity);
    }, 0);
  }, 0);

  // For now, shipping is not implemented
  const shippingFee = 0;

  // Calculate the final total
  const totalPayment = subtotal + shippingFee - totalDiscount;

  const handleApplyPlatformVoucher = (voucher: AppliedVoucherInfo) => {
    // The actual application logic is likely in the modal, this is for closing
    setPlatformModalOpen(false);
  };
  
  // Gửi tổng tiền thanh toán lên component cha nếu có callback
  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(totalPayment);
    }
    // Cập nhật tổng số tiền vào Redux state mỗi khi nó thay đổi
    dispatch(setCommonInfo({ amount: totalPayment }));
  }, [totalPayment, onTotalChange, dispatch]);

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
    <div className="bg-white rounded-lg border p-6 space-y-4">
      {/* Platform Voucher Section */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Voucher Sàn</span>
        </div>
        {appliedPlatformVoucher ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
              {appliedPlatformVoucher.code}
            </span>
            <button onClick={() => dispatch(removePlatformVoucher())} className="p-1 hover:bg-gray-200 rounded-full">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setPlatformModalOpen(true)}>
            Chọn hoặc nhập mã
          </Button>
        )}
      </div>

      <h2 className="text-lg font-semibold">Tóm tắt đơn hàng</h2>
      <div className="space-y-2">
        <div className="space-y-3">
          <PriceLine label="Tổng tiền hàng" value={formatCurrency(subtotal)} />
          <PriceLine label="Tổng giảm giá" value={`-${formatCurrency(totalDiscount)}`} />
        </div>

        <PriceLine label="Phí vận chuyển" value={formatCurrency(shippingFee)} />

        <Separator className="my-3" />
        <PriceLine label="Tổng thanh toán" value={formatCurrency(totalPayment)} isBold={true} />
      </div>

      {isPlatformModalOpen && (
        <PlatformVoucherModal 
          isOpen={isPlatformModalOpen}
          onClose={() => setPlatformModalOpen(false)}
          onApplyVoucher={handleApplyPlatformVoucher}
        />
      )}

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
