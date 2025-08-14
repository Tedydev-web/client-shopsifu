"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X, Search, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { VoucherFormState } from '../hook/useNewVoucher';
import { VoucherUseCase } from '../hook/voucher-config';

interface ShowVoucherProps {
  formData: VoucherFormState;
  updateFormData: (field: keyof VoucherFormState, value: any) => void;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
  voucherType: string;
}

export default function VoucherShowSettings({ formData, updateFormData, useCase }: ShowVoucherProps) {
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  // Mock products for demonstration
  const mockProducts = [
    { id: '1', name: 'iPhone 15 Pro Max', price: 29990000, image: '/placeholder-product.jpg' },
    { id: '2', name: 'Samsung Galaxy S24 Ultra', price: 26990000, image: '/placeholder-product.jpg' },
    { id: '3', name: 'MacBook Air M3', price: 28990000, image: '/placeholder-product.jpg' },
  ];

  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const addProduct = (product: typeof mockProducts[0]) => {
    const currentProducts = formData.selectedProducts || [];
    if (!currentProducts.find(p => p.id === product.id)) {
      updateFormData('selectedProducts', [...currentProducts, product]);
    }
    setProductSearchTerm('');
    setShowProductSearch(false);
  };

  const removeProduct = (productId: string) => {
    const currentProducts = formData.selectedProducts || [];
    updateFormData('selectedProducts', currentProducts.filter(p => p.id !== productId));
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
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 text-gray-900"
            />
          </div>
          
          <div className="max-h-40 overflow-y-auto space-y-2">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => addProduct(product)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-600">{formatCurrency(product.price)}</div>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-gray-500" />
              </div>
            ))}
            
            {filteredProducts.length === 0 && productSearchTerm && (
              <div className="text-center py-8 text-gray-600 text-sm">
                Không tìm thấy sản phẩm nào
              </div>
            )}
          </div>
        </div>
      )}

      {formData.selectedProducts && formData.selectedProducts.length > 0 && (
        <div className="space-y-3 border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="text-sm text-gray-700 font-medium">
            Đã chọn {formData.selectedProducts.length} sản phẩm
          </div>
          <div className="space-y-2">
            {formData.selectedProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-600">{formatCurrency(product.price)}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProduct(product.id)}
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