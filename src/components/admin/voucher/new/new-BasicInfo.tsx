"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { VoucherFormData } from '../hook/useNewVoucher';

interface BasicInfoProps {
  formData: VoucherFormData;
  updateFormData: (field: keyof VoucherFormData, value: any) => void;
  errors: Record<string, string>;
}

export default function VoucherBasicInfo({ formData, updateFormData, errors }: BasicInfoProps) {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const getVoucherTitle = () => {
    return 'Voucher toàn Shop';
  };

  const handleDateSelect = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      updateFormData(field, format(date, 'yyyy-MM-dd'));
    }
    if (field === 'startDate') setStartDateOpen(false);
    if (field === 'endDate') setEndDateOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-2 h-6 bg-red-500 rounded-sm" />
          Thông tin cơ bản
        </CardTitle>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium">
            Loại mã
          </span>
          <span className="text-red-600 font-medium">{getVoucherTitle()}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tên chương trình giảm giá */}
        <div className="space-y-2">
          <Label htmlFor="voucher-name" className="text-sm font-medium">
            Tên chương trình giảm giá
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="voucher-name"
              placeholder="Tên Voucher 28 không được hiển thị cho Người mua"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className={cn(
                "pr-16",
                errors.name && "border-red-500 focus:border-red-500"
              )}
              maxLength={100}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {formData.name.length}/100
            </span>
          </div>
          {errors.name && (
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </div>
          )}
        </div>

        {/* Mã voucher */}
        <div className="space-y-2">
          <Label htmlFor="voucher-code" className="text-sm font-medium">
            Mã voucher
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="voucher-code"
              placeholder="DARK"
              value={formData.code}
              onChange={(e) => updateFormData('code', e.target.value.toUpperCase())}
              className={cn(
                "pr-16",
                errors.code && "border-red-500 focus:border-red-500"
              )}
              maxLength={20}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {formData.code.length}/20
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Vui lòng chỉ nhập các ký tự chữ cái (a-z), số (0-9), dấu gạch dưới (_) và dấu gạch ngang (-). Mã giảm giá đây chỉ có thể DARK
          </p>
          {errors.code && (
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              {errors.code}
            </div>
          )}
        </div>

        {/* Thời gian sử dụng mã */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Thời gian sử dụng mã
            <span className="text-red-500 ml-1">*</span>
          </Label>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Ngày bắt đầu */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Từ</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                      errors.startDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(new Date(formData.startDate), 'dd/MM/yyyy', { locale: vi })
                    ) : (
                      "14:05 08-08-2025"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate ? new Date(formData.startDate) : undefined}
                    onSelect={(date) => handleDateSelect('startDate', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {errors.startDate}
                </div>
              )}
            </div>

            {/* Ngày kết thúc */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Đến</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                      errors.endDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(new Date(formData.endDate), 'dd/MM/yyyy', { locale: vi })
                    ) : (
                      "15:05 08-08-2025"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {errors.endDate}
                </div>
              )}
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            Cho phép lưu mã trước Thời gian sử dụng
          </p>
        </div>
      </CardContent>
    </Card>
  );
}