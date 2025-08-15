"use client";

import { useState, useEffect } from 'react';
import { VoucherUseCase } from './voucher-config';
import {
  CreateDiscountRequest,
  DiscountApplyType,
  DiscountStatus,
  DiscountType,
  VoucherType,
  DisplayType,
} from '@/types/discount.interface';
import { discountService } from '@/services/discountService';
import { toast } from 'sonner';

// The explicit and complete state for the voucher form.
// This approach avoids using Partial<> to prevent downstream 'undefined' errors.
export type VoucherFormState = {
  name: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIX_AMOUNT';
  value: number;
  minOrderValue: number;
  maxDiscountValue?: number | null; // Cho phép null
  maxUses: number;
  maxUsesPerUser: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  discountApplyType: DiscountApplyType;

  // UI-specific fields
  showOnProductPage?: boolean;
  selectedProducts?: Array<{ id: string; name: string; price: number; image: string; }>;
  categories?: string[];
  brands?: string[];
  displayType?: 'PUBLIC' | 'PRIVATE';
  isPrivate?: boolean;
  maxDiscountType?: 'limited' | 'unlimited';
};

// Interface for the hook's return value
export interface UseNewVoucherReturn {
  formData: VoucherFormState;
  updateFormData: (field: keyof VoucherFormState, value: any) => void;
  resetForm: () => void;
  submitVoucher: () => Promise<void>;
  isLoading: boolean;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
  voucherType: string;
}

const initialFormData: VoucherFormState = {
  name: '',
  code: '',
  description: '',
  discountType: 'PERCENTAGE',
  value: 0,
  minOrderValue: 0,
  maxUses: 1,
  maxUsesPerUser: 1,
  startDate: '',
  endDate: '',
  isActive: true,
  showOnProductPage: true,
  selectedProducts: [],
  categories: [],
  brands: [],
  discountApplyType: DiscountApplyType.ALL,
  maxDiscountType: 'unlimited',
  maxDiscountValue: null, // Set null thay vì 0
};

interface UseNewVoucherProps {
  useCase: VoucherUseCase;
  owner: 'PLATFORM' | 'SHOP'; // Giữ lại cho tương thích, nhưng sẽ override bằng userData.role
  userData: any; // Nhận userData từ component cha
  onCreateSuccess?: () => void;
}

