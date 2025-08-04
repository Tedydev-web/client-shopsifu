"use client";

import { useState, useEffect } from "react";
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
  X, 
  ChevronDown 
} from "lucide-react";
import { useCbbCategory } from '@/hooks/combobox/useCbbCategory';
import { createCategorySlug } from '@/utils/slugify';
import { useRouter } from 'next/navigation';

const locations = ['Đồng Nai', 'TP. Hồ Chí Minh', 'Bình Dương', 'Bà Rịa - Vũng Tàu'];
const shippingOptions = ['Nhanh', 'Tiết Kiệm'];
const brands = ['Nike', 'Adidas', 'Uniqlo', 'Zara', 'H&M'];

interface SearchSidebarProps {
  categoryId?: string | null;
}

interface CategoryOption {
  value: string;
  label: string;
  icon?: string | null;
  parentCategoryId?: string | null;
}

export default function SearchSidebar({ categoryId }: SearchSidebarProps) {
  const router = useRouter();
  
  // State để lưu thông tin danh mục
  const [parentCategory, setParentCategory] = useState<{value: string, label: string} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || "");
  
  // *** KEY: State để control việc fetch subcategories ***
  const [parentCategoryIdForFetch, setParentCategoryIdForFetch] = useState<string | null>(null);
  
  // Luôn lấy danh mục cha (top level categories)
  const { categories: parentCategories, loading: loadingParentCategories } = useCbbCategory(null);
  
  // *** KEY: Chỉ fetch subcategories khi parentCategoryIdForFetch thay đổi ***
  const { categories: subcategories, loading: loadingSubcategories } = useCbbCategory(parentCategoryIdForFetch);
  
  // *** DEBUG: Log để kiểm tra data flow ***
  console.log('DEBUG SearchSidebar:', {
    categoryId,
    parentCategoryIdForFetch,
    subcategories: subcategories.map(s => s.label),
    selectedCategory,
    parentCategory: parentCategory?.label
  });
  
  // Xử lý logic khi có categoryId từ URL
  useEffect(() => {
    console.log('useEffect triggered:', { categoryId, parentCategories: parentCategories.length });
    
    if (categoryId && parentCategories.length > 0) {
      // Kiểm tra xem categoryId có phải là danh mục cha không
      const parentCategoryFound = parentCategories.find(cat => cat.value === categoryId);
      
      if (parentCategoryFound) {
        console.log('Found parent category:', parentCategoryFound.label);
        // *** Là danh mục cha: set để fetch subcategories ***
        setParentCategory(parentCategoryFound);
        setSelectedCategory(categoryId);
        setParentCategoryIdForFetch(categoryId); // Trigger fetch subcategories
      } else {
        console.log('Category is subcategory, finding parent...');
        // *** Là danh mục con: tìm parent của nó ***
        findParentOfSubcategory(categoryId);
      }
    } else if (!categoryId) {
      console.log('No categoryId, resetting...');
      // Reset về trạng thái ban đầu
      setParentCategory(null);
      setSelectedCategory("");
      setParentCategoryIdForFetch(null);
    }
  }, [categoryId, parentCategories]);
  
  // Function để tìm parent category của một subcategory
  const findParentOfSubcategory = (subCategoryId: string) => {
    console.log('Finding parent for subcategory:', subCategoryId);
    
    // Nếu đã có subcategories loaded, kiểm tra xem subcategory có trong đó không
    if (subcategories.length > 0 && parentCategory) {
      const foundInCurrent = subcategories.find(sub => sub.value === subCategoryId);
      if (foundInCurrent) {
        console.log('Found subcategory in current list, keeping parent:', parentCategory.label);
        setSelectedCategory(subCategoryId);
        // *** KHÔNG thay đổi parentCategoryIdForFetch để giữ nguyên subcategories list ***
        return;
      }
    }
    
    // *** Nếu không tìm thấy trong subcategories hiện tại, 
    // có thể subcategory này thuộc parent khác ***
    // Nhưng để đơn giản, ta sẽ set về trạng thái "tất cả danh mục"
    console.log('Subcategory not found in current parent, resetting to root');
    setParentCategory(null);
    setSelectedCategory(subCategoryId);
    setParentCategoryIdForFetch(null); // Reset về root level
  };
  
  // Effect để xử lý khi subcategories được load và kiểm tra subcategory
  useEffect(() => {
    console.log('subcategories effect:', { 
      categoryId, 
      subcategoriesLength: subcategories.length, 
      parentCategoryIdForFetch 
    });
    
    // Chỉ xử lý khi:
    // 1. Có categoryId từ URL
    // 2. categoryId không phải là parent category 
    // 3. Đã có subcategories được load
    if (categoryId && 
        subcategories.length > 0 && 
        !parentCategories.find(cat => cat.value === categoryId)) {
      
      const foundSubcategory = subcategories.find(sub => sub.value === categoryId);
      if (foundSubcategory) {
        console.log('Setting selected subcategory:', foundSubcategory.label);
        setSelectedCategory(categoryId);
        
        // Tìm và set parent category tương ứng
        const parentFound = parentCategories.find(parent => parent.value === parentCategoryIdForFetch);
        if (parentFound && (!parentCategory || parentCategory.value !== parentFound.value)) {
          console.log('Setting parent category:', parentFound.label);
          setParentCategory(parentFound);
        }
      }
    }
  }, [subcategories, categoryId, parentCategories, parentCategoryIdForFetch, parentCategory]);
  
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string[]}>({
    locations: [],
    brands: [],
    shipping: []
  });
  
  // *** UPDATED: Logic xử lý chọn danh mục ***
  const handleCategorySelect = (categoryId: string, categoryName?: string) => {
    console.log('handleCategorySelect:', { categoryId, categoryName });
    
    if (categoryId === selectedCategory) return;
    
    if (!categoryId) {
      router.push('/');
      return;
    }
    
    // Kiểm tra xem có phải là parent category không
    const isParentCategory = parentCategories.find(cat => cat.value === categoryId);
    
    if (isParentCategory) {
      console.log('Selecting NEW parent category:', isParentCategory.label);
      // *** Chọn parent category mới: trigger fetch subcategories mới ***
      setParentCategory(isParentCategory);
      setSelectedCategory(categoryId);
      setParentCategoryIdForFetch(categoryId); // Trigger fetch subcategories mới
    } else {
      console.log('Selecting subcategory, keeping current subcategories list');
      // *** Chọn subcategory: CHỈ update selectedCategory, KHÔNG thay đổi parentCategoryIdForFetch ***
      setSelectedCategory(categoryId);
      // parentCategoryIdForFetch giữ nguyên → subcategories list không thay đổi
    }
    
    // Tìm tên và redirect
    let name = categoryName;
    if (!name) {
      if (isParentCategory) {
        name = isParentCategory.label;
      } else {
        const subcat = subcategories.find(cat => cat.value === categoryId);
        name = subcat?.label || '';
      }
    }
    
    if (name) {
      const slug = createCategorySlug(name, categoryId);
      router.push(slug);
    }
  };
  
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

  const handleClearAll = () => {
    router.push('/');
    setSelectedFilters({
      locations: [],
      brands: [],
      shipping: []
    });
  };
  
  return (
    <aside className="w-64 shrink-0 space-y-6 text-sm">
      <CategorySectionWithParent 
        title="Theo Danh Mục"
        icon={<ListFilter className="h-4 w-4" />}
        parentCategory={parentCategory?.label || "Tất cả danh mục"}
        parentCategoryId={parentCategory?.value || ""}
        items={subcategories.map(cat => cat.label)}
        itemIds={subcategories.map(cat => cat.value)}
        selectedValue={selectedCategory}
        onValueChange={handleCategorySelect}
        isLoading={loadingSubcategories}
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
          className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
          onClick={handleClearAll}
        >
          <X className="h-3.5 w-3.5 mr-1.5" />
          Xóa tất cả
        </Button>
      </div>
    </aside>
  );
}

