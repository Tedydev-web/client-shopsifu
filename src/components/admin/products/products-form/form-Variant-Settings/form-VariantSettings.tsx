"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { VariantInput } from "./form-VariantInput";

interface OptionData {
  id: number;
  name: string;
  values: string[];
  isDone: boolean;
}

export function VariantSettingsForm() {
  const [options, setOptions] = useState<OptionData[]>([]);

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
          <div className="border rounded-lg mx-6 mb-6">
            {options.map((option, index) => (
              <VariantInput 
                key={option.id}
                option={option}
                onDelete={() => handleDelete(option.id)}
                onDone={() => handleDone(option.id)}
                onEdit={() => handleEdit(option.id)}
                onUpdate={(name, values) => handleUpdateOption(option.id, name, values)}
                isLast={index === options.length - 1}
              />
            ))}
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
        )}
      </CardContent>
    </Card>
  );
}
