'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CustomerInfo } from './customer-Info';
import { ShippingAddress } from './shipping-Address';
import { useCheckout } from '../hooks/useCheckout';
import { CustomerFormData, Address, ShippingAddress as ShippingAddressType } from '@/types/checkout.interface';
import { toast } from 'sonner';

interface InformationTabsProps {
  onNext: () => void;
}

export function InformationTabs({ onNext }: InformationTabsProps) {
  const { updateReceiverInfo, updateShippingAddress, updateShippingMethod } = useCheckout();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  // Thêm state lưu trữ thông tin nhập mới tạm thời
  const [tempNewAddressData, setTempNewAddressData] = useState({
    province: '',
    district: '',
    ward: '',
    address: ''
  });
  
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

  // Theo dõi thay đổi của selectedAddress
  useEffect(() => {
    if (!selectedAddress) {
      // Nếu chuyển sang chế độ nhập mới, khôi phục dữ liệu nhập trước đó nếu có
      if (tempNewAddressData.province || tempNewAddressData.district || tempNewAddressData.ward || tempNewAddressData.address) {
        setFormData(prev => ({
          ...prev,
          province: tempNewAddressData.province,
          district: tempNewAddressData.district,
          ward: tempNewAddressData.ward,
          address: tempNewAddressData.address
        }));
      }
    }
  }, [selectedAddress, tempNewAddressData]);

  // Xử lý nhận dữ liệu từ CustomerInfo
  const handleCustomerInfoChange = (customerData: {
    fullName: string;
    phoneNumber: string;
    email: string;
    saveInfo: boolean;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...customerData
    }));
  };

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

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryMethod: value }));
  };

  const handleSelectExistingAddress = (address: Address) => {
    // Prevent unnecessary updates
    if (JSON.stringify(address) === JSON.stringify(selectedAddress)) {
      return;
    }
    
    // Kiểm tra xem địa chỉ này có id không (để biết là địa chỉ có sẵn hay địa chỉ mới)
    const isExistingAddress = address.id && address.id.length > 0;
    
    // Đảm bảo các giá trị là string không phải undefined
    const safeAddressDetail = address.addressDetail || '';
    const safeProvince = address.province || '';
    const safeDistrict = address.district || '';
    const safeWard = address.ward || '';

    if (!isExistingAddress) {
      // Nếu chuyển sang chế độ nhập mới, lưu lại thông tin nhập trước đó
      setTempNewAddressData({
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        address: formData.address
      });
    }

    // Cập nhật formData với thông tin từ địa chỉ đã chọn - CHỈ CẬP NHẬT PHẦN ĐỊA CHỈ
    const updatedFormData = {
      ...formData,
      province: isExistingAddress ? safeProvince : '', // Nếu là địa chỉ mới, xóa các thông tin địa chỉ
      district: isExistingAddress ? safeDistrict : '',
      ward: isExistingAddress ? safeWard : '',
      address: isExistingAddress ? safeAddressDetail : ''
    };
    
    // First update formData
    setFormData(updatedFormData);
    
    // Then update selectedAddress - this order matters to avoid extra render cycles
    setSelectedAddress(isExistingAddress ? address : null);
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
    
    // 3. Validation địa chỉ - less strict for debugging
    
    if (selectedAddress) {
      // Nếu chọn địa chỉ có sẵn, kiểm tra địa chỉ có đầy đủ không
      if (!selectedAddress.addressDetail) {
        // Don't block submission for debugging
      }
    } else {
      // Nếu nhập địa chỉ mới, kiểm tra các trường bắt buộc
      if (!formData.address || formData.address.trim() === '') {
        errors.push('Vui lòng nhập địa chỉ chi tiết');
      }
      // For debugging, don't block on these fields
      if (!formData.province) {
        // errors.push('Vui lòng chọn tỉnh/thành phố');
      }
      if (!formData.district) {
        // errors.push('Vui lòng chọn quận/huyện');
      }
      if (!formData.ward) {
        // errors.push('Vui lòng chọn phường/xã');
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
            // Giữ nguyên cấu trúc code|name để component recipient-Info có thể parse
            ward: selectedAddress.ward,
            district: selectedAddress.district,
            province: selectedAddress.province,
            address: fullAddress
          }
        : {
            addressDetail: formData.address || '',
            // Đã parse từ code|name sang name trong parseLocationValue
            ward: formData.ward, // Giữ nguyên định dạng code|name
            district: formData.district, // Giữ nguyên định dạng code|name
            province: formData.province, // Giữ nguyên định dạng code|name
            address: fullAddress
          })
    };
    
    // Update shipping address
    
    // Ensure addressDetail is not empty
    if (!shippingAddress.addressDetail && shippingAddress.address) {
      shippingAddress.addressDetail = shippingAddress.address;
    }
    
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
          onDataChange={handleCustomerInfoChange}
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
