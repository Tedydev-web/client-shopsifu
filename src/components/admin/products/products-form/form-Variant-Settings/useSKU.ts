import { useState, useEffect, useMemo } from 'react';
import { generateSKUs, Sku } from '@/utils/variantUtils';
import type { OptionData } from './form-VariantInput';

interface GroupedSkus {
  [key: string]: Sku[];
}

// Helpers
export const formatPrice = (value: number) => {
  if (value === 0) return '';
  return new Intl.NumberFormat('en-US').format(value);
};

const parsePrice = (value: string) => {
  const numericString = value.replace(/[^0-9]/g, '');
  return numericString === '' ? 0 : parseInt(numericString, 10);
};

// Hook Props
interface UseSkuProps {
  options: OptionData[];
  onUpdateSkus: (skus: Sku[]) => void;
}

export function useSku({ options, onUpdateSkus }: UseSkuProps) {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newSkus = generateSKUs(options);
    // Preserve existing price/stock/image data if possible
    const preservedSkus = newSkus.map(newSku => {
      const oldSku = skus.find(s => s.id === newSku.id);
      return oldSku ? { ...newSku, price: oldSku.price, stock: oldSku.stock, image: oldSku.image } : newSku;
    });
    setSkus(preservedSkus);
    onUpdateSkus(preservedSkus);

    // Reset expanded state only if the primary option changes
    const oldFirstOption = skus[0]?.variantValues[0]?.optionName;
    const newFirstOption = options[0]?.name;
    if (oldFirstOption !== newFirstOption) {
        setExpandedGroups({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const groupedSkus = useMemo<GroupedSkus>(() => {
    if (!skus || skus.length === 0 || skus[0].variantValues.length === 0) {
      return {};
    }
    return skus.reduce((acc, sku) => {
      const groupKey = sku.variantValues[0].value;
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(sku);
      return acc;
    }, {} as GroupedSkus);
  }, [skus]);

  const handleSkuChange = (skuId: string, field: 'price' | 'stock', value: string) => {
    let numericValue: number;

    if (field === 'price') {
      numericValue = parsePrice(value);
    } else { // for stock
      numericValue = value === '' ? 0 : parseInt(value, 10);
    }

    if (isNaN(numericValue)) return;

    const updatedSkus = skus.map(sku =>
      sku.id === skuId ? { ...sku, [field]: numericValue } : sku
    );
    setSkus(updatedSkus);
    onUpdateSkus(updatedSkus);
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const handleImageUpdate = (skuId: string, newUrl: string) => {
    const updatedSkus = skus.map(sku => 
      sku.id === skuId ? { ...sku, image: newUrl } : sku
    );
    setSkus(updatedSkus);
    onUpdateSkus(updatedSkus);
  };

  return {
    skus,
    groupedSkus,
    expandedGroups,
    handleSkuChange,
    toggleGroup,
    handleImageUpdate,
  };
}