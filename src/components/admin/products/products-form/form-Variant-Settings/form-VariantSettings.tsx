"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { VariantInput } from "./form-VariantInput";

export function VariantSettingsForm() {
  const [options, setOptions] = useState<number[]>([]);

  const handleAddOptions = () => {
    setOptions([...options, Date.now()]); // Use timestamp as unique ID
  };

  const handleDelete = (optionId: number) => {
    setOptions(options.filter(id => id !== optionId));
  };

  const handleDone = (optionId: number) => {
    // Handle done logic here if needed
    console.log('Option done:', optionId);
  };

  const addOptionDirectly = () => {
    const newId = Date.now();
    setOptions(prevOptions => [...prevOptions, newId]);
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
            {options.map((optionId, index) => (
              <VariantInput 
                key={optionId}
                onDelete={() => handleDelete(optionId)}
                onDone={() => handleDone(optionId)}
                onAddOption={addOptionDirectly}
                isLast={index === options.length - 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
