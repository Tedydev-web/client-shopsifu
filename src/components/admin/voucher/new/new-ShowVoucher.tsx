"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X, Search, Package, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { VoucherFormState } from '../hook/useNewVoucher';
import { VoucherUseCase } from '../hook/voucher-config';
import { useProductsForVoucher } from '../hook/useProductsForVoucher';
import { Product } from '@/types/products.interface';

interface ShowVoucherProps {
  formData: VoucherFormState;
  updateFormData: (field: keyof VoucherFormState, value: any) => void;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
  voucherType: string;
}

export default function VoucherShowSettings({ formData, updateFormData, useCase }: ShowVoucherProps) {
  const [showProductSearch, setShowProductSearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Convert formData.selectedProducts to Product[] format for the hook
  const initialSelectedProducts: Product[] = (formData.selectedProducts || []).map(p => ({
    id: p.id,
    name: p.name,
    basePrice: p.price,
    virtualPrice: p.price,
    images: p.image ? [p.image] : [],
    // Add other required Product fields with default values
    publishedAt: null,
    brandId: 0,
    variants: [],
    productTranslations: [],
    message: '',
    createdAt: '',
    updatedAt: '',
    createdById: 0, // number type
    updatedById: null,
    deletedById: null,
    deletedAt: null,
  }));

  const {
    products,
    loading,
    hasMore,
    searchTerm,
    setSearchTerm,
    loadMore,
    selectedProducts,
    toggleProduct,
    clearSelection,
  } = useProductsForVoucher({
    initialSelected: initialSelectedProducts,
    onSelectionChange: (products: Product[]) => {
      // Convert back to the format expected by formData
      const formattedProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.basePrice || p.virtualPrice || 0,
        image: p.images?.[0] || '',
      }));
      updateFormData('selectedProducts', formattedProducts);
    },
  });

  // Handle infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !loading) {
      loadMore();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value) + '₫';
  };

  const RequiredLabel = ({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
    <Label htmlFor={htmlFor} className={cn("text-sm font-medium text-gray-900 flex items-center gap-2", className)}>
      {children}
      <span className="text-red-500">*</span>
    </Label>
  );

  const renderProductSelector = () => (
    <div className="w-full space-y-3">
      <Button 
        variant="outline" 
        onClick={() => setShowProductSearch(!showProductSearch)}
        className="border-gray-300 text-gray-800"
      >
        <Plus className="-ml-1 mr-2 h-4 w-4" />
        Chọn sản phẩm
      </Button>
      
      {showProductSearch && (
        <div className="border border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 text-gray-900"
            />
          </div>
          
          <div 
            ref={scrollRef}
            className="max-h-60 overflow-y-auto space-y-2"
            onScroll={handleScroll}
          >
            {products.map((product) => {
              const isSelected = selectedProducts.find(p => p.id === product.id);
              return (
                <div 
                  key={product.id} 
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors",
                    isSelected 
                      ? "bg-blue-50 border-blue-200" 
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  )}
                  onClick={() => toggleProduct(product)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(product.basePrice || product.virtualPrice || 0)}
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center",
                    isSelected 
                      ? "bg-blue-500 border-blue-500" 
                      : "border-gray-300"
                  )}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                <span className="ml-2 text-sm text-gray-500">Đang tải...</span>
              </div>
            )}
            
            {!loading && products.length === 0 && searchTerm && (
              <div className="text-center py-8 text-gray-600 text-sm">
                Không tìm thấy sản phẩm nào
              </div>
            )}

            {!loading && !hasMore && products.length > 0 && (
              <div className="text-center py-2 text-gray-500 text-xs">
                Đã hiển thị tất cả sản phẩm
              </div>
            )}
          </div>
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className="space-y-3 border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 font-medium">
              Đã chọn {selectedProducts.length} sản phẩm
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
            >
              Xóa tất cả
            </Button>
          </div>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-600">
                      {formatCurrency(product.basePrice || product.virtualPrice || 0)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleProduct(product)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDisplaySettings = () => {
    if (useCase === VoucherUseCase.PRIVATE) {
      // For PRIVATE case, show a disabled 'Không công khai' option.
      return (
        <div className="flex items-start space-x-6">
          <RequiredLabel htmlFor="display-type" className="mt-3 whitespace-nowrap">Cài đặt hiển thị</RequiredLabel>
          <RadioGroup value="PRIVATE" className="w-full">
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-100 border border-gray-200">
              <RadioGroupItem value="PRIVATE" id="display-private" checked={true} disabled />
              <Label htmlFor="display-private" className="font-normal text-gray-900">
                Không công khai
                <p className="text-xs text-gray-600 mt-1">Voucher sẽ không được hiển thị ở bất cứ đâu trên Shop.</p>
              </Label>
            </div>
          </RadioGroup>
        </div>
      );
    }

    // For other cases, show the regular radio group.
    return (
      <div className="flex items-start space-x-6">
        <RequiredLabel htmlFor="display-type" className="mt-3 whitespace-nowrap">Cài đặt hiển thị</RequiredLabel>
        <RadioGroup
          value={formData.displayType || 'PUBLIC'}
          onValueChange={(value) => updateFormData('displayType', value)}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2 rounded-lg hover:bg-gray-50 transition-colors p-1">
            <RadioGroupItem value="PUBLIC" id="display-public" />
            <Label htmlFor="display-public" className="font-normal cursor-pointer text-gray-900">Hiển thị ở nhiều nơi</Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg hover:bg-gray-50 transition-colors p-1">
            <RadioGroupItem value="PRIVATE" id="display-private" />
            <Label htmlFor="display-private" className="font-normal cursor-pointer text-gray-900">Không công khai</Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  const renderApplicableProducts = () => {
    switch(useCase) {
      case VoucherUseCase.SHOP:
        // For SHOP case, show a disabled 'Tất cả sản phẩm' option.
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel className="mt-3 whitespace-nowrap">Sản phẩm được áp dụng</RequiredLabel>
            <RadioGroup value="ALL" className="w-full">
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-100 border border-gray-200">
                <RadioGroupItem value="ALL" id="apply-all" checked={true} disabled />
                <Label htmlFor="apply-all" className="font-normal text-gray-900">
                  Tất cả sản phẩm
                  <p className="text-xs text-gray-600 mt-1">Voucher có thể áp dụng cho tất cả sản phẩm trong shop.</p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );
      case VoucherUseCase.PRODUCT:
        // For PRODUCT case, show only the product selector.
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel className="mt-3 whitespace-nowrap">Sản phẩm được áp dụng</RequiredLabel>
            {renderProductSelector()}
          </div>
        );
      case VoucherUseCase.PRIVATE:
      default:
        // For PRIVATE and default cases, show the radio group for product selection.
        return (
          <div className="flex items-start space-x-6">
            <RequiredLabel htmlFor="apply-type" className="mt-3 whitespace-nowrap">Sản phẩm được áp dụng</RequiredLabel>
            <RadioGroup
              value={formData.discountApplyType || 'ALL'}
              onValueChange={(value) => updateFormData('discountApplyType', value)}
              className="w-full space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="ALL" id="apply-all" />
                <Label htmlFor="apply-all" className="font-normal cursor-pointer text-gray-900">Tất cả sản phẩm</Label>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SPECIFIC" id="apply-specific" />
                  <Label htmlFor="apply-specific" className="font-normal cursor-pointer text-gray-900">Sản phẩm chỉ định</Label>
                </div>
                {formData.discountApplyType === 'SPECIFIC' && (
                  <div className="mt-4 pl-6 space-y-3">
                    {renderProductSelector()}
                  </div>
                )}
              </div>
            </RadioGroup>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cài đặt hiển thị và áp dụng</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {renderDisplaySettings()}
        {renderApplicableProducts()}
      </CardContent>
    </Card>
  );
}