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
}

export function ProductsFilter<TData>({ table }: ProductsFilterProps<TData>) {
  const t = useTranslations("admin.ModuleProduct.Filter");

  const categoryColumn = table.getColumn("category");
  const priceColumn = table.getColumn("price");
  const sizeColumn = table.getColumn("size");

  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000]);

  const applyPriceFilter = () => {
    priceColumn?.setFilterValue(priceRange);
  };

  const clearPriceFilter = () => {
    setPriceRange([0, 1000]);
    priceColumn?.setFilterValue(undefined);
  };

  const selectedCategories = new Set(categoryColumn?.getFilterValue() as string[]);
  const selectedSizes = new Set(sizeColumn?.getFilterValue() as string[]);

  return (
    <div className="flex items-center space-x-2">
      {/* --- Bộ lọc Danh mục (Multi-select) --- */}
      {categoryColumn && (
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
      )}

      {/* --- Bộ lọc Giá --- */}
      {priceColumn && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("price")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">{t("priceRange")}</h4>
              <Slider
                defaultValue={[0, 1000]}
                value={priceRange}
                min={0}
                max={1000}
                step={50}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0]}
                </span>
                <span className="text-sm text-muted-foreground">
                  ${priceRange[1]}
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

      {/* --- Bộ lọc Kích cỡ --- */}
      {sizeColumn && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("size")}
              {selectedSizes.size > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedSizes.size}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="space-y-3">
              <h4 className="font-medium leading-none">{t("size")}</h4>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => {
                  const isSelected = selectedSizes.has(size);
                  return (
                    <Button
                      key={size}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (isSelected) {
                          selectedSizes.delete(size);
                        } else {
                          selectedSizes.add(size);
                        }
                        const filterValues = Array.from(selectedSizes);
                        sizeColumn?.setFilterValue(
                          filterValues.length ? filterValues : undefined
                        );
                      }}
                      className="h-8"
                    >
                      {size}
                    </Button>
                  );
                })}
              </div>
              {selectedSizes.size > 0 && (
                <>
                  <Separator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => sizeColumn?.setFilterValue(undefined)}
                  >
                    Clear
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}