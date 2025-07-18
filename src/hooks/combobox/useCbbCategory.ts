import { useState, useEffect } from 'react';
import { categoryService } from '@/services/admin/categoryService';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { PaginationRequest } from '@/types/base.interface';

interface CategoryOption {
  value: string;
  label: string;
  icon?: string | null;
  parentCategoryId?: string | null;
}

interface CategoryParams extends PaginationRequest {
  parentCategoryId?: string | null;
}

export const useCbbCategory = (parentCategoryId?: string | null) => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const params: CategoryParams = { page: 1, limit: 100 };

        if (parentCategoryId) {
          params.parentCategoryId = parentCategoryId;
        }

        const response = await categoryService.getAll(params);

        if (response.data) {
          const formattedCategories = response.data.map((category) => ({
            value: category.id,
            label: category.name,
            icon: category.logo,
            parentCategoryId: category.parentCategoryId
          }));
          setCategories(formattedCategories);
        }
      } catch (error) {
        showToast(parseApiError(error), 'error');
        // Reset categories on error to avoid showing stale data
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [parentCategoryId]); // Re-run effect when parentCategoryId changes

  return { categories, loading };
};
