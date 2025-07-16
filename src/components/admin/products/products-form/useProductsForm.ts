import { useState, useCallback, useEffect } from 'react';
import {
  ProductCreateRequest,
  Variant,
  Sku,
  ProductDetail,
  ProductUpdateRequest,
  SkuDetail,
} from '@/types/products.interface';
import { productsService } from '@/services/productsService';
import { showToast } from '@/components/ui/toastify';

// Định nghĩa kiểu dữ liệu cho SKU trong form state
// Nó có thể là SkuDetail (từ API, có id) hoặc Sku (khi mới tạo, chưa có id)
type FormSku = Partial<SkuDetail>;

// Định nghĩa kiểu dữ liệu cho state của form
export type FormState = Omit<ProductCreateRequest, 'skus' | 'categories' | 'brandId'> & {
  skus: FormSku[];
  categories: number[];
  brandId: number | null; // Cho phép brandId là null
  description: string;
};

const INITIAL_STATE: FormState = {
  name: '',
  description: '',
  basePrice: 0,
  virtualPrice: 0,
  brandId: null,
  images: [],
  categories: [],
  variants: [],
  skus: [],
};

interface UseProductsFormProps {
  initialData?: ProductDetail | null;
}

export const useProductsForm = ({ initialData }: UseProductsFormProps) => {
  const [productData, setProductData] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (isEditMode && initialData) {
      setProductData({
        name: initialData.name || '',
        description: initialData.description || '',
        basePrice: initialData.basePrice || 0,
        virtualPrice: initialData.virtualPrice || 0,
        brandId: initialData.brand?.id || null, // Lấy id từ object brand lồng nhau
        images: initialData.images || [],
        categories: initialData.categories?.map(c => c.id) || [], // Map từ object CategoryDetail sang mảng ID
        variants: initialData.variants || [],
        skus: initialData.skus || [], // Gán trực tiếp mảng SkuDetail
      });
    }
  }, [initialData, isEditMode]);

  const handleInputChange = useCallback((field: keyof FormState, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  }, []);

  const setVariants = useCallback((newVariants: Variant[]) => {
      const variantsWithOptions = newVariants.filter(v => v.options && v.options.length > 0);

      if (variantsWithOptions.length === 0) {
          setProductData(prev => ({ ...prev, variants: newVariants, skus: [] }));
          return;
      }

      const combinations = variantsWithOptions.reduce<string[]>((acc, variant) => {
          if (acc.length === 0) {
              return variant.options.map(opt => opt);
          }
          return acc.flatMap(combination => variant.options.map(opt => `${combination}-${opt}`));
      }, []);

      const newSkus: Omit<Sku, 'id'>[] = combinations.map(combo => ({
          value: combo,
          price: productData.basePrice,
          stock: 0,
          image: '',
      }));

      setProductData(prev => ({ ...prev, variants: newVariants, skus: newSkus }));
  }, [productData.basePrice]);


  const updateSingleSku = useCallback((index: number, updatedSku: Partial<FormSku>) => {
    setProductData(prev => {
      const newSkus = [...prev.skus];
      newSkus[index] = { ...newSkus[index], ...updatedSku };
      return { ...prev, skus: newSkus };
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    // Chuyển đổi brandId về 0 nếu nó là null để phù hợp với interface request
    const submissionData = {
        ...productData,
        brandId: productData.brandId ?? 0,
        // API yêu cầu skus không có id khi tạo mới
        // Logic này cần được xác nhận lại với backend để xử lý update (thêm/sửa/xóa SKU)
        skus: productData.skus.map(({ id, createdAt, updatedAt, ...rest }) => rest) as Sku[],
    };

    if (!submissionData.brandId) {
        showToast('Vui lòng chọn thương hiệu.', 'error');
        setIsSubmitting(false);
        return;
    }


    try {
      if (isEditMode && initialData) {
        await productsService.update(String(initialData.id), submissionData as ProductUpdateRequest);
        showToast('Sản phẩm đã được cập nhật.', 'success');
      } else {
        await productsService.create(submissionData as ProductCreateRequest);
        showToast('Sản phẩm đã được tạo mới.', 'success');
      }
    } catch (error) {
      console.error('Failed to submit product:', error);
      showToast('Đã có lỗi xảy ra.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [isEditMode, productData, initialData]);

  return {
    productData,
    isEditMode,
    isSubmitting,
    handleInputChange,
    setVariants,
    updateSingleSku,
    handleSubmit,
  };
};