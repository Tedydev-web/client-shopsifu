"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Plus, X, Search, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { VoucherFormData, VoucherUseCase } from '../hook/useNewVoucher';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ShowVoucherProps {
  formData: VoucherFormData;
  updateFormData: (field: keyof VoucherFormData, value: any) => void;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
  voucherType: string;
}

export default function VoucherShowSettings({ formData, updateFormData, errors, useCase, voucherType }: ShowVoucherProps) {
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-2 h-6 bg-red-500 rounded-sm" />
          Thiết lập hiển thị và áp dụng
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Display Settings */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Display Settings
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <RadioGroup
            value={formData.displayType || 'PUBLIC'}
            onValueChange={(value) => updateFormData('displayType', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PUBLIC" id="display-public" />
              <Label htmlFor="display-public" className="font-normal cursor-pointer">Hiển thị ở nhiều nơi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PRIVATE" id="display-private" />
              <Label htmlFor="display-private" className="font-normal cursor-pointer">Không công khai (chỉ dùng khi có mã)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Applicable Products */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Sản phẩm được áp dụng
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <RadioGroup
            value={formData.discountApplyType || 'ALL'}
            onValueChange={(value) => updateFormData('discountApplyType', value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ALL" id="apply-all" />
              <Label htmlFor="apply-all" className="font-normal cursor-pointer">Tất cả sản phẩm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SPECIFIC" id="apply-specific" />
              <Label htmlFor="apply-specific" className="font-normal cursor-pointer">Sản phẩm được chỉ định</Label>
            </div>
          </RadioGroup>

          {formData.discountApplyType === 'SPECIFIC' && (
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProductSearch(!showProductSearch)}
                className="w-full"
              >
                + Chọn sản phẩm
              </Button>
            </div>
          )}

          {showProductSearch && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-2">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => addProduct(product)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(product.price)}</div>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                
                {filteredProducts.length === 0 && productSearchTerm && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Không tìm thấy sản phẩm nào
                  </div>
                )}
              </div>
            </div>
          )}

          {formData.selectedProducts && formData.selectedProducts.length > 0 && (
            <div className="space-y-2 border rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-2">
                Đã chọn {formData.selectedProducts.length} sản phẩm
              </div>
              <div className="space-y-2">
                {formData.selectedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(product.price)}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}