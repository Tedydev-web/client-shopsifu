import { useState, useEffect } from 'react';
import { getAllBrands } from '@/services/admin/brandsService';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';

interface BrandOption {
  value: number;
  label: string;
}

export const useCbbBrand = () => {
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await getAllBrands({ page: 1, limit: 100 });
        if (response.data) {
          const formattedBrands = response.data.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }));
          setBrands(formattedBrands);
        }
      } catch (error) {
        showToast(parseApiError(error), 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading };
};
