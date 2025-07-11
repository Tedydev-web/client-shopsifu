"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";

interface VariantInputProps {
  onDelete?: () => void;
  onDone?: () => void;
  onAddOption?: () => void;
  isLast?: boolean;
}

export function VariantInput({ 
  onDelete = () => {}, 
  onDone = () => {}, 
  onAddOption = () => console.log('Default onAddOption called'), 
  isLast = false 
}: VariantInputProps) {
  return (
    <div className={`bg-white ${!isLast ? 'border-b border-border' : ''}`}>
      <div className="p-6 space-y-4">
        {/* Option with drag handle positioned to the left */}
        <div className="flex items-start gap-3">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move mt-8" />
          <div className="flex-1 space-y-4">
            {/* Option name input */}
            <div className="space-y-2">
              <Label htmlFor="option-name" className="text-sm font-medium">
                Option name
              </Label>
              <Input
                id="option-name"
                placeholder="color"
                className="w-full"
              />
            </div>
            
            {/* Option values input - indented */}
            <div className="space-y-2 ml-6">
              <Label htmlFor="option-values" className="text-sm font-medium">
                Option values
              </Label>
              <Input
                id="option-values"
                placeholder="Add another value"
                className="w-full"
              />
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
          >
            Done
          </Button>
        </div>
        
        {/* Add another option button - only show for last option */}
        {isLast && (
          <div className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddOption}
              className="w-full justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add another option
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
