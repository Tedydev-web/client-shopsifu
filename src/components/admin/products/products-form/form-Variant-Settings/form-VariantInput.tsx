"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, X } from "lucide-react";

interface OptionData {
  id: number;
  name: string;
  values: string[];
  isDone: boolean;
}

interface VariantInputProps {
  option: OptionData;
  onDelete: () => void;
  onDone: () => void;
  onEdit: () => void;
  onUpdate: (name: string, values: string[]) => void;
  isLast: boolean;
}

export function VariantInput({ 
  option,
  onDelete,
  onDone,
  onEdit,
  onUpdate,
  isLast = false 
}: VariantInputProps) {
  const [localName, setLocalName] = useState(option.name);
  const [currentValue, setCurrentValue] = useState("");
  const [localValues, setLocalValues] = useState<string[]>(option.values);

  // Sync local state with props when option changes
  useEffect(() => {
    setLocalName(option.name);
    setLocalValues(option.values);
  }, [option]);

  // Update parent only when local state is intentionally changed
  const handleNameChange = (newName: string) => {
    setLocalName(newName);
    onUpdate(newName, localValues);
  };

  const handleAddValue = () => {
    if (currentValue.trim() && !localValues.includes(currentValue.trim())) {
      const newValues = [...localValues, currentValue.trim()];
      setLocalValues(newValues);
      setCurrentValue("");
      onUpdate(localName, newValues);
    }
  };

  const handleRemoveValue = (valueToRemove: string) => {
    const newValues = localValues.filter(v => v !== valueToRemove);
    setLocalValues(newValues);
    onUpdate(localName, newValues);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddValue();
    }
  };

  if (option.isDone) {
    return (
      <div className={`bg-white ${!isLast ? 'border-b border-border' : ''}`}>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            <div 
            className="flex-1 cursor-pointer"
            onClick={onEdit}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option.name}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {option.values.map((value, idx) => (
                  <Badge key={idx} variant="secondary">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${!isLast ? 'border-b border-border' : ''}`}>
      <div className="p-6 space-y-4">
        {/* Option with drag handle positioned to the left */}
        <div className="flex items-start gap-3">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move mt-8" />
          <div className="flex-1 space-y-4">
            {/* Option name input */}
            <div className="space-y-2">
              <Label htmlFor={`option-name-${option.id}`} className="text-sm font-medium">
                Option name
              </Label>
              <Input
                id={`option-name-${option.id}`}
                placeholder="color"
                className="w-full"
                value={localName}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            
            {/* Option values input - indented */}
            <div className="space-y-2 ml-6">
              <Label htmlFor={`option-values-${option.id}`} className="text-sm font-medium">
                Option values
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {localValues.map((value, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {value}
                    <button
                      onClick={() => handleRemoveValue(value)}
                      className="ml-1 hover:text-destructive"
                      title={`Remove ${value}`}
                      aria-label={`Remove ${value}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                id={`option-values-${option.id}`}
                placeholder="Add another value"
                className="w-full"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddValue}
                className="mt-2"
              >
                Add value
              </Button>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onDone}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!localName || localValues.length === 0}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
