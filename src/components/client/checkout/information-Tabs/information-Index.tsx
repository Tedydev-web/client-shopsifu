'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CustomerInfo } from '../sections/tab-1/customer-Info';
import { ShippingAddress } from '../sections/tab-1/shipping-Address';
import { ShippingType } from '../sections/tab-1/shipping-Type';
import { useCheckout } from '../hooks/useCheckout';
import { CustomerFormData, Address, ShippingAddress as ShippingAddressType } from '@/types/checkout.interface';
import { useUserData } from '@/hooks/useGetData-UserLogin';

interface InformationTabsProps {
  onNext: () => void;
}



export function InformationTabs({ onNext }: InformationTabsProps) {
  const userData = useUserData();
  const { updateCustomerInfo, updateShippingMethod, updateShippingAddress } = useCheckout();

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
    // Cập nhật thông tin khách hàng vào context
    const customerInfo = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phoneNumber,
    };
    updateCustomerInfo(customerInfo);
    
    // Cập nhật phương thức vận chuyển
    updateShippingMethod(formData.deliveryMethod === 'standard' ? 'delivery' : 'delivery');
    
    // Helper function để parse location data từ format "code|name"
    const parseLocationValue = (value: string) => {
      if (!value) return '';
      const parts = value.split('|');
      return parts[1] || parts[0]; // Ưu tiên name, fallback về code
    };
    
    // Cập nhật địa chỉ giao hàng
    const shippingAddress = {
      // Thông tin người nhận luôn lấy từ form input
      receiverName: formData.receiverName || '',
      receiverPhone: formData.receiverPhone || '',
      
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
            // Nếu nhập địa chỉ mới, parse để lấy name thay vì code
            addressDetail: formData.address || '',
            ward: parseLocationValue(formData.ward),
            district: parseLocationValue(formData.district),
            province: parseLocationValue(formData.province),
            // String format cho recipient info với name
            address: [
              formData.address,
              parseLocationValue(formData.ward),
              parseLocationValue(formData.district),
              parseLocationValue(formData.province)
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
        
        <div className="mt-4">
          <ShippingType
            deliveryMethod={formData.deliveryMethod}
            handleRadioChange={handleRadioChange}
          />
        </div>
      </form>
    </div>
  );
}
