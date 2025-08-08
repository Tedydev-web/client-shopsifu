"use client";

import { useState, useEffect } from 'react';

// Enum cho các loại voucher
export enum VoucherUseCase {
  SHOP = 1,
  PRODUCT = 2,
  PRIVATE = 3
}

// Interface cho voucher data
export interface VoucherFormData {
  // Thông tin cơ bản
  name: string;
  code: string;
  description: string;
  displayName: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  usageLimit: number;
  usagePerUser: number;
  startDate: string;
  endDate: string;
  isPrivate: boolean;
  isActive: boolean;
  showOnProductPage: boolean;
  selectedProducts: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>;
}

// Interface cho hook return
export interface UseNewVoucherReturn {
  formData: VoucherFormData;
  updateFormData: (field: keyof VoucherFormData, value: any) => void;
  resetForm: () => void;
  submitVoucher: () => Promise<void>;
  isLoading: boolean;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
  voucherType: string;
}

const initialFormData: VoucherFormData = {
  name: '',
  code: '',
  description: '',
  displayName: '',
  discountType: 'percentage',
  discountValue: 0,
  minOrderValue: 0,
  usageLimit: 1,
  usagePerUser: 1,
  startDate: '',
  endDate: '',
  isPrivate: false,
  isActive: true,
  showOnProductPage: true,
  selectedProducts: [],
};

interface UseNewVoucherProps {
  useCase: VoucherUseCase;
  onCreateSuccess?: () => void;
}

export function useNewVoucher({ useCase, onCreateSuccess }: UseNewVoucherProps): UseNewVoucherReturn {
  const [formData, setFormData] = useState<VoucherFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getVoucherType = (uc: VoucherUseCase) => {
    if (uc === VoucherUseCase.PRODUCT) return 'product';
    if (uc === VoucherUseCase.PRIVATE) return 'private';
    return 'shop';
  };
  const voucherType = getVoucherType(useCase);

  // Log để debug
  useEffect(() => {
    console.log('useNewVoucher initialized:', {
      useCase, voucherType
    });
  }, [useCase, voucherType]);

  // Cập nhật form data
  const updateFormData = (field: keyof VoucherFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error khi user nhập lại
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên chương trình giảm giá là bắt buộc';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Mã voucher là bắt buộc';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Tên hiển thị là bắt buộc';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    if (formData.discountValue <= 0) {
      newErrors.discountValue = 'Mức giảm phải lớn hơn 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Phần trăm giảm không được vượt quá 100%';
    }

    if (formData.minOrderValue < 0) {
      newErrors.minOrderValue = 'Giá trị đơn hàng tối thiểu không được âm';
    }

    if (formData.usageLimit < 1) {
      newErrors.usageLimit = 'Tổng lượt sử dụng phải ít nhất là 1';
    }

    if (formData.usagePerUser < 1) {
      newErrors.usagePerUser = 'Lượt sử dụng mỗi người phải ít nhất là 1';
    }

    if (useCase === VoucherUseCase.PRODUCT && formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = 'Vui lòng chọn ít nhất một sản phẩm để áp dụng.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit voucher
  const submitVoucher = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Tạo payload dựa trên useCase
      const payload = {
        ...formData,
        useCase,
        type: voucherType
      };
      
      console.log('Submitting voucher:', payload);
      
      // TODO: Gọi API tạo voucher
      // await voucherService.createVoucher(payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Voucher created successfully');
      
      // Reset form sau khi tạo thành công và gọi callback
      resetForm();
      onCreateSuccess?.();
      
    } catch (error) {
      console.error('Error creating voucher:', error);
      setErrors({ submit: 'Có lỗi xảy ra khi tạo voucher. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    formData,
    updateFormData,
    resetForm,
    submitVoucher,
    isLoading,
    errors,
    useCase,
    voucherType,
  };
}