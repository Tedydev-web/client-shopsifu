'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface InformationTabsProps {
  onNext: () => void;
}

export function InformationTabs({ onNext }: InformationTabsProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    note: '',
    saveInfo: false,
    deliveryMethod: 'standard'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, saveInfo: checked }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryMethod: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trong trường hợp thật, sẽ có validate form ở đây
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
          <CardDescription>
            Vui lòng điền đầy đủ thông tin để chúng tôi có thể giao hàng cho bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ tên</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Nhập họ tên đầy đủ"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Nhập số điện thoại"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                name="address"
                placeholder="Nhập địa chỉ đầy đủ"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                name="note"
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                value={formData.note}
                onChange={handleChange}
                className="h-24"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="saveInfo" 
                checked={formData.saveInfo}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="saveInfo">Lưu thông tin cho lần thanh toán sau</Label>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phương thức vận chuyển</CardTitle>
          <CardDescription>
            Chọn phương thức vận chuyển phù hợp với bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={formData.deliveryMethod}
            onValueChange={handleRadioChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="standard" id="delivery-standard" />
              <div className="flex-1">
                <Label htmlFor="delivery-standard" className="flex justify-between cursor-pointer">
                  <div>
                    <div className="font-medium">Giao hàng tiêu chuẩn</div>
                    <div className="text-sm text-gray-500">Nhận hàng trong 3-5 ngày</div>
                  </div>
                  <div className="font-medium">30.000₫</div>
                </Label>
              </div>
            </div>
            <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="express" id="delivery-express" />
              <div className="flex-1">
                <Label htmlFor="delivery-express" className="flex justify-between cursor-pointer">
                  <div>
                    <div className="font-medium">Giao hàng nhanh</div>
                    <div className="text-sm text-gray-500">Nhận hàng trong 1-2 ngày</div>
                  </div>
                  <div className="font-medium">50.000₫</div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext} size="lg">
          Tiếp tục thanh toán
        </Button>
      </div>
    </div>
  );
}
