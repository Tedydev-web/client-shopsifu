'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCbbBrand } from '@/hooks/combobox/useCbbBrand';

interface BrandCbbProps {
  value?: number | string | null;
  onChange: (value: number | null) => void;
}

export function BrandCbb({ value, onChange }: BrandCbbProps) {
  const [open, setOpen] = React.useState(false);
  const { brands, loading } = useCbbBrand();

  const selectedValue = value ? Number(value) : null;
  const selectedBrand = brands.find((brand) => brand.value === selectedValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {loading ? 'Đang tải...' : selectedBrand ? selectedBrand.label : 'Chọn thương hiệu...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Tìm thương hiệu..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy thương hiệu.</CommandEmpty>
            <CommandGroup>
              {brands.map((brand) => (
                <CommandItem
                  key={brand.value}
                  value={brand.label} // Command uses this for searching
                  onSelect={() => {
                    onChange(brand.value === selectedValue ? null : brand.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValue === brand.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {brand.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
