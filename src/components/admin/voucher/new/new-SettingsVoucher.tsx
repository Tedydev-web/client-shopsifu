"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoucherFormData, VoucherUseCase } from '../hook/useNewVoucher';

interface DiscountSettingsProps {
  formData: VoucherFormData;
  updateFormData: (field: keyof VoucherFormData, value: any) => void;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
  voucherType: string;
}

export default function VoucherDiscountSettings({ formData, updateFormData, errors, useCase, voucherType }: DiscountSettingsProps) {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const parseCurrency = (value: string) => {
    return parseInt(value.replace(/[^0-9]/g, '')) || 0;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-2 h-6 bg-red-500 rounded-sm" />
          Thiết lập mã giảm giá
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Loại Voucher */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Loại Voucher
            <span className="text-red-500 ml-1">*</span>
          </Label>
          
          <RadioGroup 
            value={formData.discountType} 
            onValueChange={(value) => updateFormData('discountType', value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" className="text-red-600" />
              <Label htmlFor="percentage" className="text-sm font-medium cursor-pointer">
                Khuyến Mãi
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" className="text-red-600" />
              <Label htmlFor="fixed" className="text-sm font-medium cursor-pointer">
                Hoàn Xu
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Mã giảm giá thông minh */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Mã giảm giá thông minh
              <Info className="w-4 h-4 inline ml-1 text-gray-400" />
            </Label>
            <Switch 
              checked={formData.isPrivate}
              onCheckedChange={(checked) => updateFormData('isPrivate', checked)}
            />
          </div>
        </div>

        {/* Loại giảm giá */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Loại giảm giá | Mức giảm
            <span className="text-red-500 ml-1">*</span>
          </Label>
          
          <div className="flex items-center gap-4">
            <Select value="percentage" onValueChange={() => {}}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Theo số lượng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Theo số lượng</SelectItem>
                <SelectItem value="fixed">Theo giá trị</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex-1">
              <Input
                type="number"
                placeholder="0"
                value={formData.discountValue || ''}
                onChange={(e) => updateFormData('discountValue', parseFloat(e.target.value) || 0)}
                className={cn(
                  errors.discountValue && "border-red-500 focus:border-red-500"
                )}
                min="0"
                max={formData.discountType === 'percentage' ? "100" : undefined}
              />
              {errors.discountValue && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.discountValue}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Giá trị đơn hàng tối thiểu */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Giá trị đơn hàng tối thiểu
            <span className="text-red-500 ml-1">*</span>
          </Label>
          
          <div className="relative">
            <Input
              placeholder="0"
              value={formData.minOrderValue ? formatCurrency(formData.minOrderValue) : ''}
              onChange={(e) => updateFormData('minOrderValue', parseCurrency(e.target.value))}
              className={cn(
                "pr-8",
                errors.minOrderValue && "border-red-500 focus:border-red-500"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              ₫
            </span>
          </div>
          {errors.minOrderValue && (
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.minOrderValue}
            </div>
          )}
        </div>

        {/* Tổng lượt sử dụng tối đa */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Tổng lượt sử dụng tối đa
            <span className="text-red-500 ml-1">*</span>
          </Label>
          
          <Input
            type="number"
            placeholder="1"
            value={formData.usageLimit || ''}
            onChange={(e) => updateFormData('usageLimit', parseInt(e.target.value) || 1)}
            className={cn(
              errors.usageLimit && "border-red-500 focus:border-red-500"
            )}
            min="1"
          />
          <p className="text-xs text-gray-500">
            Tổng số lượt mã giảm giá có thể được sử dụng
          </p>
          {errors.usageLimit && (
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.usageLimit}
            </div>
          )}
        </div>

        {/* Lượt sử dụng tối đa/Người mua */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Lượt sử dụng tối đa/Người mua
            <span className="text-red-500 ml-1">*</span>
          </Label>
          
          <Input
            type="number"
            placeholder="1"
            value={formData.usagePerUser || ''}
            onChange={(e) => updateFormData('usagePerUser', parseInt(e.target.value) || 1)}
            className={cn(
              errors.usagePerUser && "border-red-500 focus:border-red-500"
            )}
            min="1"
          />
          {errors.usagePerUser && (
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.usagePerUser}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}