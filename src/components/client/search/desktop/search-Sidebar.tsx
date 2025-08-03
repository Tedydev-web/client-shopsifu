"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  ListFilter, 
  MapPin, 
  Truck, 
  Store, 
  X 
} from "lucide-react";

const locations = ['Đồng Nai', 'TP. Hồ Chí Minh', 'Bình Dương', 'Bà Rịa - Vũng Tàu'];
const categories = ['Nhà Cửa & Đời Sống', 'Phụ Kiện Nữ', 'Thời Trang Nữ', 'Sắc Đẹp'];
const shippingOptions = ['Nhanh', 'Tiết Kiệm'];
const brands = ['Nike', 'Adidas', 'Uniqlo', 'Zara', 'H&M'];

export default function SearchSidebar() {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string[]}>({
    locations: [],
    brands: [],
    shipping: []
  });
  
  // Hàm xử lý khi chọn/bỏ chọn checkbox
  const handleCheckboxChange = (section: string, item: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = {...prev};
      if (checked) {
        newFilters[section] = [...(prev[section] || []), item];
      } else {
        newFilters[section] = (prev[section] || []).filter(i => i !== item);
      }
      return newFilters;
    });
  };

  // Hàm xử lý khi nhấn nút xóa tất cả
  const handleClearAll = () => {
    setSelectedCategory(categories[0]);
    setSelectedFilters({
      locations: [],
      brands: [],
      shipping: []
    });
  };
  
  return (
    <aside className="w-64 shrink-0 space-y-6 text-sm">
      <CategorySection 
        title="Theo Danh Mục"
        icon={<ListFilter className="h-4 w-4" />}
        items={categories}
        selectedValue={selectedCategory}
        onValueChange={setSelectedCategory}
      />
      <Separator className="my-4" />
      <CheckboxFilterSection 
        title="Nơi Bán" 
        icon={<MapPin className="h-4 w-4" />}
        items={locations} 
        selectedItems={selectedFilters.locations}
        onCheckChange={(item, checked) => handleCheckboxChange('locations', item, checked)}
      />
      <Separator className="my-4" />
      <CheckboxFilterSection 
        title="Thương Hiệu" 
        icon={<Store className="h-4 w-4" />}
        items={brands}
        selectedItems={selectedFilters.brands}
        onCheckChange={(item, checked) => handleCheckboxChange('brands', item, checked)}
      />
      <Separator className="my-4" />
      <CheckboxFilterSection 
        title="Đơn Vị Vận Chuyển" 
        icon={<Truck className="h-4 w-4" />}
        items={shippingOptions}
        selectedItems={selectedFilters.shipping}
        onCheckChange={(item, checked) => handleCheckboxChange('shipping', item, checked)}
      />
      <Separator className="my-4" />
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearAll}
          className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <X className="h-3.5 w-3.5" />
          Xóa tất cả
        </Button>
      </div>
    </aside>
  );
}

// Component cho danh mục - chọn một
function CategorySection({ 
  title,
  icon,
  items, 
  selectedValue,
  onValueChange
}: { 
  title: string;
  icon?: React.ReactNode;
  items: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
        {icon}
        {title}
      </h3>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div 
            key={item} 
            className={`flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer transition-all duration-200 ${
              selectedValue === item 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={() => onValueChange(item)}
          >
            <span className={`text-sm ${selectedValue === item ? 'font-medium' : 'font-normal'}`}>
              {item}
            </span>
            {selectedValue === item && (
              <ChevronRight className="h-4 w-4 text-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Component cho filter dạng checkbox
function CheckboxFilterSection({ 
  title, 
  icon,
  items, 
  selectedItems = [],
  onCheckChange 
}: { 
  title: string; 
  icon?: React.ReactNode;
  items: string[];
  selectedItems?: string[];
  onCheckChange?: (item: string, checked: boolean) => void;
}) {
  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => {
          const isChecked = selectedItems.includes(item);
          return (
            <div 
              key={item} 
              className="flex items-center space-x-2 px-1 py-0.5 rounded-sm transition-colors hover:bg-gray-50"
            >
              <Checkbox 
                id={`${title}-${item}`} 
                checked={isChecked}
                onCheckedChange={(checked) => onCheckChange?.(item, checked === true)}
              />
              <Label 
                htmlFor={`${title}-${item}`} 
                className="text-sm font-normal cursor-pointer w-full"
              >
                {item}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
