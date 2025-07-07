"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";

interface Product {
  name: string;
  price: number;
  discountPrice: number;
  discountPercent: number;
  stock: number;
  sold: number;
  likedCount: number;
  rating: number;
  labels: string[];
  flashSale?: {
    isActive: boolean;
    salePrice: number;
    originalPrice: number;
    discountPercent: number;
    endTime: string;
    quantity: number;
    sold: number;
  };
  variations: {
    name: string;
    options: string[];
  }[];
}

export default function ProductInfo({ product }: { product: Product }) {
  const sizes = product.variations.find(v => v.name === "Kích thước")?.options ?? [];
  const colors = product.variations.find(v => v.name === "Màu sắc")?.options ?? [];

  return (
    <div className="flex-1 space-y-4">
      {/* Tên sản phẩm */}
      <h1 className="text-xl font-semibold leading-6">{product.name}</h1>

      {/* Giá, giảm giá, flash sale */}
      <div className="flex items-center gap-4">
        <span className="text-red-600 text-2xl font-bold">
          ₫{(product.flashSale?.isActive
            ? product.flashSale.salePrice
            : product.discountPrice
          ).toLocaleString("vi-VN")}
        </span>

        <span className="line-through text-muted-foreground text-sm">
          ₫{product.price.toLocaleString("vi-VN")}
        </span>

        <Badge className="bg-yellow-400 text-black">
          {product.flashSale?.isActive
            ? `${product.flashSale.discountPercent}% FLASH`
            : `${product.discountPercent}% OFF`}
        </Badge>
      </div>

      {/* Đánh giá, lượt bán */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          {product.rating.toFixed(1)}
        </div>
        <div>| Đã bán {product.sold.toLocaleString()}</div>
        <div>| Thích {product.likedCount.toLocaleString()}</div>
      </div>

      {/* Label Shopee-style */}
      {product.labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.labels.map((label, i) => (
            <Badge
              key={i}
              className="bg-orange-100 text-orange-700 border border-orange-300 rounded-full text-xs"
            >
              {label}
            </Badge>
          ))}
        </div>
      )}

      {/* Biến thể size */}
      {sizes.length > 0 && (
        <div className="flex gap-2 items-center">
          <span className="w-24 text-muted-foreground">Kích thước:</span>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => (
              <Button key={size} variant="outline" size="sm">
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Biến thể màu */}
      {colors.length > 0 && (
        <div className="flex gap-2 items-center">
          <span className="w-24 text-muted-foreground">Màu sắc:</span>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <Button key={color} variant="outline" size="sm">
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Hành động */}
      <div className="flex gap-2 mt-4">
        <Button className="bg-red-600 text-white hover:bg-red-700">
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
