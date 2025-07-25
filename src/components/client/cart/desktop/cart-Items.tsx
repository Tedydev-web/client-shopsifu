"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { ProductItem } from "./cart-MockData";

interface Props {
  item: ProductItem;
  checked: boolean;
  onCheckedChange: () => void;
  onVariationChange: (itemId: string, selectedVariation: string) => void;
  onRemove?: (itemId: string) => void;
}

export default function DesktopCartItem({
  item,
  checked,
  onCheckedChange,
  onVariationChange,
  onRemove,
}: Props) {
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const total = item.price * quantity;

  return (
    <div className="flex py-5 border-b bg-white text-base text-muted-foreground">
      {/* Product (45%) */}
      <div className="flex items-center w-[45%] px-3">
        <Checkbox
          className="mr-3 ml-[30px]"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />

        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className="w-24 h-24 rounded border object-cover mr-3 ml-3"
        />

        <div className="flex-1">
          <div className="text-base leading-6 h-12 line-clamp-2 text-black">
            {item.name}
          </div>

          {/* Variation select box */}
          <div className="mt-2">
            {item.variations ? (
              <select
                className="text-sm text-muted-foreground border px-2 py-1 w-fit rounded-sm bg-gray-50"
                value={item.variation}
                title={`Chọn biến thể cho ${item.name}`}
                aria-label={`Chọn biến thể cho ${item.name}`}
                onChange={(e) =>
                  onVariationChange(item.id, e.target.value)
                }
              >
                {item.variations.map((variation) => (
                  <option key={variation} value={variation}>
                    {variation}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-muted-foreground border px-2 py-1 w-fit rounded-sm bg-gray-50">
                {item.variation}
              </div>
            )}
          </div>

          {/* Sold out warning */}
          {item.soldOut && (
            <div className="mt-2 text-sm text-destructive">
              Sản phẩm đã hết hàng. Vui lòng chọn biến thể khác.
            </div>
          )}
        </div>
      </div>

      {/* Unit Price */}
      <div className="w-[15%] flex flex-col items-center justify-center text-center">
        {item.originalPrice && (
          <span className="text-sm line-through text-muted-foreground">
            ₫{item.originalPrice.toLocaleString()}
          </span>
        )}
        <span className="text-base font-semibold text-primary">
          ₫{item.price.toLocaleString()}
        </span>
      </div>

      {/* Quantity */}
      <div className="w-[15%] text-center flex items-center justify-center">
        <div className="flex items-center border rounded overflow-hidden h-9">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 px-0"
            onClick={decrease}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <div className="px-2 text-base w-8 text-center">{quantity}</div>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 px-0"
            onClick={increase}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Total Price */}
      <div className="w-[15%] text-center flex items-center justify-center">
        <span className="text-base font-semibold text-primary">
          ₫{total.toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="w-[10%] text-center flex flex-col items-center justify-center gap-1">
        <button 
          className="text-base text-red-500 hover:underline flex items-center gap-1"
          onClick={() => onRemove && onRemove(item.id)}
        >
          <Trash2 className="w-4 h-4" />
          Xóa
        </button>
      </div>
    </div>
  );
}
