"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CartItem } from "@/types/cart.interface";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MobileCartItemProps {
  item: CartItem;
  isSelected: boolean;
  onSelectionChange: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onVariationChange: (id: string, newSku: string) => void;
}

export default function MobileCartItem({
  item,
  isSelected,
  onSelectionChange,
  onRemove,
  onUpdateQuantity,
  onVariationChange,
}: MobileCartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const decrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const increase = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  return (
    <div className="bg-white flex px-4 py-4 border-b">
      {/* Checkbox */}
      <div className="flex items-center justify-start mr-3">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={() => onSelectionChange(item.id)} 
        />
      </div>

      {/* Image */}
      <Image
        src={item.product.images[0]?.imageUrl || "/placeholder.png"}
        alt={item.product.name}
        width={80}
        height={80}
        className="w-20 h-20 rounded border object-cover mr-4"
      />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <p className="line-clamp-2 text-sm leading-5 mb-1 font-medium text-gray-800">
          {item.product.name}
        </p>

        {/* Variation Select */}
        <div className="mt-1 mb-2">
          {item.product.productSkus && item.product.productSkus.length > 1 ? (
            <select
              className="text-xs text-gray-600 border px-2 py-1 rounded-sm bg-gray-50 max-w-[150px] truncate"
              value={item.productSku.sku}
              onChange={(e) => onVariationChange(item.id, e.target.value)}
            >
              {item.product.productSkus.map((sku) => (
                <option key={sku.sku} value={sku.sku}>
                  {sku.variant}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-gray-600 border px-2 py-1 rounded-sm bg-gray-50 w-fit">
              {item.productSku.variant}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
            {item.originalPrice && (
                <span className="text-gray-400 line-through text-xs">
                    ₫{item.originalPrice.toLocaleString()}
                </span>
            )}
            <span className="text-primary font-semibold text-sm">
                ₫{item.price.toLocaleString()}
            </span>
        </div>

        {/* Actions: Quantity + Remove */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded overflow-hidden h-7">
            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={decrease} disabled={quantity <= 1}>
              <Minus className="w-3 h-3" />
            </Button>
            <div className="px-2 text-sm w-8 text-center">{quantity}</div>
            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={increase}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} className="text-gray-400">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
