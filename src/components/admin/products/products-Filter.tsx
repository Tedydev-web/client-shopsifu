"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import type { Table, Column } from "@tanstack/react-table"
import { Check, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

// --- Dữ liệu giả định cho các bộ lọc ---
// Thay thế bằng dữ liệu từ API của bạn
const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "home-goods", label: "Home Goods" },
];
const sizes = ["S", "M", "L", "XL", "XXL"];

interface ProductsFilterProps<TData> {
  table: Table<TData>;
  onPriceFilterChange?: (minPrice: number | null, maxPrice: number | null) => void;
}

export function ProductsFilter<TData>({ table, onPriceFilterChange }: ProductsFilterProps<TData>) {
  const t = useTranslations("admin.ModuleProduct.Filter");

  // const categoryColumn = table.getColumn("category");
  const priceColumn = table.getColumn("price");
  // const sizeColumn = table.getColumn("size");

  // Giá từ 1 nghìn đến 10 triệu VND
  const [priceRange, setPriceRange] = React.useState<[number, number]>([1000, 10000000]);
  
  // Apply server-side filtering via API parameters
  const applyPriceFilter = () => {
    if (onPriceFilterChange) {
      console.log('Applying price filter with values:', priceRange);
      // Pass min and max price to the API handler
      onPriceFilterChange(priceRange[0], priceRange[1]);
    }
  };

  const clearPriceFilter = () => {
    console.log('Clearing price filter');
    setPriceRange([1000, 10000000]);
    if (onPriceFilterChange) {
      // Clear the price filter by passing null values
      onPriceFilterChange(null, null);
    }
  };

  // const selectedCategories = new Set(categoryColumn?.getFilterValue() as string[]);
  // const selectedSizes = new Set(sizeColumn?.getFilterValue() as string[]);

  return (
    <div className="flex items-center space-x-2">
      {/* --- Bộ lọc Danh mục (Multi-select) --- */}
      {/* {categoryColumn && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("category")}
              {selectedCategories.size > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedCategories.size}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder={t("category")} />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((option) => {
                    const isSelected = selectedCategories.has(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          if (isSelected) {
                            selectedCategories.delete(option.value);
                          } else {
                            selectedCategories.add(option.value);
                          }
                          const filterValues = Array.from(selectedCategories);
                          categoryColumn?.setFilterValue(
                            filterValues.length ? filterValues : undefined
                          );
                        }}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className={cn("h-4 w-4")} />
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {selectedCategories.size > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => categoryColumn?.setFilterValue(undefined)}
                        className="justify-center text-center"
                      >
                        Clear filters
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )} */}

      {/* --- Bộ lọc Giá --- */}
      {priceColumn && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "h-8",
                priceRange[0] !== 1000 || priceRange[1] !== 10000000 
                  ? "border-primary/50 bg-primary/10" 
                  : "border-dashed"
              )}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("price")}
              {(priceRange[0] !== 1000 || priceRange[1] !== 10000000) && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND',
                      notation: 'compact' 
                    }).format(priceRange[0])} - {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND', 
                      notation: 'compact'
                    }).format(priceRange[1])}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">{t("priceRange")}</h4>
              <Slider
                defaultValue={[1000, 10000000]}
                value={priceRange}
                min={1000}
                max={10000000}
                step={100000}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0])}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1])}
                </span>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="ghost" size="sm" onClick={clearPriceFilter}>
                  Clear
                </Button>
                <Button size="sm" onClick={applyPriceFilter}>
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}