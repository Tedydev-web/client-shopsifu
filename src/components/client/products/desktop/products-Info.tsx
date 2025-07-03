'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";

interface Product {
  name: string;
  price: number;
  discountPrice: number;
  discountPercent: number;
  sizes: string[];
  colors: string[];
}

export default function ProductInfo({ product }: { product: Product }) {
  return (
    <div className="flex-1 space-y-3">
      <h1 className="text-xl font-medium leading-6">{product.name}</h1>

      <div className="flex items-center gap-4">
        <span className="text-red-600 text-2xl font-bold">
          ₫{product.discountPrice.toLocaleString("vi-VN")}
        </span>
        <Badge className="bg-yellow-400 text-black">{product.discountPercent}% OFF</Badge>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <span className="w-24 text-muted-foreground">Size:</span>
          <div className="flex gap-2">
            {product.sizes.map(size => (
              <Button key={size} variant="outline" size="sm">{size}</Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <span className="w-24 text-muted-foreground">Color:</span>
          <div className="flex gap-2">
            {product.colors.map(color => (
              <Button key={color} variant="outline" size="sm">{color}</Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button className="bg-red-600 text-white">
          <ShoppingCart className="w-4 h-4 mr-1" />
          Thêm vào giỏ
        </Button>
        <Button variant="outline">
          <Heart className="w-4 h-4 mr-1" />
          Yêu thích
        </Button>
      </div>
    </div>
  );
}
