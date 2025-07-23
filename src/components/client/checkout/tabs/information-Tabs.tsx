'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CustomerInfo } from '../sections/tab-1/customer-Info';
import { ShippingType } from '../sections/tab-1/shipping-Type';
import { useCheckout } from '../hooks/useCheckout';

interface InformationTabsProps {
  onNext: () => void;
}

export function InformationTabs({ onNext }: InformationTabsProps) {
  const { updateCustomerInfo, updateShippingMethod } = useCheckout();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    receiverName: '',
    receiverPhone: '',
    province: '',
    district: '',
    ward: '',
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

  const handleSubmit = () => {
    // Cập nhật thông tin khách hàng vào context
    updateCustomerInfo({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phoneNumber,
    });
    
    // Cập nhật phương thức vận chuyển vào context
    updateShippingMethod(formData.deliveryMethod === 'standard' ? 'delivery' : 'delivery');
    
    // Cập nhật địa chỉ giao hàng vào context
    const shippingAddress = {
      province: formData.province,
      district: formData.district,
      ward: formData.ward,
      address: formData.address
    };
    
    // TODO: Thêm hàm updateShippingAddress vào context và sử dụng ở đây
    // updateShippingAddress(shippingAddress);
    
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
        // Các trường người nhận giữ nguyên để người dùng có thể chọn địa chỉ khác
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
