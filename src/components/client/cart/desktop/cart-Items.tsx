"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { CartItem, CartListResponse } from "@/types/cart.interface";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProductUrl } from "@/components/client/products/shared/routes";

interface CartItemsProps {
  item: CartItem;
  checked: boolean;
  onCheckedChange: () => void;
  onRemove: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onVariationChange: (itemId: string, newSkuId: string) => void; // Thêm prop này
}

export default function CartItems({ 
  item,
  checked,
  onCheckedChange,
  onRemove,
  onUpdateQuantity,
}: CartItemsProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(1, newQuantity);
    setQuantity(clampedQuantity);
  };

  const handleUpdateCart = () => {
    if (quantity !== item.quantity) {
      onUpdateQuantity(item.id, quantity);
    }
  };

  // Add a defensive check to prevent runtime errors if data is incomplete
  if (!item || !item.sku || !item.sku.product) {
    return null;
  }

  return (
    <div className="flex items-center px-3 py-4 border-b">
      {/* Product Info: w-[45%] */}
      <div className="flex items-center gap-2 w-[45%]">
        <Checkbox
          className="ml-[30px]"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <Link href={getProductUrl(item.sku.product.name, item.sku.product.id)} className="flex items-center flex-grow">
          <div className="relative w-20 h-20 mr-4 flex-shrink-0">
            <Image
              src={item.sku.image || "/images/placeholder.png"}
              alt={item.sku.product.name}
              fill
              sizes="80px"
              className="object-cover rounded border"
            />
          </div>
          <div className="flex-1">
            <p className="line-clamp-2 text-sm leading-5 hover:text-primary transition-colors">
              {item.sku.product.name}
            </p>
            <div className="text-sm text-muted-foreground mt-1 bg-gray-50 p-1 rounded-sm inline-block">
              Phân loại: {item.sku.value}
            </div>
          </div>
        </Link>
      </div>

      {/* Unit Price: w-[15%] */}
      <div className="w-[15%] text-center">
        {item.sku.product.virtualPrice > item.sku.price && (
          <span className="line-through text-muted-foreground text-sm mr-2">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.sku.product.virtualPrice)}
          </span>
        )}
        <span className="text-base">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.sku.price)}
        </span>
      </div>

      {/* Quantity: w-[15%] */}
      <div className="w-[15%] flex items-center justify-center">
        <button 
          onClick={() => handleQuantityChange(quantity - 1)} 
          onMouseUp={handleUpdateCart}
          className="p-1 border rounded-l disabled:opacity-50"
          disabled={quantity <= 1}
        >
          <Minus size={16} />
        </button>
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)} 
          onBlur={handleUpdateCart}
          className="w-12 text-center border-t border-b outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button 
          onClick={() => handleQuantityChange(quantity + 1)} 
          onMouseUp={handleUpdateCart}
          className="p-1 border rounded-r"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Total Price: w-[15%] */}
      <div className="w-[15%] text-center font-semibold text-primary">
        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.sku.price * quantity)}
      </div>

      {/* Actions: w-[10%] */}
      <div className="w-[10%] text-center">
        <button onClick={onRemove} className="text-muted-foreground hover:text-red-500">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