function CategorySectionWithParent({ 
  title, 
  icon,
  parentCategory, 
  parentCategoryId = "",
  items,
  itemIds = [],
  selectedValue,
  onValueChange,
  isLoading = false,
}: { 
  title: string; 
  icon?: React.ReactNode;
  parentCategory: string;
  parentCategoryId?: string;
  items: string[];
  itemIds?: string[];
  selectedValue: string;
  onValueChange: (value: string, name?: string) => void;
  isLoading?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  
  const displayItems = items.length <= 5 ? items : (expanded ? items : items.slice(0, 5));
  const displayItemIds = items.length <= 5 ? itemIds : (expanded ? itemIds : itemIds.slice(0, 5));
  
  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
        {icon}
        {title}
      </h3>
      
      <div className="space-y-1">
        {/* Danh mục cha */}
        <div
          className={`px-3 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
            selectedValue === parentCategoryId ? "font-bold text-red-600" : "hover:bg-gray-50 font-medium"
          }`}
          onClick={() => onValueChange(parentCategoryId, parentCategory)}
        >
          <div className="flex items-center justify-between">
            <span>{parentCategory}</span>
            {selectedValue === parentCategoryId && <ChevronRight className="h-4 w-4 text-red-500" />}
          </div>
        </div>
        
        {/* Danh mục con */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse h-6 bg-gray-100 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {displayItems.map((item, index) => {
              const itemId = itemIds[index] || "";
              return (
                <div
                  key={item}
                  className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors duration-200 ${
                    selectedValue === itemId
                      ? "bg-red-50 text-red-600" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onValueChange(itemId, item)}
                >
                  <div className="flex items-center justify-between">
                    <span>{item}</span>
                    {selectedValue === itemId && <ChevronRight className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
              );
            })}
            
            {items.length > 5 && (
              <button 
                className="text-red-600 hover:text-red-800 text-sm font-medium mt-1 flex items-center"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
                <ChevronDown className={`h-3.5 w-3.5 ml-1 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              />
              <Label 
                htmlFor={`${title}-${item}`} 
                className={`text-sm cursor-pointer w-full ${isChecked ? "text-red-600" : "font-normal"}`}
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