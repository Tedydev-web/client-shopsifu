"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";

interface Product {
  name: string;
  basePrice: number;
  virtualPrice: number;
  skus: { stock: number }[];
  variants: { value: string; options: string[] }[];
  media: { type: "image" | "video"; src: string }[];
  categories: { id: number; name: string }[];
  brand?: { id: number; name: string };
  origin?: string;
  material?: string;
}

export default function ProductInfo({ product }: { product: Product }) {
  const sizes =
    product.variants.find((v) => v.value === "Kích thước")?.options ?? [];
  const colors =
    product.variants.find((v) => v.value === "Màu sắc")?.options ?? [];

  const totalStock = product.skus.reduce((sum, sku) => sum + sku.stock, 0);
  const discountPercent = Math.round(
    ((product.basePrice - product.virtualPrice) / product.basePrice) * 100
  );

  const category =
    product.categories && product.categories.length > 0
      ? product.categories[0]
      : null;

  const brand = product.brand?.name || "";
  const origin = product.origin ?? "Không rõ";
  const material = product.material ?? "Không rõ";

  return (
    <div className="flex-1 flex flex-col justify-between space-y-5 h-full">
      <div className="flex-1 space-y-5">
        {/* Tên sản phẩm */}
        <h1 className="text-xl font-semibold leading-6">{product.name}</h1>

        {/* Giá sản phẩm */}
        <div className="flex items-center gap-4">
          <span className="text-red-600 text-2xl font-bold">
            ₫{product.virtualPrice.toLocaleString("vi-VN")}
          </span>
          <span className="line-through text-muted-foreground text-sm">
            ₫{product.basePrice.toLocaleString("vi-VN")}
          </span>
          <Badge className="bg-yellow-400 text-black">
            {discountPercent}% OFF
          </Badge>
        </div>

        {/* Tồn kho */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="min-w-[90px]">Tồn kho:</span>
          <span>{totalStock.toLocaleString()}</span>
        </div>

        {/* Danh mục */}
        {category && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="min-w-[90px]">Danh mục:</span>
            <span>{category.name}</span>
          </div>
        )}

        {/* Thương hiệu */}
        {brand && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="min-w-[90px]">Thương hiệu:</span>
            <span>{brand}</span>
          </div>
        )}

        {/* Xuất xứ */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="min-w-[90px]">Xuất xứ:</span>
          <span>{origin}</span>
        </div>

        {/* Chất liệu */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="min-w-[90px]">Chất liệu:</span>
          <span>{material}</span>
        </div>

        {/* Kích thước */}
        {sizes.length > 0 && (
          <div className="flex items-start gap-4">
            <span className="min-w-[90px] text-muted-foreground mt-1">
              Kích thước:
            </span>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <Button key={size} variant="outline" size="sm">
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Màu sắc */}
        {colors.length > 0 && (
          <div className="flex items-start gap-4">
            <span className="min-w-[90px] text-muted-foreground mt-1">
              Màu sắc:
            </span>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <Button key={color} variant="outline" size="sm">
                  {color}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Nút thao tác */}
        <div className="flex gap-2 pt-2">
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
    </div>
  );
}
