"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { ProductItem } from "./cart-MockData";

interface Props {
  item: ProductItem;
  checked: boolean;
  onCheckedChange: () => void;
}

export default function DesktopCartItem({ item, checked, onCheckedChange }: Props) {
  return (
    <div className="flex py-4 border-b bg-white text-sm text-muted-foreground">
      {/* Product (45%) */}
      <div className="flex items-center w-[45%] px-3">
        <Checkbox className="mr-2 ml-[30px]" checked={checked} onCheckedChange={onCheckedChange} />

        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded border object-cover mr-3"
        />

        <div className="flex-1">
          <div className="text-sm font-medium leading-5 line-clamp-2 text-black">
            {item.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1 border px-2 py-1 w-fit rounded-sm bg-gray-50">
            {item.variation}
          </div>

          {item.soldOut && (
            <div className="mt-2 text-xs text-destructive">
              Variation selected is Sold Out. Please select another variation.
              <div className="text-sm text-primary mt-1 underline cursor-pointer">
                Select Variation
              </div>
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
      <div className="w-[15%] flex justify-center">
        <div className="flex items-center border rounded overflow-hidden h-8">
          <Button variant="ghost" size="icon" className="w-8 h-8 px-0">
            <Minus className="w-4 h-4" />
          </Button>
          <div className="px-2 text-sm w-6 text-center">{item.quantity}</div>
          <Button variant="ghost" size="icon" className="w-8 h-8 px-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Total Price */}
      <div className="w-[15%] text-center flex items-center justify-center">
        <span className="text-sm font-semibold text-primary">
          ₫{(item.price * item.quantity).toLocaleString()}
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
