"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { ProductItem } from "./cart-MockData";

export default function DesktopCartItem({ item }: { item: ProductItem }) {
  return (
    <div className="flex px-4 py-4 border-b bg-white">
      <div className="flex items-center w-[45%]">
        {/* Checkbox + Image */}
        <div className="flex items-center mr-3">
          <Checkbox />
        </div>

        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded border object-cover mr-3"
        />

        {/* Product Content */}
        <div className="flex-1">
          <div className="text-sm font-medium leading-5 line-clamp-2">
            {item.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1 border px-2 py-1 w-fit rounded-sm bg-gray-50">
            {item.variation}
          </div>
          {/* Sold out message */}
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
      <div className="w-[15%] text-center">
        <div className="flex items-center justify-center gap-2">
          {item.originalPrice && (
            <span className="text-xs line-through text-muted-foreground">
              ₫{item.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-sm font-semibold text-primary">
            ₫{item.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Quantity */}
      <div className="w-[15%] text-center">
        <div className="flex items-center justify-center border rounded">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 px-0"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <div className="px-2 text-sm w-6 text-center">{item.quantity}</div>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 px-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Total Price */}
      <div className="w-[15%] text-center">
        <span className="text-sm font-semibold text-primary">
          ₫{(item.price * item.quantity).toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="w-[10%] text-center">
        {item.soldOut ? (
          <>
            <span className="text-red-500 text-sm">SOLD OUT</span>
            <button className="text-sm text-red-500 ml-2">Delete</button>
            <button className="text-sm text-red-500 ml-2">Find Similar ▼</button>
          </>
        ) : (
          <>
            <button className="text-sm text-red-500">Delete</button>
            <button className="text-sm text-red-500 ml-2">Find Similar ▼</button>
          </>
        )}
      </div>
    </div>
  );
}