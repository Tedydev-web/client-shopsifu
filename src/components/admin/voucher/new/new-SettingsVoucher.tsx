"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Info, Settings, Percent, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoucherFormData, VoucherUseCase } from '../hook/useNewVoucher';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

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

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1.5 text-red-500 text-xs mt-1">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  };

  const RequiredLabel = ({ children, icon: Icon, htmlFor }: { children: React.ReactNode; icon?: any; htmlFor?: string }) => (
    <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {children}
      <span className="text-red-500">*</span>
    </Label>
  );

  const InfoLabel = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {children}
      <div className="group relative">
        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Tự động tối ưu hiệu quả voucher
        </div>
      </div>
    </Label>
  );

  const [isMaxDiscountLimited, setIsMaxDiscountLimited] = useState(true);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, '');
    if (!isNaN(Number(rawValue))) {
      updateFormData('discountValue', Number(rawValue));
    }
  };

  const handleMaxDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, '');
    if (!isNaN(Number(rawValue))) {
      updateFormData('maxDiscountValue', Number(rawValue));
    }
  };

  return (
    <Card className="w-full border-0 shadow-sm bg-white">
      <CardHeader className="pb-6 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
          <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
          Thiết lập mã giảm giá
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Mã giảm giá thông minh */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <InfoLabel icon={Settings}>
              Mã giảm giá thông minh
            </InfoLabel>
            <Switch 
              checked={formData.isPrivate}
              onCheckedChange={(checked) => updateFormData('isPrivate', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          <p className="text-xs text-gray-500 ml-6">
            Hệ thống sẽ tự động tối ưu hiệu quả sử dụng voucher
          </p>
        </div>

        {/* Loại giảm giá & Mức giảm */}
        <div className="space-y-4">
          <RequiredLabel icon={Percent}>
            Loại giảm giá & Mức giảm
          </RequiredLabel>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Loại giảm
              </Label>
              <RadioGroup
                value={formData.discountType || 'percentage'}
                onValueChange={(value) => updateFormData('discountType', value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage">Theo phần trăm</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed">Theo giá trị</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Mức giảm
              </Label>
              <div className="relative">
                <Input
                  type={formData.discountType === 'percentage' ? 'number' : 'text'}
                  placeholder="Nhập mức giảm giá..."
                  value={formData.discountType === 'percentage' ? formData.discountValue || '' : formatCurrency(formData.discountValue || '')}
                  onChange={handleValueChange}
                  className={cn(
                    "h-11 pr-12 transition-all duration-200",
                    "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                    errors.discountValue && "border-red-500 focus:border-red-500 focus:ring-red-100"
                  )}
                  min="0"
                  max={formData.discountType === 'percentage' ? "100" : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                  {formData.discountType === 'percentage' ? '%' : '₫'}
                </span>
              </div>
              <ErrorMessage error={errors.discountValue} />
            </div>
          </div>
        </div>

        {formData.discountType === 'percentage' && (
          <div className="space-y-3 p-4 border rounded-md bg-gray-50/50">
            <Label className="text-sm font-medium">Mức giảm tối đa</Label>
            <RadioGroup
              value={isMaxDiscountLimited ? 'limited' : 'unlimited'}
              onValueChange={(value) => setIsMaxDiscountLimited(value === 'limited')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limited" id="limited" />
                <Label htmlFor="limited">Giới hạn</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unlimited" id="unlimited" />
                <Label htmlFor="unlimited">Không giới hạn</Label>
              </div>
            </RadioGroup>
            {isMaxDiscountLimited && (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Nhập số tiền giảm tối đa"
                  value={formatCurrency(formData.maxDiscountValue || '')}
                  onChange={handleMaxDiscountChange}
                  className="pr-12"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">VNĐ</span>
              </div>
            )}
          </div>
        )}

        {/* Điều kiện đơn hàng */}
        <div className="space-y-4">
          <RequiredLabel icon={ShoppingCart}>
            Giá trị đơn hàng tối thiểu
          </RequiredLabel>
          
          <div className="relative">
            <Input
              placeholder="Nhập giá trị tối thiểu..."
              value={formData.minOrderValue ? formatCurrency(formData.minOrderValue) : ''}
              onChange={(e) => updateFormData('minOrderValue', parseCurrency(e.target.value))}
              className={cn(
                "h-11 pr-12 transition-all duration-200",
                "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                errors.minOrderValue && "border-red-500 focus:border-red-500 focus:ring-red-100"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
              ₫
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Đơn hàng phải đạt giá trị này để áp dụng voucher
          </p>
          <ErrorMessage error={errors.minOrderValue} />
        </div>

        {/* Giới hạn sử dụng */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Giới hạn sử dụng</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tổng lượt sử dụng */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Tổng lượt sử dụng tối đa
                <span className="text-red-500">*</span>
              </Label>
              
              <Input
                type="number"
                placeholder="VD: 100"
                value={formData.usageLimit || ''}
                onChange={(e) => updateFormData('usageLimit', parseInt(e.target.value) || 1)}
                className={cn(
                  "h-11 transition-all duration-200",
                  "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                  errors.usageLimit && "border-red-500 focus:border-red-500 focus:ring-red-100"
                )}
                min="1"
              />
              <p className="text-xs text-gray-500">
                Tổng số lần voucher có thể được sử dụng
              </p>
              <ErrorMessage error={errors.usageLimit} />
            </div>

            {/* Lượt sử dụng per user */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Lượt sử dụng/Người mua
                <span className="text-red-500">*</span>
              </Label>
              
              <Input
                type="number"
                placeholder="VD: 1"
                value={formData.usagePerUser || ''}
                onChange={(e) => updateFormData('usagePerUser', parseInt(e.target.value) || 1)}
                className={cn(
                  "h-11 transition-all duration-200",
                  "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                  errors.usagePerUser && "border-red-500 focus:border-red-500 focus:ring-red-100"
                )}
                min="1"
              />
              <p className="text-xs text-gray-500">
                Số lần tối đa một khách hàng có thể sử dụng
              </p>
              <ErrorMessage error={errors.usagePerUser} />
            </div>
          </div>
        </div>

        {/* Thông tin tổng quan */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Tóm tắt thiết lập
              </p>
              <p className="text-xs text-gray-600">
                {formData.discountValue && formData.minOrderValue ? 
                  `Giảm ${formData.discountValue}${formData.discountType === 'percentage' ? '%' : '₫'} cho đơn hàng từ ${formatCurrency(formData.minOrderValue)}₫` :
                  'Vui lòng điền đầy đủ thông tin để xem tóm tắt'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}