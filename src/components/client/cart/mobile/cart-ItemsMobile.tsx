import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { ProductItem } from "./cart-MockData";

interface CartItemProps {
  item: ProductItem;
  checked: boolean;
  onCheckedChange: () => void;
  onVariationChange: (itemId: string, selectedVariation: string) => void;
  onQuantityChange: (delta: number) => void;
  isEditing?: boolean; // thêm prop này
}

export default function CartItem({
  item,
  checked,
  onCheckedChange,
  onVariationChange,
  onQuantityChange,
  isEditing = false,
}: CartItemProps) {
  const total = item.price * item.quantity;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slide actions */}
      {isEditing && (
        <div className="absolute right-0 top-0 bottom-0 flex z-10">
          <button className="w-20 bg-orange-500 text-white text-sm font-medium">
            Similar
          </button>
          <button className="w-20 bg-red-500 text-white text-sm font-medium">
            Delete
          </button>
        </div>
      )}

      {/* Main content */}
      <div
        className={`bg-white flex px-4 py-4 border-b transition-transform duration-300 ${
          isEditing ? "-translate-x-40" : "translate-x-0"
        }`}
      >
        {/* Checkbox + Image */}
        <div className="flex flex-col items-center justify-start mr-3 mt-1 my-auto">
          <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
        </div>

        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded border object-cover mr-3"
        />

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="text-sm font-medium leading-5 line-clamp-2">
              {item.name}
            </div>
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
            {item.soldOut && (
              <div className="mt-2 text-xs text-destructive">
                Variation selected is Sold Out. Please select another.
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-between items-end">
            <div className="flex flex-col items-start gap-1">
              {item.originalPrice && (
                <span className="text-xs line-through text-muted-foreground">
                  ₫{item.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-sm font-semibold text-primary">
                ₫{total.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center border rounded">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 px-0"
                onClick={() => onQuantityChange(-1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="px-2 text-sm w-6 text-center">{item.quantity}</div>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 px-0"
                onClick={() => onQuantityChange(1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
