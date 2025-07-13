"use client";

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, Image as ImageIcon } from 'lucide-react';
import { generateSKUs, Sku } from '@/utils/variantUtils';
import type { OptionData } from './form-VariantInput';

interface SKUListProps {
  options: OptionData[];
  onUpdateSkus: (skus: Sku[]) => void;
}

interface GroupedSkus {
  [key: string]: Sku[];
}

export function SKUList({ options, onUpdateSkus }: SKUListProps) {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newSkus = generateSKUs(options);
    setSkus(newSkus);
    onUpdateSkus(newSkus);

    // Expand all groups by default
    if (newSkus.length > 0 && newSkus[0].variantValues.length > 0) {
      const firstOptionValues = options[0]?.values || [];
      const initialExpansionState = firstOptionValues.reduce((acc, value) => {
        acc[value] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedGroups(initialExpansionState);
    }

  }, [options, onUpdateSkus]);

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
    const numericValue = value === '' ? 0 : parseInt(value, 10);
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

  if (skus.length === 0) {
    return null;
  }

  return (
    <div className="border-t mt-6 pt-6">
      <div className="grid grid-cols-12 gap-4 px-6 mb-2 text-sm font-medium text-muted-foreground">
        <div className="col-span-6">Variant</div>
        <div className="col-span-3">Price</div>
        <div className="col-span-3">Available</div>
      </div>
      <div className="border rounded-lg mx-6 mb-6">
        {Object.entries(groupedSkus).map(([groupKey, groupSkus]) => (
          <div key={groupKey} className="border-b last:border-b-0">
            <button 
              onClick={() => toggleGroup(groupKey)}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <span className="font-medium">{groupKey}</span>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <span>{groupSkus.length} variants</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedGroups[groupKey] ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedGroups[groupKey] && (
              <div className="pl-4 pr-4 pb-4">
                {groupSkus.map(sku => {
                  const variantName = sku.variantValues.slice(1).map(v => v.value).join(' / ');
                  return (
                    <div key={sku.id} className="grid grid-cols-12 gap-4 items-center py-2 border-t first:border-t-0">
                      <div className="col-span-1 flex items-center justify-center">
                        <Button variant="ghost" size="icon" className='h-9 w-9'>
                           <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="col-span-5 text-sm">
                        {variantName || sku.variantValues[0].value}
                      </div>
                      <div className="col-span-3">
                        <Input 
                          type="number"
                          placeholder='0'
                          value={sku.price === 0 ? '' : sku.price}
                          onChange={(e) => handleSkuChange(sku.id, 'price', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input 
                          type="number"
                          placeholder='0'
                          value={sku.stock === 0 ? '' : sku.stock}
                          onChange={(e) => handleSkuChange(sku.id, 'stock', e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}