export function useNewVoucher({ useCase, owner, userData, onCreateSuccess }: UseNewVoucherProps): UseNewVoucherReturn {
  const [formData, setFormData] = useState<VoucherFormState>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // userData được truyền từ component cha

  // Helper function để xử lý API error messages
  const parseErrorMessage = (error: any): string => {
    const defaultMessage = 'Đã xảy ra lỗi khi tạo voucher. Vui lòng thử lại.';
    
    if (!error?.response?.data?.message) {
      return error?.message || defaultMessage;
    }

    const apiMessage = error.response.data.message;
    
    // Kiểm tra nếu message là array (validation errors từ backend)
    if (Array.isArray(apiMessage)) {
      // Kết hợp tất cả error messages, hoặc chỉ lấy cái đầu tiên
      const validationErrors = apiMessage
        .map(err => err.message || err)
        .filter(Boolean)
        .join('. ');
      
      return validationErrors || defaultMessage;
    }
    
    // Nếu message là string thông thường
    if (typeof apiMessage === 'string') {
      return apiMessage;
    }
    
    return defaultMessage;
  };

  const getVoucherType = (uc: VoucherUseCase) => {
    if (uc === VoucherUseCase.PRODUCT) return VoucherType.PRODUCT;
    if (uc === VoucherUseCase.PRIVATE) return VoucherType.SHOP; // PRIVATE vẫn là SHOP type nhưng displayType khác
    return VoucherType.SHOP;
  };
  const voucherType = getVoucherType(useCase);

  // Log để debug
  useEffect(() => {
    console.log('useNewVoucher initialized:', {
      useCase, voucherType
    });

    // Sanitize form data based on use case
    setFormData(prev => {
      const newFormData = { ...initialFormData, name: prev.name, code: prev.code }; // Reset to initial but keep name/code

      switch (useCase) {
        case VoucherUseCase.SHOP:
          newFormData.discountApplyType = DiscountApplyType.ALL;
          newFormData.selectedProducts = [];
          newFormData.displayType = 'PUBLIC';
          newFormData.isPrivate = false;
          break;
        
        case VoucherUseCase.PRODUCT:
          newFormData.discountApplyType = DiscountApplyType.SPECIFIC;
          newFormData.selectedProducts = []; // Start with empty selection
          newFormData.displayType = 'PUBLIC';
          newFormData.isPrivate = false;
          break;

        case VoucherUseCase.PRIVATE:
          newFormData.displayType = 'PRIVATE';
          newFormData.isPrivate = true;
          newFormData.discountApplyType = DiscountApplyType.ALL; // Default to all
          newFormData.selectedProducts = [];
          break;
      }
      return newFormData;
    });

  }, [useCase]);

  // Cập nhật form data
  const updateFormData = (field: keyof VoucherFormState, value: any) => {
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [field]: value
      };

      // Khi người dùng chọn áp dụng cho tất cả sản phẩm, xóa danh sách sản phẩm đã chọn
      if (field === 'discountApplyType' && value === 'ALL') {
        newFormData.selectedProducts = [];
      }

      return newFormData;
    });

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

    if (!formData.name?.trim()) {
      toast.error('Tên chương trình giảm giá là bắt buộc');
      return false;
    }

    if (!formData.code?.trim()) {
      toast.error('Mã voucher là bắt buộc');
      return false;
    }

    // Validate mã voucher format
    const codePattern = /^[A-Z0-9_-]+$/;
    if (formData.code && !codePattern.test(formData.code)) {
      toast.error('Mã voucher chỉ được chứa chữ hoa, số, dấu gạch dưới (_) và dấu gạch ngang (-)');
      return false;
    }

    if (!formData.startDate) {
      toast.error('Ngày bắt đầu là bắt buộc');
      return false;
    }

    if (!formData.endDate) {
      toast.error('Ngày kết thúc là bắt buộc');
      return false;
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      return false;
    }

    if (formData.value <= 0) {
      toast.error('Mức giảm phải lớn hơn 0');
      return false;
    }

    if (formData.discountType === 'PERCENTAGE' && formData.value > 100) {
      toast.error('Phần trăm giảm không được vượt quá 100%');
      return false;
    }

    if ((formData.minOrderValue ?? 0) < 0) {
      toast.error('Giá trị đơn hàng tối thiểu không được âm');
      return false;
    }

    if (formData.maxUses < 1) {
      toast.error('Tổng lượt sử dụng phải ít nhất là 1');
      return false;
    }

    if (formData.maxUsesPerUser < 1) {
      toast.error('Lượt sử dụng mỗi người phải ít nhất là 1');
      return false;
    }

    // Validation: maxUsesPerUser không được vượt quá maxUses
    if (formData.maxUsesPerUser > formData.maxUses) {
      toast.error('Số lần sử dụng tối đa per user không được vượt quá số lần sử dụng tối đa');
      return false;
    }

    // Validation cho voucher sản phẩm
    if (useCase === VoucherUseCase.PRODUCT && 
        formData.discountApplyType === DiscountApplyType.SPECIFIC && 
        (formData.selectedProducts ?? []).length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để áp dụng voucher');
      return false;
    }

    // Validation cho maxDiscountValue khi discountType là PERCENTAGE
    if (formData.discountType === 'PERCENTAGE' && 
        formData.maxDiscountValue !== null && 
        formData.maxDiscountValue !== undefined &&
        formData.maxDiscountValue <= 0) {
      toast.error('Mức giảm tối đa phải lớn hơn 0');
      return false;
    }

    return true;
  };

  // Submit voucher
  const submitVoucher = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    // Kiểm tra có userData không
    if (!userData) {
      toast.error('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    // Xác định owner thực tế dựa trên role của user (override owner param)
    // ADMIN role = PLATFORM voucher, các role khác = SHOP voucher
    const actualOwner = userData?.role?.name === 'SHOP' ? 'PLATFORM' : 'SHOP';
    const isPlatformVoucher = actualOwner === 'PLATFORM';

    // Xác định voucherType dựa trên role
    // Nếu là ADMIN thì voucherType = PLATFORM, còn không thì dùng logic useCase cũ
    const finalVoucherType = userData?.role?.name === 'SHOP' ? VoucherType.PLATFORM : voucherType;

    // Kiểm tra shopId khi là shop voucher
    if (!isPlatformVoucher && !userData?.id) {
      toast.error('Không thể lấy thông tin shop. Vui lòng đăng nhập lại.');
      return;
    }

    console.log('Debug userData structure:', {
      userData,
      userId: userData?.id,
      userRole: userData?.role?.name,
    });

    setIsLoading(true);
    try {
      // Chuẩn bị payload theo format API
      const payload: CreateDiscountRequest = {
        name: formData.name,
        description: formData.description || formData.name, // Nếu không có description thì dùng name
        code: formData.code,
        value: formData.value,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        maxUsesPerUser: formData.maxUsesPerUser,
        minOrderValue: formData.minOrderValue,
        maxUses: formData.maxUses,
        shopId: isPlatformVoucher ? null : userData.id, // PLATFORM = null, SHOP = userData.id
        isPlatform: isPlatformVoucher,
        voucherType: finalVoucherType, // Sử dụng finalVoucherType thay vì voucherType
        discountApplyType: formData.discountApplyType,
        discountStatus: formData.isActive ? DiscountStatus.ACTIVE : DiscountStatus.INACTIVE,
        discountType: formData.discountType === 'FIX_AMOUNT' ? DiscountType.FIX_AMOUNT : DiscountType.PERCENTAGE,
      };

      // Thêm các trường tùy chọn
      // Chỉ thêm maxDiscountValue khi có giá trị và discountType là PERCENTAGE
      if (formData.discountType === 'PERCENTAGE' && 
          formData.maxDiscountValue !== null && 
          formData.maxDiscountValue !== undefined &&
          formData.maxDiscountValue > 0) {
        payload.maxDiscountValue = formData.maxDiscountValue;
      } else {
        // Nếu không có hoặc không phải PERCENTAGE thì set null
        payload.maxDiscountValue = null;
      }

      // Xử lý displayType dựa trên useCase
      if (useCase === VoucherUseCase.PRIVATE) {
        payload.displayType = DisplayType.PRIVATE;
      } else {
        payload.displayType = formData.displayType === 'PRIVATE' ? DisplayType.PRIVATE : DisplayType.PUBLIC;
      }

      // Xử lý products cho voucher sản phẩm
      if (useCase === VoucherUseCase.PRODUCT && formData.discountApplyType === DiscountApplyType.SPECIFIC) {
        (payload as any).products = formData.selectedProducts?.map(p => p.id) || [];
      }

      console.log('User role and owner logic:', {
        userRole: userData?.role?.name,
        ownerParam: owner,
        actualOwner,
        isPlatformVoucher,
        shopId: isPlatformVoucher ? null : userData.id,
        originalVoucherType: voucherType,
        finalVoucherType: finalVoucherType
      });

      console.log('Submitting voucher with payload:', payload);
      
      // Gọi API
      const response = await discountService.create(payload);
      
      console.log('Voucher created successfully:', response);
      
      // Hiển thị thông báo thành công
      toast.success('Tạo voucher thành công!');
      
      // Reset form sau khi tạo thành công
      resetForm();
      
      // Callback success nếu có
      onCreateSuccess?.();

    } catch (error: any) {
      console.error('Error creating voucher:', error);
      
      // Sử dụng helper function để parse error message
      const errorMessage = parseErrorMessage(error);
      toast.error(errorMessage);
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
    voucherType: voucherType.toString(),
  };
}