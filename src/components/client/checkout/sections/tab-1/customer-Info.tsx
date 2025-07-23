'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, Phone, MapPin } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useCustomerInfo } from '@/components/client/checkout/hooks/useCustomer-Info';

// Tỉnh/thành, quận/huyện, phường/xã được quản lý bởi useCustomerInfo hook

interface CustomerInfoProps {
  formData: {
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    note: string;
    saveInfo: boolean;
    receiverName?: string;
    receiverPhone?: string;
    province?: string;
    district?: string;
    ward?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (checked: boolean) => void;
  isLoggedIn?: boolean; // Thêm prop để kiểm tra trạng thái đăng nhập
}

export function CustomerInfo({ formData, handleChange, handleCheckboxChange, isLoggedIn = true }: CustomerInfoProps) {
  // Debug log để kiểm tra formData
  console.log('🎯 CustomerInfo formData:', {
    province: formData.province,
    district: formData.district,  
    ward: formData.ward
  });

  // Sử dụng hook useCustomerInfo để quản lý toàn bộ logic
  const {
    // States
    sameAsCustomer,
    customerProvince,
    customerDistrict,
    customerWard,
    customerProvinceName,
    customerDistrictName,
    customerWardName,
    shippingProvince,
    shippingDistrict,
    shippingWard,
    shippingProvinceName,
    shippingDistrictName,
    shippingWardName,
    
    // Data from hooks
    provinces,
    customerDistricts,
    customerWards,
    shippingDistricts,
    shippingWards,
    
    // Loading states
    isLoadingProvinces,
    isLoadingCustomerDistricts,
    isLoadingCustomerWards,
    isLoadingShippingDistricts,
    isLoadingShippingWards,
    
    // Error
    provincesError,
    
    // Handlers
    handleSameAsCustomerChange,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleShippingProvinceChange,
    handleShippingDistrictChange,
    handleShippingWardChange
  } = useCustomerInfo(formData, handleChange);
  
  return (
    <div className="space-y-6">
      {/* Phần 1: Thông tin khách hàng */}
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

      {/* Phần 2: Thông tin nhận hàng */}
      <Card className='shadow-none'>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base font-semibold">
            <MapPin className="h-4 w-4 mr-2" />
            Thông tin nhận hàng
          </CardTitle>
          <div className="flex items-center justify-between">
            <CardDescription className="text-sm font-light">
              Địa chỉ giao hàng của bạn
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Label htmlFor="same-as-customer" className="text-xs text-gray-500">Lấy thông tin khách hàng</Label>
              <Switch
                id="same-as-customer"
                checked={sameAsCustomer}
                onCheckedChange={handleSameAsCustomerChange}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="receiverName" className="text-xs font-medium">Tên người nhận</Label>
                <Input
                  id="receiverName"
                  name="receiverName"
                  placeholder="Nhập tên người nhận"
                  value={formData.receiverName || formData.fullName}
                  onChange={handleChange}
                  className="text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="receiverPhone" className="text-xs font-medium">Số điện thoại người nhận</Label>
                <Input
                  id="receiverPhone"
                  name="receiverPhone"
                  placeholder="Nhập số điện thoại người nhận"
                  value={formData.receiverPhone || formData.phoneNumber}
                  onChange={handleChange}
                  className="text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="province" className="text-xs font-medium">Tỉnh / Thành phố</Label>
                <Select 
                    value={customerProvince} 
                    onValueChange={handleProvinceChange}
                    disabled={isLoadingProvinces}
                    >
                    <SelectTrigger className="text-sm h-9 w-full">
                        {isLoadingProvinces ? (
                        <div className="flex items-center">
                            <Spinner size="sm" className="mr-2" />
                            <span>Đang tải...</span>
                        </div>
                        ) : (
                        <SelectValue placeholder="Chọn tỉnh/thành phố">
                          {customerProvinceName || (customerProvince ? provinces.find(p => p.value === customerProvince)?.label || "Đang tải..." : "")}
                        </SelectValue>
                        )}
                    </SelectTrigger>
                    <SelectContent>
                        {provinces.map((province) => (
                        <SelectItem key={province.value} value={province.value} className="text-sm">
                            {province.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="district" className="text-xs font-medium">Quận / Huyện</Label>
                <Select 
                  value={customerDistrict} 
                  onValueChange={handleDistrictChange}
                  disabled={!customerProvince || isLoadingCustomerDistricts}
                >
                  <SelectTrigger className="text-sm h-9 w-full">
                    {isLoadingCustomerDistricts ? (
                      <div className="flex items-center">
                        <Spinner size="sm" className="mr-2" />
                        <span>Đang tải...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Chọn quận/huyện">
                        {customerDistrictName || (customerDistrict ? customerDistricts.find(d => d.value === customerDistrict)?.label || "Đang tải..." : "")}
                      </SelectValue>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {customerDistricts.map((district) => (
                      <SelectItem key={district.value} value={district.value} className="text-sm">
                        {district.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="ward" className="text-xs font-medium">Phường / Xã</Label>
                <Select 
                  value={customerWard} 
                  onValueChange={handleWardChange}
                  disabled={!customerDistrict || isLoadingCustomerWards}
                >
                  <SelectTrigger className="text-sm h-9 w-full">
                    {isLoadingCustomerWards ? (
                      <div className="flex items-center">
                        <Spinner size="sm" className="mr-2" />
                        <span>Đang tải...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Chọn phường/xã">
                        {customerWardName || (customerWard ? customerWards.find(w => w.value === customerWard)?.label || "Đang tải..." : "")}
                      </SelectValue>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {customerWards.map((ward) => (
                      <SelectItem key={ward.value} value={ward.value} className="text-sm">
                        {ward.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="address" className="text-xs font-medium">Địa chỉ cụ thể</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Số nhà, tên đường, khu vực..."
                  value={formData.address}
                  onChange={handleChange}
                  className="text-sm h-9"
                  required
                />
                {/* Field hiển thị địa chỉ đã chọn */}
                {(customerProvinceName || customerDistrictName || customerWardName) && (
                  <div className="text-xs text-gray-500 mt-1">
                    {[customerWardName, customerDistrictName, customerProvinceName]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="note" className="text-xs font-medium">Ghi chú</Label>
              <Textarea
                id="note"
                name="note"
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                value={formData.note}
                onChange={handleChange}
                className="h-20 text-sm resize-none"
              />
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox 
                id="saveInfo" 
                checked={formData.saveInfo}
                onCheckedChange={handleCheckboxChange}
                className="h-4 w-4"
              />
              <Label htmlFor="saveInfo" className="text-xs">Lưu thông tin cho lần thanh toán sau</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
