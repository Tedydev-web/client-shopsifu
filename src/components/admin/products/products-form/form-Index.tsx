"use client";

import { useProductsForm } from "./useProductsForm";
import { ProductDetail } from "@/types/products.interface";

// Import các component con
import { ProductBasicInfoForm } from "./form-BasicInfo";
import { ProductAsideForm } from "./form-Aside/Aside-Index";
import { VariantSettingsIndex } from "./form-Variant-Settings/variantSettings-Index";
import { ProductSpecificationsForm } from "./form-Specifications";

interface ProductFormProps {
  initialData?: ProductDetail | null;
  onCreateSuccess?: (newProductId: string) => void;
}

function ProductForm({ initialData, onCreateSuccess }: ProductFormProps) {
  const {
    productData,
    isEditMode,
    isSubmitting,
    handleInputChange,
    setVariants,
    updateSingleSku,
    handleSubmit,
    handleSaveAndAddNew,
  } = useProductsForm({ initialData, onCreateSuccess });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
      {/* === CỘT CHÍNH BÊN TRÁI === */}
      <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
        
        {/* Component chứa toàn bộ thông tin cơ bản */}
        <ProductBasicInfoForm 
          productData={productData}
          handleInputChange={handleInputChange}
        />

        {/* Component quản lý thuộc tính và SKU */}
        <VariantSettingsIndex 
          variants={productData.variants}
          skus={productData.skus}
          setVariants={setVariants}
          updateSingleSku={updateSingleSku}
        />
        
        {/* Component quản lý thông số kỹ thuật sản phẩm */}
        <ProductSpecificationsForm 
          specifications={productData.specifications || []}
          handleSpecificationsChange={(specs) => handleInputChange('specifications', specs)}
        />
    
      </div>

      {/* === CỘT PHỤ BÊN PHẢI === */}
      <div className="lg:col-span-1 grid auto-rows-max items-start gap-4 md:gap-8">
        
        <ProductAsideForm 
          brandId={productData.brandId}
          categories={productData.categories}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleSaveAndAddNew={handleSaveAndAddNew}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
        />

      </div>
    </div>
  );
}

// Export component để có thể import động
export { ProductForm };