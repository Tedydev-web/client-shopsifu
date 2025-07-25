"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  findMatchingSku, 
  areAllVariantsSelected, 
  getCurrentStock, 
  isOptionAvailable,
  Sku,
  VariantGroup,
  SelectedVariants
} from "@/components/client/products/shared/productUtils";

interface VariantValue {
  optionType: string;
  value: string;
}

interface VariantOption {
  value: string;
  image?: string;
}

interface Product {
  id: string;
  name: string;
  basePrice: number;
  virtualPrice: number;
  skus: Sku[];
  variants: VariantGroup[];
  media: { type: "image" | "video"; src: string }[];
}

interface AddCartMobileProps {
  product: Product;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddToCart?: (skuId: string, quantity: number) => void;
}

export default function AddCartMobile({ product, isOpen, onOpenChange, onAddToCart }: AddCartMobileProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string | null>>({});
  const [currentSku, setCurrentSku] = useState<Sku | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Lấy ra tất cả variants từ API response
  const variantGroups = product.variants || [];
  
  // Tạo một object để theo dõi các lựa chọn variant của người dùng
  useEffect(() => {
    const initialVariants: SelectedVariants = {};
    variantGroups.forEach(group => {
      initialVariants[group.value] = null;
    });
    setSelectedVariants(initialVariants);
  }, [variantGroups]);
  
  // Xử lý khi người dùng chọn một variant
  const handleVariantSelect = (variantType: string, option: string) => {
    setSelectedVariants(prev => {
      // Nếu đang chọn cùng một giá trị, bỏ chọn nó
      if (prev[variantType] === option) {
        return { ...prev, [variantType]: null };
      }
      // Ngược lại, chọn giá trị mới
      return { ...prev, [variantType]: option };
    });
  };
  
  // Tìm SKU phù hợp với các lựa chọn variant hiện tại và cập nhật state
  useEffect(() => {
    // Sử dụng hàm tiện ích để tìm SKU phù hợp
    const matchingSku = findMatchingSku(selectedVariants, product.skus, variantGroups as VariantGroup[]);
    
    if (matchingSku) {
      console.log('Tìm thấy SKU:', matchingSku);
    } else if (areAllVariantsSelected(selectedVariants)) {
      console.log('Đã chọn đủ variants nhưng không tìm thấy SKU phù hợp');
    }
    
    setCurrentSku(matchingSku);
  }, [selectedVariants, product.skus, variantGroups]);
  
  // Tính toán tổng tồn kho dựa trên SKU hiện tại hoặc sử dụng hàm tiện ích
  const totalStock = getCurrentStock(selectedVariants, product.skus, variantGroups as VariantGroup[]);
  
  // Kiểm tra xem đã chọn đủ variants chưa
  const isVariantSelected = areAllVariantsSelected(selectedVariants);
  
  // Xử lý input số lượng
  const handleQuantityChange = (increment: number) => {
    setQuantity(current => {
      const newValue = current + increment;
      
      if (newValue < 1) return 1;
      
      const maxStock = currentSku ? currentSku.stock : totalStock;
      if (newValue > maxStock) return maxStock;
      
      return newValue;
    });
  };
  
  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!currentSku || !isVariantSelected) return;
    
    if (onAddToCart) {
      onAddToCart(currentSku.id, quantity);
    }
  };
  
  // Lấy hình ảnh sản phẩm
  const productImage = product.media?.[0]?.src || '/images/image-placeholder.jpg';
  
  // Lấy giá hiển thị
  const displayPrice = currentSku ? currentSku.price : product.virtualPrice;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] rounded-t-xl">
        <div className="px-4 py-4 max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-5">
            <div className="flex gap-3">
              <div className="w-20 h-20 relative rounded-md overflow-hidden">
                <Image
                  src={currentSku?.image || productImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-xl font-medium text-red-600">
                  ₫{displayPrice.toLocaleString('vi-VN')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isVariantSelected && currentSku && (
                    <span>Còn {currentSku.stock} sản phẩm</span>
                  )}
                </div>
              </div>
            </div>
            
            <DrawerClose>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          
          {/* Variants - Lựa chọn biến thể */}
          <div className="space-y-5 mb-6">
            {variantGroups.map((variantGroup) => (
              <div key={variantGroup.value} className="space-y-3">
                <div className="font-medium text-sm">
                  {variantGroup.value}:
                  {selectedVariants[variantGroup.value] && (
                    <span className="ml-2 font-normal text-muted-foreground">
                      {selectedVariants[variantGroup.value]}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {variantGroup.options.map((option) => {
                    const isSelected = selectedVariants[variantGroup.value] === option;
                    
                    // Sử dụng hàm tiện ích để kiểm tra xem variant này có sẵn không
                    const isAvailable = isOptionAvailable(
                      variantGroup.value,
                      option,
                      selectedVariants,
                      product.skus
                    );
                    
                    // Tìm SKU có chứa option này để lấy hình ảnh (nếu có)
                    const optionImage = (() => {
                      // Tìm SKU đầu tiên chứa option này
                      const matchingSku = product.skus.find(sku => {
                        // Kiểm tra từ chuỗi value của SKU
                        return sku.value && sku.value.includes(option);
                      });
                      
                      return matchingSku?.image || '';
                    })();

                    return (
                      <button
                        key={option}
                        onClick={() => handleVariantSelect(variantGroup.value, option)}
                        className={cn(
                          "relative px-3 py-2 border rounded-md text-sm transition-all",
                          "flex items-center gap-2",
                          "hover:border-primary hover:text-primary",
                          isSelected
                            ? "border-primary text-primary"
                            : "border-input text-foreground",
                          !isAvailable && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={!isAvailable}
                      >
                        {optionImage && (
                          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border">
                            <img 
                              src={optionImage} 
                              alt={option} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Xử lý lỗi khi không tải được hình ảnh
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <span>{option}</span>
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3 h-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Số lượng */}
          <div className="mb-6">
            <div className="font-medium text-sm mb-3">Số lượng:</div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={!isVariantSelected || quantity <= 1 || !currentSku?.stock}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => handleQuantityChange(1)}
                  disabled={!isVariantSelected || quantity >= (currentSku ? currentSku.stock : totalStock) || !currentSku?.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Thông báo nếu hết hàng */}
          {isVariantSelected && currentSku && currentSku.stock === 0 && (
            <div className="text-red-500 text-sm mb-4">
              Sản phẩm đã hết hàng với tùy chọn này
            </div>
          )}
          
          {/* Nút thêm vào giỏ hàng */}
          <Button
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium text-base rounded-md"
            disabled={!isVariantSelected || !currentSku || currentSku.stock === 0}
            onClick={handleAddToCart}
          >
            THÊM VÀO GIỎ HÀNG
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}