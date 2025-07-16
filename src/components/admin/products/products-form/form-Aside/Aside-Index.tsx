

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, ChevronsUpDown, Loader2 } from "lucide-react";
import { BrandCbb } from "@/components/ui/combobox/BrandCbb";
import { CategoryModal } from "./form-ModalCategory";
import { ProductCreateRequest } from "@/types/products.interface";
import { categoryService } from "@/services/admin/categoryService";

interface ProductAsideFormProps {
  brandId: number | null;
  categories: number[];
  handleInputChange: (field: keyof ProductCreateRequest, value: any) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export function ProductAsideForm({
  brandId,
  categories,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  isEditMode,
}: ProductAsideFormProps) {
  // State for product status
  const [productStatus, setProductStatus] = useState("published");
  
  // State for category modal
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  
  // Handle initial category selection on component mount or categories change
  useEffect(() => {
    const fetchCategoryName = async () => {
      if (categories && categories.length > 0) {
        const categoryId = categories[0];
        setSelectedCategoryId(categoryId);
        
        try {
          // Fetch category details to get the name
          const categoryDetails = await categoryService.getById(categoryId);
          if (categoryDetails) {
            setSelectedCategoryName(categoryDetails.name);
          } else {
            setSelectedCategoryName(`ID Danh mục: ${categoryId}`);
          }
        } catch (error) {
          console.error("Failed to fetch category details:", error);
          setSelectedCategoryName(`ID Danh mục: ${categoryId}`);
        }
      }
    };
    
    fetchCategoryName();
  }, [categories]);

  // Handle product status change
  const handleStatusChange = (status: string) => {
    setProductStatus(status);
    // Nếu API của bạn cần lưu status
    // handleInputChange('status', status);
  };

  // Handle brand change
  const handleBrandChange = (id: number | null) => {
    handleInputChange('brandId', id);
  };

  // Handle category selection
  const handleCategoryConfirm = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    
    if (categoryId) {
      // Cập nhật danh sách categories
      handleInputChange('categories', [categoryId]);
      
      // Tự động fetch tên category khi chọn xong
      categoryService.getById(categoryId)
        .then(category => {
          if (category) {
            setSelectedCategoryName(category.name);
          }
        })
        .catch(error => {
          console.error("Error fetching category details:", error);
          setSelectedCategoryName(`ID Danh mục: ${categoryId}`);
        });
    } else {
      handleInputChange('categories', []);
      setSelectedCategoryName('');
    }
  };

  return (
    <div className="sticky top-4 grid auto-rows-max items-start gap-4 md:gap-8">
      {/* Action Buttons */}
      <div className="flex gap-2 w-full">
        {isEditMode && (
          <Button variant="outline" className="flex-1 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Xem sản phẩm
          </Button>
        )}
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="flex-1 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Cập nhật sản phẩm' : 'Thêm mới'}
        </Button>
      </div>

      {/* Card 1: Product Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hiển thị</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={productStatus} onValueChange={handleStatusChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="published" id="published" />
              <Label htmlFor="published" className="flex-1 cursor-pointer">
                Công Khai
              </Label>
            </div>
            <div className="text-sm text-muted-foreground ml-6 mb-3">
              {isEditMode ? 'Đã công khai' : 'Công khai ngay khi tạo'}
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="draft" id="draft" />
              <Label htmlFor="draft" className="flex-1 cursor-pointer">
                Nháp
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Card 2: Product Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            {/* Vendor/Brand */}
            <div className="grid gap-3">
              <Label htmlFor="vendor">Thương hiệu</Label>
              <BrandCbb value={brandId} onChange={handleBrandChange} />
            </div>

            {/* Category */}
            <div className="grid gap-3">
              <Label htmlFor="category">Danh mục</Label>
              <Button 
                type="button"
                variant="outline" 
                className="w-full justify-between font-normal" 
                onClick={() => setCategoryModalOpen(true)}
              >
                {selectedCategoryName || 'Chọn danh mục'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Modal */}
      <CategoryModal 
        open={isCategoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        onConfirm={handleCategoryConfirm}
      />
    </div>
  );
}
