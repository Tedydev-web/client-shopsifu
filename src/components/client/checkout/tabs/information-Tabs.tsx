'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CustomerInfo } from '../sections/tab-1/customer-Info';
import { ShippingAddress } from '../sections/tab-1/shipping-Address';
import { ShippingType } from '../sections/tab-1/shipping-Type';
import { useCheckout } from '../hooks/useCheckout';
import { CustomerFormData, Address, ShippingAddress as ShippingAddressType } from '@/types/checkout.interface';

interface InformationTabsProps {
  onNext: () => void;
}

// Mock data cho địa chỉ có sẵn - trong thực tế sẽ lấy từ API
const mockAddresses: Address[] = [
  {
    id: '1',
    isDefault: true,
    receiverName: 'Nguyễn Phát',
    receiverPhone: '0379157360',
    addressDetail: '214 nguyễn phúc chu',
    ward: 'Phường Tráng Dài',
    district: 'Thành phố Biên Hòa',
    province: 'Đồng Nai',
    type: 'NHÀ RIÊNG'
  },
  {
    id: '2',
    isDefault: false,
    receiverName: 'Nguyễn Phát',
    receiverPhone: '0379157360',
    addressDetail: '456 Đường DEF',
    ward: 'Phường UVW',
    district: 'Quận 2',
    province: 'TP. Hồ Chí Minh',
    type: 'VĂN PHÒNG'
  }
];

export function InformationTabs({ onNext }: InformationTabsProps) {
  const { updateCustomerInfo, updateShippingMethod, updateShippingAddress } = useCheckout();
  const [sameAsCustomer, setSameAsCustomer] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  const [formData, setFormData] = useState<CustomerFormData>({
    // Customer Info
    fullName: '',
    phoneNumber: '',
    email: '',
    saveInfo: false,
    // Shipping Info
    receiverName: '',
    receiverPhone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    note: '',
    deliveryMethod: 'standard'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Reset selected address when manually entering new address
    setSelectedAddress(null);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, saveInfo: checked }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryMethod: value }));
  };

  const handleSameAsCustomerChange = (checked: boolean) => {
    setSameAsCustomer(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        receiverName: prev.fullName,
        receiverPhone: prev.phoneNumber
      }));
    }
  };

  const handleSelectExistingAddress = (address: Address) => {
    setSelectedAddress(address);
    setFormData(prev => ({
      ...prev,
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
      province: address.province,
      district: address.district,
      ward: address.ward,
      address: address.addressDetail
    }));
  };

  const handleSubmit = () => {
    // Cập nhật thông tin khách hàng vào context
    const customerInfo = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phoneNumber,
    };
    updateCustomerInfo(customerInfo);
    
    // Cập nhật phương thức vận chuyển
    updateShippingMethod(formData.deliveryMethod === 'standard' ? 'delivery' : 'delivery');
    
    // Cập nhật địa chỉ giao hàng
    const shippingAddress = {
      // Thông tin người nhận luôn lấy từ form input
      receiverName: sameAsCustomer ? formData.fullName : formData.receiverName || '',
      receiverPhone: sameAsCustomer ? formData.phoneNumber : formData.receiverPhone || '',
      
      // Địa chỉ có thể từ địa chỉ có sẵn hoặc form input
      ...(selectedAddress 
        ? {
              // Nếu đã chọn địa chỉ có sẵn, sử dụng trực tiếp
            addressDetail: selectedAddress.addressDetail,
            ward: selectedAddress.ward,
            district: selectedAddress.district,
            province: selectedAddress.province,
            // String format sẵn cho recipient info
            address: `${selectedAddress.addressDetail}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`
          }
        : {
            // Nếu nhập địa chỉ mới, lấy từ form và labels của select boxes
            addressDetail: formData.address || '',
            ward: formData.ward || '',
            district: formData.district || '',
            province: formData.province || '',
            // String format cho recipient info
            address: [
              formData.address,
              formData.ward,
              formData.district,
              formData.province
            ].filter(Boolean).join(', ')
          })
    };
    
    updateShippingAddress(shippingAddress);
    
    // Lưu thông tin vào localStorage nếu được chọn
    if (formData.saveInfo) {
      localStorage.setItem('checkoutInfo', JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        address: formData.address,
      }));
    }
    
    onNext();
  };

  // Tải thông tin đã lưu từ localStorage khi component mount
  useEffect(() => {
    const savedInfo = localStorage.getItem('checkoutInfo');
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo);
        setFormData(prev => ({
          ...prev,
          fullName: parsedInfo.fullName || '',
          email: parsedInfo.email || '',
          phoneNumber: parsedInfo.phoneNumber || '',
          receiverName: parsedInfo.receiverName || parsedInfo.fullName || '',
          receiverPhone: parsedInfo.receiverPhone || parsedInfo.phoneNumber || '',
          province: parsedInfo.province || '',
          district: parsedInfo.district || '',
          ward: parsedInfo.ward || '',
          address: parsedInfo.address || '',
        }));
      } catch (error) {
        console.error('Lỗi khi đọc thông tin đã lưu:', error);
      }
    }
    
    // Fake data cho người dùng đã đăng nhập - trong thực tế sẽ lấy từ API
    const isLoggedIn = true; // Giả sử user đã đăng nhập
    if (isLoggedIn) {
      setFormData(prev => ({
        ...prev,
        fullName: 'Nguyen Van A',
        email: 'example@gmail.com',
        phoneNumber: '0987654321',
      }));
    }
  }, []);

  // Giả sử user đã đăng nhập - trong thực tế sẽ lấy từ context auth
  const isLoggedIn = true;

  return (
    <div className="space-y-6">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <CustomerInfo
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
          isLoggedIn={isLoggedIn}
        />
        
        <div className="mt-6">
          <ShippingAddress
            formData={formData}
            handleChange={handleChange}
            sameAsCustomer={sameAsCustomer}
            onSameAsCustomerChange={handleSameAsCustomerChange}
            customerName={formData.fullName}
            customerPhone={formData.phoneNumber}
            addresses={mockAddresses}
            onSelectExistingAddress={handleSelectExistingAddress}
          />
        </div>
        
        <div className="mt-6">
          <ShippingType
            deliveryMethod={formData.deliveryMethod}
            handleRadioChange={handleRadioChange}
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" size="lg">
            Tiếp tục thanh toán
          </Button>
        </div>
      </form>
    </div>
  );
}
