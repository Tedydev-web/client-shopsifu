




"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Eye, Plus } from "lucide-react";

// Mock data - sẽ thay thế bằng API sau
const mockBrands = [
  { id: "1", name: "Apple" },
  { id: "2", name: "Samsung" },
  { id: "3", name: "BLACK WHITE" },
  { id: "4", name: "Nike" },
  { id: "5", name: "Adidas" },
];

const mockCategories = [
  { id: "1", name: "Điện thoại" },
  { id: "2", name: "Laptop" },
  { id: "3", name: "Phụ kiện" },
  { id: "4", name: "Thời trang" },
  { id: "5", name: "Giày dép" },
];

export default function AsideForm() {
  const t = useTranslations("admin.ModuleProduct");
  
  // State for product status
  const [productStatus, setProductStatus] = useState("published");
  
  // State for selections
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
              <Label htmlFor="vendor">Vendor</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  {mockBrands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="grid gap-3">
              <Label htmlFor="category">Danh mục</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}