
// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Eye, ChevronsUpDown, Loader2 } from "lucide-react";
// import { BrandCbb } from "@/components/ui/combobox/BrandCbb";
// import { CategoryModal } from "./form-ModalCategory";
// import { ProductCreateRequest } from "@/types/products.interface";
// import { categoryService } from "@/services/admin/categoryService";

// interface ProductAsideFormProps {
//   brandId: number | null;
//   categories: number[];
//   handleInputChange: (field: keyof ProductCreateRequest, value: any) => void;
//   handleSubmit: () => void;
//   isSubmitting: boolean;
//   isEditMode: boolean;
// }

// export function ProductAsideForm({
//   brandId,
//   categories,
//   handleInputChange,
//   handleSubmit,
//   isSubmitting,
//   isEditMode,
// }: ProductAsideFormProps) {
//   // State for product status
//   const [productStatus, setProductStatus] = useState("published");
  
//   // State for category modal
//   const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
//   const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
//   const [selectedCategoryPath, setSelectedCategoryPath] = useState<string>('');
  
//   // Handle initial category selection on component mount or categories change
//   useEffect(() => {
//     const fetchCategoryPaths = async () => {
//       if (categories && categories.length > 0) {
//         setSelectedCategoryIds(categories);
        
//         try {
//           // Xây dựng đường dẫn hiển thị cho các categories đã chọn
//           const paths: string[] = [];
          
//           for (const categoryId of categories) {
//             // Lấy thông tin category hiện tại
//             const category = await categoryService.getById(categoryId.toString());
            
//             if (category) {
//               // Nếu có parentId, lấy thêm thông tin của parent
//               if (category.data.parentCategoryId) {
//                 const parentCategory = await categoryService.getById(category.data.parentCategoryId.toString());
//                 if (parentCategory) {
//                   paths.push(`${parentCategory.data.name} > ${category.data.name}`);
//                 } else {
//                   paths.push(category.data.name);
//                 }
//               } else {
//                 paths.push(category.data.name);
//               }
//             }
//           }
          
//           // Nối các đường dẫn thành một chuỗi
//           setSelectedCategoryPath(paths.join(', '));
//         } catch (error) {
//           console.error("Failed to fetch category details:", error);
//           setSelectedCategoryPath(`Danh mục đã chọn: ${categories.join(', ')}`);
//         }
//       } else {
//         setSelectedCategoryPath('');
//       }
//     };
    
//     fetchCategoryPaths();
//   }, [categories]);

//   // Handle product status change
//   const handleStatusChange = (status: string) => {
//     setProductStatus(status);
//     // Nếu API của bạn cần lưu status
//     // handleInputChange('status', status);
//   };

//   // Handle brand change
//   const handleBrandChange = (id: number | null) => {
//     handleInputChange('brandId', id);
//   };

//   // Handle category selection from modal
//   const handleCategoryConfirm = (categoryIds: number[], selectionPath: string) => {
//     setSelectedCategoryIds(categoryIds);
//     setSelectedCategoryPath(selectionPath);
    
//     // Cập nhật categories trong form data
//     handleInputChange('categories', categoryIds);
//   };

//   return (
//     <div className="sticky top-4 grid auto-rows-max items-start gap-4 md:gap-8">
//       {/* Action Buttons */}
//       <div className="flex gap-2 w-full">
//         {isEditMode && (
//           <Button variant="outline" className="flex-1 flex items-center gap-2">
//             <Eye className="h-4 w-4" />
//             Xem sản phẩm
//           </Button>
//         )}
//         <Button 
//           onClick={handleSubmit} 
//           disabled={isSubmitting} 
//           className="flex-1 flex items-center gap-2"
//         >
//           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           {isEditMode ? 'Cập nhật sản phẩm' : 'Thêm mới'}
//         </Button>
//       </div>

//       {/* Card 1: Product Status */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-base">Hiển thị</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <RadioGroup value={productStatus} onValueChange={handleStatusChange}>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="published" id="published" />
//               <Label htmlFor="published" className="flex-1 cursor-pointer">
//                 Công Khai
//               </Label>
//             </div>
//             <div className="text-sm text-muted-foreground ml-6 mb-3">
//               {isEditMode ? 'Đã công khai' : 'Công khai ngay khi tạo'}
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="draft" id="draft" />
//               <Label htmlFor="draft" className="flex-1 cursor-pointer">
//                 Nháp
//               </Label>
//             </div>
//           </RadioGroup>
//         </CardContent>
//       </Card>

//       {/* Card 2: Product Details */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="grid gap-6">
//             {/* Vendor/Brand */}
//             <div className="grid gap-3">
//               <Label htmlFor="vendor">Thương hiệu</Label>
//               <BrandCbb value={brandId} onChange={handleBrandChange} />
//             </div>

