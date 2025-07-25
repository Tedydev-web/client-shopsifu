'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Book } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useCustomerInfo } from '@/components/client/checkout/hooks/useCustomer-Info';
import { CustomerFormData, Address } from '@/types/checkout.interface';

interface ShippingAddressProps {
  formData: CustomerFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  sameAsCustomer?: boolean;
  onSameAsCustomerChange?: (checked: boolean) => void;
  customerName?: string;
  customerPhone?: string;
  addresses: Address[];
  onSelectExistingAddress: (address: Address) => void;
}

export function ShippingAddress({ 
  formData, 
  handleChange,
  sameAsCustomer = false,
  onSameAsCustomerChange,
  customerName,
  customerPhone,
  addresses,
  onSelectExistingAddress
}: ShippingAddressProps) {
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const {
    customerProvince,
    customerDistrict,
    customerWard,
    customerProvinceName,
    customerDistrictName,
    customerWardName,
    provinces,
    customerDistricts,
    customerWards,
    isLoadingProvinces,
    isLoadingCustomerDistricts,
    isLoadingCustomerWards,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
  } = useCustomerInfo(formData, handleChange);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      onSelectExistingAddress(selectedAddress);
    }
  };

  return (
    <Card className='shadow-none'>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
          <CardTitle className="flex items-center text-base font-semibold">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            Thông tin nhận hàng
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {!isSelectingAddress && addresses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-sm w-full sm:w-auto"
                onClick={() => setIsSelectingAddress(true)}
              >
                <Book className="h-4 w-4 mr-1.5 flex-shrink-0" />
                Chọn địa chỉ có sẵn
              </Button>
            )}
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
              <Label htmlFor="same-as-customer" className="text-xs text-gray-500">
                Lấy thông tin khách hàng
              </Label>
              <Switch
                id="same-as-customer"
                checked={sameAsCustomer}
                onCheckedChange={onSameAsCustomerChange}
              />
            </div>
          </div>
        </div>
        <CardDescription className="text-sm font-light mt-2">
          {isSelectingAddress ? 'Chọn địa chỉ giao hàng có sẵn' : 'Địa chỉ giao hàng của bạn'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="receiverName" className="text-xs font-medium">
                Tên người nhận
              </Label>
              <Input
                id="receiverName"
                name="receiverName"
                placeholder="Nhập tên người nhận"
                value={sameAsCustomer ? customerName : formData.receiverName}
                onChange={handleChange}
                className="text-sm"
                required
                disabled={sameAsCustomer}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="receiverPhone" className="text-xs font-medium">
                Số điện thoại người nhận
              </Label>
              <Input
                id="receiverPhone"
                name="receiverPhone"
                placeholder="Nhập số điện thoại người nhận"
                value={sameAsCustomer ? customerPhone : formData.receiverPhone}
                onChange={handleChange}
                className="text-sm"
                required
                disabled={sameAsCustomer}
              />
            </div>
          </div>

          {isSelectingAddress ? (
            <div className="space-y-3">
              <RadioGroup
                value={selectedAddressId}
                onValueChange={handleAddressSelect}
                className="space-y-3"
              >
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                      selectedAddressId === address.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem 
                      value={address.id} 
                      id={address.id}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={address.id}
                      className="flex-1 cursor-pointer space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                          {address.type}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs text-red-500">MẶC ĐỊNH</span>
                        )}
                      </div>
                      <div className="text-sm">
                        {`${address.addressDetail}, ${address.ward}, ${address.district}, ${address.province}`}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex items-center">
                <span className="text-sm mr-2">hoặc</span>
                <Button
                  variant="link"
                  className="text-red-500 font-normal p-0 h-auto text-sm hover:text-red-600"
                  onClick={() => {
                    setIsSelectingAddress(false);
                    setSelectedAddressId('');
                  }}
                >
                  nhập địa chỉ mới
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="province" className="text-xs font-medium">
                    Tỉnh / Thành phố
                  </Label>
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
                  <Label htmlFor="district" className="text-xs font-medium">
                    Quận / Huyện
                  </Label>
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
                  <Label htmlFor="ward" className="text-xs font-medium">
                    Phường / Xã
                  </Label>
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
                  <Label htmlFor="address" className="text-xs font-medium">
                    Địa chỉ cụ thể
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Số nhà, tên đường, khu vực..."
                    value={formData.address}
                    onChange={handleChange}
                    className="text-sm h-9"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <Label htmlFor="note" className="text-xs font-medium">
              Ghi chú
            </Label>
            <Textarea
              id="note"
              name="note"
              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
              value={formData.note}
              onChange={handleChange}
              className="h-20 text-sm resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
