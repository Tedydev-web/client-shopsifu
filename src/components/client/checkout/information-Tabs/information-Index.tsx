'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CustomerInfo } from './customer-Info';
import { ShippingAddress } from './shipping-Address';
import { ShippingType } from './shipping-Type';
import { useCheckout } from '../hooks/useCheckout';
import { CustomerFormData, Address, ShippingAddress as ShippingAddressType } from '@/types/checkout.interface';
import { useUserData } from '@/hooks/useGetData-UserLogin';
import { toast } from 'sonner';

interface InformationTabsProps {
  onNext: () => void;
}



export function InformationTabs({ onNext }: InformationTabsProps) {
  const userData = useUserData();
  const { updateReceiverInfo, updateShippingAddress, updateShippingMethod } = useCheckout();

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

  // Pre-fill form with user data if available
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        fullName: userData.name || '',
        phoneNumber: userData.phoneNumber || '',
        email: userData.email || '',
      }));
    }
  }, [userData]);

  const handleChange = (nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
    let name: string, val: string;

    if (typeof nameOrEvent === 'string') {
      name = nameOrEvent;
      val = value || '';
    } else {
      name = nameOrEvent.target.name;
      val = nameOrEvent.target.value;
    }

    setFormData(prev => ({ ...prev, [name]: val }));
    
    // Reset selected address if user starts typing in address fields
    if (['receiverName', 'receiverPhone', 'province', 'district', 'ward', 'address'].includes(name)) {
      setSelectedAddress(null);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, saveInfo: checked }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryMethod: value }));
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
    // Validation cho các trường bắt buộc
    const errors: string[] = [];
    
    // 1. Validation tên người nhận
    const receiverName = formData.receiverName || formData.fullName;
    if (!receiverName || receiverName.trim() === '') {
      errors.push('Vui lòng nhập tên người nhận');
    }
    
    // 2. Validation số điện thoại người nhận
    const receiverPhone = formData.receiverPhone || formData.phoneNumber;
    if (!receiverPhone || receiverPhone.trim() === '') {
      errors.push('Vui lòng nhập số điện thoại người nhận');
    } else if (!/^[0-9]{10,11}$/.test(receiverPhone.replace(/\s/g, ''))) {
      errors.push('Số điện thoại người nhận không hợp lệ (10-11 số)');
    }
    
    // 3. Validation địa chỉ
    if (selectedAddress) {
      // Nếu chọn địa chỉ có sẵn, kiểm tra địa chỉ có đầy đủ không
      if (!selectedAddress.addressDetail || !selectedAddress.ward || !selectedAddress.district || !selectedAddress.province) {
        errors.push('Địa chỉ đã chọn không đầy đủ thông tin');
      }
    } else {
      // Nếu nhập địa chỉ mới, kiểm tra các trường bắt buộc
      if (!formData.address || formData.address.trim() === '') {
        errors.push('Vui lòng nhập địa chỉ chi tiết');
      }
      if (!formData.province) {
        errors.push('Vui lòng chọn tỉnh/thành phố');
      }
      if (!formData.district) {
        errors.push('Vui lòng chọn quận/huyện');
      }
      if (!formData.ward) {
        errors.push('Vui lòng chọn phường/xã');
      }
    }
    
    // Nếu có lỗi, hiển thị và dừng lại
    if (errors.length > 0) {
      toast.error(errors[0]); // Hiển thị lỗi đầu tiên
      return;
    }
    
    // Helper function để parse location data từ format "code|name"
    const parseLocationValue = (value: string) => {
      if (!value) return '';
      const parts = value.split('|');
      return parts[1] || parts[0]; // Ưu tiên name, fallback về code
    };
    
    // Tạo địa chỉ đầy đủ cho người nhận
    const fullAddress = selectedAddress 
      ? `${selectedAddress.addressDetail}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`
      : [
          formData.address,
          parseLocationValue(formData.ward),
          parseLocationValue(formData.district),
          parseLocationValue(formData.province)
        ].filter(Boolean).join(', ');
    
    // Cập nhật thông tin người nhận vào context (đây là thông tin quan trọng cho API)
    const receiverInfo = {
      name: receiverName.trim(),
      phone: receiverPhone.trim(),
      address: fullAddress,
    };
    updateReceiverInfo(receiverInfo);
    
    // Cập nhật địa chỉ giao hàng (thông tin chi tiết)
    const shippingAddress = {
      receiverName: formData.receiverName || formData.fullName,
      receiverPhone: formData.receiverPhone || formData.phoneNumber,
      
      ...(selectedAddress 
        ? {
            addressDetail: selectedAddress.addressDetail,
            ward: selectedAddress.ward,
            district: selectedAddress.district,
            province: selectedAddress.province,
            address: fullAddress
          }
        : {
            addressDetail: formData.address || '',
            ward: parseLocationValue(formData.ward),
            district: parseLocationValue(formData.district),
            province: parseLocationValue(formData.province),
            address: fullAddress
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



  // Giả sử user đã đăng nhập - trong thực tế sẽ lấy từ context auth
  const isLoggedIn = true;

  return (
    <div className="space-y-4">
      <form id="checkout-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <CustomerInfo
          formData={formData}
          handleChange={handleChange}
          isLoggedIn={isLoggedIn}
        />
        
        <div className="mt-4">
          <ShippingAddress
            formData={formData}
            handleChange={handleChange}
            onSelectExistingAddress={handleSelectExistingAddress}
          />
        </div>
        
        {/* <div className="mt-4">
          <ShippingType
            deliveryMethod={formData.deliveryMethod}
            handleRadioChange={handleRadioChange}
          />
        </div> */}
      </form>
    </div>
  );
}