//             {/* Category */}
//             <div className="grid gap-3">
//               <Label htmlFor="category">Danh mục</Label>
//               <Button 
//                 type="button"
//                 variant="outline" 
//                 className="w-full justify-between font-normal text-left" 
//                 onClick={() => setCategoryModalOpen(true)}
//               >
//                 <span className="truncate">
//                   {selectedCategoryPath || 'Chọn danh mục'}
//                 </span>
//                 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Category Modal */}
//       <CategoryModal 
//         open={isCategoryModalOpen}
//         onOpenChange={setCategoryModalOpen}
//         onConfirm={handleCategoryConfirm}
//         initialSelectedIds={selectedCategoryIds}
//       />
//     </div>
//   );
// }


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
  publishedAt?: string | null; 
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
  publishedAt,
}: ProductAsideFormProps) {
  // State for product status
  const [productStatus, setProductStatus] = useState("published");
  
  // State for category modal
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string>('');
  const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(false);

  useEffect(() => {
    setProductStatus(publishedAt ? "published" : "draft");
  }, [publishedAt]);

  useEffect(() => {
  // Chỉ fetch khi có categories và không phải từ modal xác nhận
  if (categories && categories.length > 0 && selectedCategoryPath === '') {
    const fetchCategoryData = async () => {
      setIsLoadingCategory(true);
      try {
        // Fetch tất cả categories trong một lần để tránh nhiều API calls
        const response = await categoryService.getAll();
        
        // Lấy mảng categories từ response
        const allCategories = response.data || response;
        
        // Mảng để lưu tên đường dẫn của các danh mục đã chọn
        const categoryPaths = [];
        
        // Xử lý từng category ID trong mảng categories
        for (const categoryId of categories) {
          // Tìm category theo ID trong danh sách đã fetch
          const category = allCategories.find(c => c.id === categoryId);
          
          if (category) {
            // Nếu tìm thấy category
            if (category.parentCategoryId) {
              // Tìm parent category nếu có parentCategoryId
              const parentCategory = allCategories.find(c => c.id === category.parentCategoryId);
              
              if (parentCategory) {
                // Hiển thị dạng "Parent > Child"
                categoryPaths.push(`${parentCategory.name} > ${category.name}`);
              } else {
                // Nếu không tìm được parent, chỉ hiển thị tên category
                categoryPaths.push(category.name);
              }
            } else {
              // Nếu là category gốc (không có parent)
              categoryPaths.push(category.name);
            }
          } else {
            // Trường hợp không tìm thấy category trong allCategories
            try {
              // Thử gọi API riêng để lấy chi tiết category này
              const categoryDetail = await categoryService.getById(categoryId.toString());
              
              if (categoryDetail && categoryDetail.data) {
                const categoryData = categoryDetail.data;
                
                if (categoryData.parentCategoryId) {
                  // Nếu có parent, gọi API để lấy thông tin parent
                  const parentDetail = await categoryService.getById(categoryData.parentCategoryId.toString());
                  
                  if (parentDetail && parentDetail.data) {
                    categoryPaths.push(`${parentDetail.data.name} > ${categoryData.name}`);
                  } else {
                    categoryPaths.push(categoryData.name);
                  }
                } else {
                  categoryPaths.push(categoryData.name);
                }
              } else {
                categoryPaths.push('Danh mục không tìm thấy');
              }
            } catch (detailError) {
              console.error(`Failed to fetch details for category ${categoryId}:`, detailError);
              categoryPaths.push('Không thể tải thông tin');
            }
          }
        }
        
        // Cập nhật state
        setSelectedCategoryIds(categories);
        setSelectedCategoryPath(categoryPaths.join(', '));
      } catch (error) {
        console.error("Failed to fetch category data:", error);
        // Fallback - Hiển thị thông báo lỗi
        setSelectedCategoryPath('Không thể tải thông tin danh mục');
      } finally {
        setIsLoadingCategory(false);
      }
    };
    
    fetchCategoryData();
  }
}, [categories, selectedCategoryPath]);

  // Handle product status change
  const handleStatusChange = (status: string) => {
    setProductStatus(status);
    
    // Cập nhật publishedAt dựa vào status đã chọn
    if (status === "published") {
      // Nếu công khai, đặt publishedAt là thời gian hiện tại
      handleInputChange('publishedAt', new Date().toISOString());
    } else {
      // Nếu là nháp, đặt publishedAt là null
      handleInputChange('publishedAt', null);
    }
  };

  // Handle brand change
  const handleBrandChange = (id: number | null) => {
    handleInputChange('brandId', id);
  };

  // Handle category selection from modal
  const handleCategoryConfirm = (categoryIds: number[], selectionPath: string) => {
    // Cập nhật cả ID và path từ modal
    setSelectedCategoryIds(categoryIds);
    setSelectedCategoryPath(selectionPath);
    
    // Cập nhật form state
    handleInputChange('categories', categoryIds);
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
              {publishedAt ? (
                <span>Đã công khai lúc: {new Date(publishedAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              ) : (
                <span>{isEditMode ? 'Chưa công khai' : 'Công khai ngay khi tạo'}</span>
              )}
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
                className="w-full justify-between font-normal text-left" 
                onClick={() => setCategoryModalOpen(true)}
                disabled={isLoadingCategory}
              >
                {isLoadingCategory ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang tải...
                  </span>
                ) : (
                  <span className="truncate">
                    {selectedCategoryPath || 'Chọn danh mục'}
                  </span>
                )}
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
        initialSelectedIds={selectedCategoryIds}
      />
    </div>
  );
}