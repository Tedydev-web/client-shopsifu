"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { ProductItem } from "./cart-MockData";

interface Props {
  item: ProductItem;
  checked: boolean;
  onCheckedChange: () => void;
  onVariationChange: (itemId: string, selectedVariation: string) => void;
}

export default function DesktopCartItem({
  item,
  checked,
  onCheckedChange,
  onVariationChange,
}: Props) {
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const total = item.price * quantity;

  return (
    <div className="flex py-4 border-b bg-white text-sm text-muted-foreground">
      {/* Product (45%) */}
      <div className="flex items-center w-[45%] px-3">
        <Checkbox
          className="mr-2 ml-[30px]"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />

        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded border object-cover mr-3 ml-3"
        />

        <div className="flex-1">
          <div className="text-sm font-medium leading-5 line-clamp-2 text-black">
            {item.name}
          </div>

          {/* Variation select box */}
          <div className="mt-1">
            {item.variations ? (
              <select
                className="text-xs text-muted-foreground border px-2 py-1 w-fit rounded-sm bg-gray-50"
                value={item.variation}
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
              <div className="text-xs text-muted-foreground border px-2 py-1 w-fit rounded-sm bg-gray-50">
                {item.variation}
              </div>
            )}
          </div>

          {/* Sold out warning */}
          {item.soldOut && (
            <div className="mt-2 text-xs text-destructive">
              Variation selected is Sold Out. Please select another variation.
            </div>
          )}
        </div>
      </div>

      {/* Unit Price */}
      <div className="w-[15%] flex flex-col items-center justify-center text-center">
        {item.originalPrice && (
          <span className="text-xs line-through text-muted-foreground">
            ₫{item.originalPrice.toLocaleString()}
          </span>
        )}
        <span className="text-sm font-semibold text-primary">
          ₫{item.price.toLocaleString()}
        </span>
      </div>

      {/* Quantity */}
      <div className="w-[15%] text-center flex items-center justify-center">
        <div className="flex items-center border rounded overflow-hidden h-8">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 px-0"
            onClick={decrease}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <div className="px-2 text-sm w-6 text-center">{quantity}</div>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 px-0"
            onClick={increase}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Total Price */}
      <div className="w-[15%] text-center flex items-center justify-center">
        <span className="text-sm font-semibold text-primary">
          ₫{total.toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="w-[10%] text-center flex flex-col items-center justify-center gap-1">
        <button className="text-sm text-red-500 hover:underline">Delete</button>
        <button className="text-sm text-red-500 hover:underline">
          Find Similar ▼
        </button>
      </div>
    </div>
  );
}
