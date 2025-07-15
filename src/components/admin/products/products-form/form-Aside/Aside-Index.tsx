




"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, ChevronsUpDown } from "lucide-react";
import { BrandCbb } from "@/components/ui/combobox/BrandCbb";
import { CategoryModal } from "./form-ModalCategory";

export default function AsideForm() {
  const t = useTranslations("admin.ModuleProduct");
  
  // State for product status
  const [productStatus, setProductStatus] = useState("published");
  
  // State for selections
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  // Giả sử chúng ta có cách để lấy tên từ ID, tạm thời để trống
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  return (
    <div className="sticky top-4 grid auto-rows-max items-start gap-4 md:gap-8">
      {/* Action Buttons */}
      <div className="flex gap-2 w-full">
        <Button variant="outline" className="flex-1 flex items-center gap-2">
          <Eye className="h-4 w-4" />
          View
        </Button>
        <Button className="flex-1 flex items-center gap-2">
          Thêm mới
        </Button>
      </div>

      {/* Card 1: Product Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hiển thị</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={productStatus} onValueChange={setProductStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="published" id="published" />
              <Label htmlFor="published" className="flex-1 cursor-pointer">
                Công Khai
              </Label>
            </div>
            <div className="text-sm text-muted-foreground ml-6 mb-3">
              10 tháng 01, 2025 lúc 00:00
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
              <BrandCbb value={selectedBrand} onChange={setSelectedBrand} />
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

      <CategoryModal 
        open={isCategoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        onConfirm={(id) => {
          setSelectedCategoryId(id);
          // TODO: Fetch the full category details to get the name
          // For now, we'll just use the ID as a placeholder name
          if (id) {
            setSelectedCategoryName(`ID Danh mục: ${id}`);
          }
          else {
            setSelectedCategoryName('');
          }
        }}
      />
    </div>
  );
}