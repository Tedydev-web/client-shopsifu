"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { SortableVariantInput } from "./SortableVariantInput";
import type { OptionData } from "./form-VariantInput";
import { SKUList } from "./form-SKU";
import type { Sku } from "@/utils/variantUtils";

interface VariantSettingsProps {
  variants: {
    value: string;
    options: string[];
  }[];
  skus: any[]; // Sẽ định nghĩa chi tiết sau
  setVariants: (variants: any[]) => void;
  updateSingleSku: (index: number, updates: any) => void;
}

export function VariantSettingsIndex({
  variants,
  skus,
  setVariants,
  updateSingleSku
}: VariantSettingsProps) {
  // Thêm ref để theo dõi nguồn thay đổi
  const isInternalChange = useRef(false);
  
  // THÊM HÀM HANDLEUPDATESKUS VÀO ĐÂY
  const handleUpdateSkus = useCallback((updatedSkus: Sku[]) => {
    // Đánh dấu đây là thay đổi nội bộ
    isInternalChange.current = true;
    
    // Với mỗi SKU được cập nhật, gọi hàm updateSingleSku từ props
    updatedSkus.forEach((sku) => {
      // Lưu ý: Sử dụng sku.id thay vì index để cập nhật đúng SKU
      // API SKU có id riêng, không phụ thuộc vào vị trí trong mảng
      updateSingleSku(sku.id, {
        price: sku.price,
        stock: sku.stock,
        image: sku.image || '',
        value: sku.value
      });
    });
  }, [updateSingleSku]);
  // Mapping functions
  const mapVariantsToOptions = useCallback((apiVariants: any[]): OptionData[] => {
    if (!apiVariants || !apiVariants.length) return [];
    
    return apiVariants.map((variant, index) => ({
      id: index + 1, // Generate ID
      name: variant.value || '',
      values: variant.options || [],
      isDone: true
    }));
  }, []);

  const mapOptionsToVariants = useCallback((options: OptionData[]): any[] => {
    return options
      .filter(option => option.isDone && option.name && option.values.length > 0)
      .map(option => ({
        value: option.name,
        options: option.values.filter(v => v.trim() !== '')
      }));
  }, []);

  // Khởi tạo state từ props
  const [options, setOptions] = useState<OptionData[]>(() => 
    mapVariantsToOptions(variants || [])
  );

  // Sửa useEffect đầu tiên - Chỉ cập nhật từ props khi không phải thay đổi nội bộ
  useEffect(() => {
    // Nếu đây là thay đổi từ bên ngoài (không phải do component này gây ra)
    if (!isInternalChange.current) {
      setOptions(mapVariantsToOptions(variants || []));
    }
    // Reset flag sau mỗi lần render
    isInternalChange.current = false;
  }, [variants, mapVariantsToOptions]);

  // Sửa useEffect thứ hai - Sử dụng ref để đánh dấu thay đổi nội bộ
  useEffect(() => {
    // So sánh trạng thái options hiện tại với variants từ props
    const currentVariants = mapOptionsToVariants(options);
    const currentVariantsJSON = JSON.stringify(currentVariants);
    const propsVariantsJSON = JSON.stringify(variants);
    
    // Chỉ cập nhật parent nếu có sự khác biệt thực sự
    if (currentVariantsJSON !== propsVariantsJSON) {
      // Đánh dấu đây là thay đổi nội bộ
      isInternalChange.current = true;
      setVariants(currentVariants);
    }
  }, [options, setVariants, mapOptionsToVariants, variants]);

  // Sửa lại các hàm xử lý để đánh dấu thay đổi nội bộ
  const handleAddOptions = () => {
    const newOption = {
      id: Date.now(), // Unique ID
      name: '',
      values: [],
      isDone: false
    };
    
    isInternalChange.current = true; // Đánh dấu là thay đổi nội bộ
    setOptions([...options, newOption]);
  };

  const handleDelete = (optionId: number) => {
    isInternalChange.current = true; // Đánh dấu là thay đổi nội bộ
    setOptions(prevOptions => prevOptions.filter(option => option.id !== optionId));
  };

  const handleDone = (optionId: number) => {
    isInternalChange.current = true; // Đánh dấu là thay đổi nội bộ
    setOptions(prevOptions => prevOptions.map(option => 
      option.id === optionId 
        ? { ...option, isDone: true }
        : option
    ));
  };

  const handleEdit = (optionId: number) => {
    isInternalChange.current = true; // Đánh dấu là thay đổi nội bộ
    setOptions(prevOptions => prevOptions.map(option => 
      option.id === optionId 
        ? { ...option, isDone: false }
        : option
    ));
  };

  const handleUpdateOption = (optionId: number, name: string, values: string[]) => {
    isInternalChange.current = true; // Đánh dấu là thay đổi nội bộ
    setOptions(prevOptions => prevOptions.map(option => 
      option.id === optionId 
        ? { ...option, name, values }
        : option
    ));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOptions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="p-0">
        <div className="p-6 pb-4">
          <Label className="text-sm font-medium">Variant Settings</Label>
        </div>
        
        {options.length === 0 ? (
          <div className="px-6 pb-6">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full justify-center gap-2"
              onClick={handleAddOptions}
            >
              <Plus className="h-4 w-4" />
              Add options like size or color
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="border border-slate-300 rounded-lg mx-6 mb-6">
              <SortableContext items={options} strategy={verticalListSortingStrategy}>
                {options.map((option, index) => (
                  <SortableVariantInput 
                    key={option.id}
                    option={option}
                    onDelete={() => handleDelete(option.id)}
                    onDone={() => handleDone(option.id)}
                    onEdit={() => handleEdit(option.id)}
                    onUpdate={(name, values) => handleUpdateOption(option.id, name, values)}
                    isLast={index === options.length - 1}
                  />
                ))}
              </SortableContext>
              <div className="py-2 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddOptions}
                  className="w-full justify-center gap-2 hover:bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Add another option
                </Button>
              </div>
            </div>
          </DndContext>
        )}
        <SKUList options={options} onUpdateSkus={handleUpdateSkus} />
      </CardContent>
    </Card>
  );
}
