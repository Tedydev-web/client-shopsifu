'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface CustomerInfoProps {
  formData: {
    fullName: string;
    phoneNumber: string;
    email: string;
    saveInfo: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLoggedIn?: boolean;
}

export function CustomerInfo({ formData, handleChange, isLoggedIn = true }: CustomerInfoProps) {
  return (
    <Card className='shadow-none'>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base font-semibold">
          <User className="h-4 w-4 mr-2" /> 
          Thông tin khách hàng
        </CardTitle>
        <CardDescription className="text-sm font-light">
          {isLoggedIn 
            ? "Thông tin của bạn đã được lưu từ tài khoản" 
            : "Vui lòng nhập thông tin của bạn"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-xs font-medium">Họ tên</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Nhập họ tên đầy đủ"
                value={formData.fullName}
                onChange={handleChange}
                readOnly={isLoggedIn}
                className={`${isLoggedIn ? "bg-gray-100" : ""} text-sm`}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phoneNumber" className="text-xs font-medium">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Nhập số điện thoại"
                value={formData.phoneNumber}
                onChange={handleChange}
                readOnly={isLoggedIn}
                className={`${isLoggedIn ? "bg-gray-100" : ""} text-sm`}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              readOnly={isLoggedIn}
              className={`${isLoggedIn ? "bg-gray-100" : ""} text-sm`}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
