"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, AlertCircle, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { VoucherFormState } from '../hook/useNewVoucher';
import { VoucherUseCase } from '../hook/voucher-config';

interface BasicInfoProps {
  formData: VoucherFormState;
  updateFormData: (field: keyof VoucherFormState, value: any) => void;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
}

const getVoucherTypeName = (useCase: VoucherUseCase) => {
  switch (useCase) {
    case VoucherUseCase.SHOP:
      return 'Voucher toàn Shop';
    case VoucherUseCase.PRODUCT:
      return 'Voucher sản phẩm';
    case VoucherUseCase.PRIVATE:
      return 'Voucher riêng tư';
    default:
      return 'Voucher';
  }
};

export default function VoucherBasicInfo({ formData, updateFormData, errors, useCase }: BasicInfoProps) {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleDateSelect = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      updateFormData(field, format(date, 'yyyy-MM-dd'));
    }
    if (field === 'startDate') setStartDateOpen(false);
    if (field === 'endDate') setEndDateOpen(false);
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

  const RequiredLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-900 flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <Card className="w-full border-0 shadow-sm bg-white">
      <CardHeader className="pb-6 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
          <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
          Thông tin cơ bản
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
            <Tag className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs font-medium text-red-700">{getVoucherTypeName(useCase)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Tên chương trình giảm giá */}
        <div className="space-y-2">
          <RequiredLabel htmlFor="voucher-name">
            Tên chương trình giảm giá
          </RequiredLabel>
          <div className="relative">
            <Input
              id="voucher-name"
              placeholder="Nhập tên chương trình giảm giá..."
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className={cn(
                "pr-16 h-11 transition-all duration-200 text-gray-900",
                "border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                errors.name && "border-red-500 focus:border-red-500 focus:ring-red-100"
              )}
              maxLength={100}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full transition-colors",
                formData.name.length > 90 ? "bg-red-100 text-red-600" :
                formData.name.length > 70 ? "bg-orange-100 text-orange-600" :
                "bg-gray-100 text-gray-600"
              )}>
                {formData.name.length}/100
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Tên này không được hiển thị cho người mua
          </p>
          <ErrorMessage error={errors.name} />
        </div>

        {/* Mã voucher */}
        <div className="space-y-2">
          <RequiredLabel htmlFor="voucher-code">
            Mã voucher
          </RequiredLabel>
          <div className="relative">
            <Input
              id="voucher-code"
              placeholder="VD: GIAMGIA50, FREESHIP..."
              value={formData.code}
              onChange={(e) => updateFormData('code', e.target.value.toUpperCase())}
              className={cn(
                "pr-16 h-11 font-mono transition-all duration-200 text-gray-900",
                "border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                errors.code && "border-red-500 focus:border-red-500 focus:ring-red-100"
              )}
              maxLength={20}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full transition-colors",
                formData.code.length > 15 ? "bg-red-100 text-red-600" :
                formData.code.length > 10 ? "bg-orange-100 text-orange-600" :
                "bg-gray-100 text-gray-600"
              )}>
                {formData.code.length}/20
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Chỉ được sử dụng chữ cái (a-z), số (0-9), dấu gạch dưới (_) và dấu gạch ngang (-)
          </p>
          <ErrorMessage error={errors.code} />
        </div>

        {/* Thời gian sử dụng mã */}
        <div className="space-y-4">
          <RequiredLabel>
            Thời gian sử dụng
          </RequiredLabel>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ngày bắt đầu */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Từ ngày
              </Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal transition-all duration-200",
                      "border-gray-300 hover:border-red-300 hover:bg-red-50",
                      !formData.startDate && "text-gray-500",
                      formData.startDate && "text-gray-900",
                      errors.startDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
                    {formData.startDate ? (
                      format(new Date(formData.startDate), 'dd/MM/yyyy', { locale: vi })
                    ) : (
                      "Chọn ngày bắt đầu"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-lg border-gray-200" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate ? new Date(formData.startDate) : undefined}
                    onSelect={(date) => handleDateSelect('startDate', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="rounded-lg"
                  />
                </PopoverContent>
              </Popover>
              <ErrorMessage error={errors.startDate} />
            </div>

            {/* Ngày kết thúc */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Đến ngày
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal transition-all duration-200",
                      "border-gray-300 hover:border-red-300 hover:bg-red-50",
                      !formData.endDate && "text-gray-500",
                      formData.endDate && "text-gray-900",
                      errors.endDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
                    {formData.endDate ? (
                      format(new Date(formData.endDate), 'dd/MM/yyyy', { locale: vi })
                    ) : (
                      "Chọn ngày kết thúc"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-lg border-gray-200" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate ? new Date(formData.endDate) : undefined}
                    onSelect={(date) => handleDateSelect('endDate', date)}
                    disabled={(date) => {
                      const today = new Date();
                      const startDate = formData.startDate ? new Date(formData.startDate) : today;
                      return date < today || date < startDate;
                    }}
                    initialFocus
                    className="rounded-lg"
                  />
                </PopoverContent>
              </Popover>
              <ErrorMessage error={errors.endDate} />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-800 flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
              <span>Voucher có thể được lưu trước thời gian sử dụng</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}