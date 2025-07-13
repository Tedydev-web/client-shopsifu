"use client";

import { useState, useCallback } from "react";
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

export function VariantSettingsForm() {
  const [options, setOptions] = useState<OptionData[]>([]);
  const [skus, setSkus] = useState<Sku[]>([]);

  const handleUpdateSkus = useCallback((updatedSkus: Sku[]) => {
    setSkus(updatedSkus);
    // This is where you would typically integrate with a form library like react-hook-form
    console.log('SKUs updated in parent:', updatedSkus);
  }, []); // Empty dependency array ensures the function is created only once

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

  const handleAddOptions = () => {
    const newOption = {
      id: Date.now(),
      name: '',
      values: [],
      isDone: false
    };
    setOptions([...options, newOption]);
  };

  const handleDelete = (optionId: number) => {
    setOptions(prevOptions => prevOptions.filter(option => option.id !== optionId));
  };

  const handleDone = (optionId: number) => {
    setOptions(prevOptions => prevOptions.map(option => 
      option.id === optionId 
        ? { ...option, isDone: true }
        : option
    ));
  };

  const handleEdit = (optionId: number) => {
    setOptions(prevOptions => prevOptions.map(option => 
      option.id === optionId 
        ? { ...option, isDone: false }
        : option
    ));
  };

  const handleUpdateOption = (optionId: number, name: string, values: string[]) => {
    setOptions(prevOptions => prevOptions.map(option => 
      option.id === optionId 
        ? { ...option, name, values }
        : option
    ));
  };

  return (
    <Card className="bg-white">
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
            <div className="border rounded-lg mx-6 mb-6">
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
              <div className="py-2 border-t">
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
