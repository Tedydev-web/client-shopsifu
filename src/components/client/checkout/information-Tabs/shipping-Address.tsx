'use client';

import { useState, useEffect } from 'react';
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
import { addressService } from '@/services/addressService';
import { Address as ProfileAddress } from '@/types/auth/profile.interface';
import { useProvinces } from '@/hooks/combobox/useProvinces';

interface ShippingAddressProps {
  formData: CustomerFormData;
  handleChange: (nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => void;
  addresses?: Address[];
  onSelectExistingAddress: (address: Address) => void;
}

export function ShippingAddress({ 
  formData, 
  handleChange,
  addresses,
  onSelectExistingAddress
}: ShippingAddressProps) {
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const [savedAddresses, setSavedAddresses] = useState<ProfileAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  
  // Move the hook call to the component top level
  const {
    getProvinceName,
    getDistrictName,
    getWardName
  } = useProvinces();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const response = await addressService.getAll();
        if (response.data) {
          setSavedAddresses(response.data);
          
          // Xóa phần tự động chọn địa chỉ mặc định
          // Chỉ hiển thị các địa chỉ và để người dùng chọn
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track formData changes
  useEffect(() => {
    // Monitor formData changes silently
  }, [formData]);
  
  // Theo dõi khi selectedAddressId thay đổi để cập nhật dữ liệu - 
  // Chỉ log thông tin, KHÔNG gọi onSelectExistingAddress vì đã gọi trong handleAddressSelect
  useEffect(() => {
    if (selectedAddressId && isSelectingAddress) {
      const selected = savedAddresses.find(addr => addr.id === selectedAddressId);
      if (selected) {
        // Address selected by ID change
        
        // Chỉ log thông tin, không thực hiện cập nhật ở đây để tránh vòng lặp vô hạn
        const provinceName = getProvinceName(selected.province);
        const districtName = getDistrictName(selected.district);
        const wardName = getWardName(selected.ward);
        
        console.log('[ShippingAddress] Selected address details:', {
          province: `${selected.province}|${provinceName || selected.province}`,
          district: `${selected.district}|${districtName || selected.district}`,
          ward: `${selected.ward}|${wardName || selected.ward}`,
        });
        
        // KHÔNG gọi onSelectExistingAddress ở đây vì đã được gọi trong handleAddressSelect
      }
    }
  }, [selectedAddressId, isSelectingAddress, savedAddresses, getProvinceName, getDistrictName, getWardName]);
  
  // Theo dõi khi isSelectingAddress thay đổi để xử lý chuyển đổi giữa các chế độ
  useEffect(() => {
    if (!isSelectingAddress) {
      // Nếu chuyển từ chọn địa chỉ có sẵn sang nhập địa chỉ mới
      console.log('[ShippingAddress] Switching to manual address input mode');
      setSelectedAddressId('');
      
      // Không cần gửi sự kiện reset ở đây vì đã xử lý trong nút "nhập địa chỉ mới"
    }
  }, [isSelectingAddress]);
  
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

  const handleAddressSelect = (id: string) => {
    // First update the ID in our local state
    setSelectedAddressId(id);
    
    const selected = savedAddresses.find((addr) => addr.id === id);
    if (selected) {
      // Log thông tin địa chỉ được chọn để debug
      console.log('[ShippingAddress] Selected address:', selected);
      
      // Make sure we're in selecting address mode
      if (!isSelectingAddress) {
        setIsSelectingAddress(true);
      }
      
      // Tạo đối tượng địa chỉ để cập nhật form
      // Format các trường province, district, ward để phù hợp với useCustomer-Info hook
      // (định dạng code|name)
      
      // Lấy tên của tỉnh/thành phố, quận/huyện, phường/xã từ code
      // Using the functions from the hook that's now called at component level
      const provinceName = getProvinceName(selected.province);
      const districtName = getDistrictName(selected.district);
      const wardName = getWardName(selected.ward);
      
      // Ensure we have valid names, or fall back to the code values
      const addressToUpdate: Address = {
        id: selected.id,
        isDefault: selected.isDefault,
        receiverName: selected.recipient || selected.name || '',
        receiverPhone: selected.phoneNumber || '',
        addressDetail: selected.street,
        // Định dạng địa chỉ với cả code và name: "code|name"
        ward: `${selected.ward}|${wardName || selected.ward}`,
        district: `${selected.district}|${districtName || selected.district}`,
        province: `${selected.province}|${provinceName || selected.province}`,
        type: selected.addressType === 'HOME' ? 'NHÀ RIÊNG' : 'VĂN PHÒNG',
      };
      
      console.log('[ShippingAddress] Address to update:', addressToUpdate);
      
      // Schedule the update to run after the current render cycle
      setTimeout(() => {
        // Gọi hàm cập nhật từ component cha - sử dụng setTimeout để tránh vòng lặp cập nhật
        onSelectExistingAddress(addressToUpdate);
      }, 0);
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
            {!isSelectingAddress && savedAddresses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-sm w-full sm:w-auto"
                onClick={() => {
                  // Đánh dấu chuyển sang chế độ chọn địa chỉ có sẵn
                  setIsSelectingAddress(true);
                  
                  // Không tự động chọn địa chỉ nào, để người dùng tự chọn
                  // Clear any previously selected address
                  if (selectedAddressId) {
                    setSelectedAddressId('');
                  }
                }}
              >
                <Book className="h-4 w-4 mr-1.5 flex-shrink-0" />
                Chọn địa chỉ có sẵn
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="text-sm font-light mt-2">
          {isSelectingAddress ? 'Chọn địa chỉ giao hàng có sẵn' : 'Địa chỉ giao hàng của bạn'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Luôn hiển thị trường tên người nhận và số điện thoại, ngay cả khi đang chọn địa chỉ có sẵn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="receiverName" className="text-xs font-medium">
                Tên người nhận
              </Label>
              <Input
                id="receiverName"
                name="receiverName"
                placeholder="Nhập tên người nhận"
                value={formData.receiverName || ''}
                onChange={handleChange}
                className="text-sm"
                required
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
                value={formData.receiverPhone || ''}
                onChange={handleChange}
                className="text-sm"
                required
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
                {isLoadingAddresses ? (
                  <p>Đang tải địa chỉ...</p>
                ) : (
                  savedAddresses.map((address) => (
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
                          {address.addressType === 'HOME' ? 'Nhà riêng' : 'Văn phòng'}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs text-red-500">MẶC ĐỊNH</span>
                        )}
                      </div>
                      <div className="text-sm">
                        {`${address.street}, ${address.ward}, ${address.district}, ${address.province}`}
                      </div>
                    </Label>
                  </div>
                ))
              )}
              </RadioGroup>
              <div className="flex items-center">
                <span className="text-sm mr-2">hoặc</span>
                <Button
                  variant="link"
                  className="text-red-500 font-normal p-0 h-auto text-sm hover:text-red-600"
                  onClick={() => {
                    // First update our local state
                    setIsSelectingAddress(false);
                    setSelectedAddressId('');
                    
                    // Khi chuyển sang nhập địa chỉ mới, xóa thông tin địa chỉ cũ
                    const clearedAddressData: Address = {
                      id: '',
                      receiverName: formData.receiverName, // Giữ lại tên người nhận
                      receiverPhone: formData.receiverPhone, // Giữ lại số điện thoại
                      addressDetail: '', // Xóa thông tin địa chỉ
                      ward: '',
                      district: '',
                      province: '',
                      type: 'NHÀ RIÊNG', // Giá trị mặc định
                      isDefault: false
                    };
                    
                    // Schedule the update to run after the current render cycle
                    setTimeout(() => {
                      // Gọi hàm từ component cha để cập nhật lại formData - sử dụng setTimeout để tránh vòng lặp cập nhật
                      onSelectExistingAddress(clearedAddressData);
                    }, 0);
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
