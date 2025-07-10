"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Minus,
  Plus,
  TicketPercent,
  Star,
  StarHalf,
  Star as StarOutline,
  Flag,
} from "lucide-react";

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
  flashSale?: {
    price: number;
    endTime: string; // ISO string
  };
  vouchers?: { code: string; desc: string }[];
  rating?: number;
  reviewCount?: number;
  sold?: number;
}

export default function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

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

  // Flash sale
  const isFlashSale = !!product.flashSale;
  const flashSalePrice = product.flashSale?.price ?? 0;
  const flashSaleEnd = product.flashSale?.endTime
    ? new Date(product.flashSale.endTime)
    : null;

  // Vouchers
  const vouchers = product.vouchers ?? [];

  // Đã chọn đủ loại sản phẩm chưa
  const isVariantSelected =
    (sizes.length === 0 || !!selectedSize) &&
    (colors.length === 0 || !!selectedColor);

  // Xử lý nhập số lượng trực tiếp
  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value.replace(/\D/g, ""), 10);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > totalStock) val = totalStock;
    setQuantity(val);
  };

  // Hàm render icon sao theo rating
  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      <span className="flex items-center gap-0.5 ml-1">
        {Array(full)
          .fill(0)
          .map((_, i) => (
            <Star
              key={"full" + i}
              className="w-4 h-4 text-yellow-400 fill-yellow-400"
            />
          ))}
        {half === 1 && (
          <StarHalf className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        )}
        {Array(empty)
          .fill(0)
          .map((_, i) => (
            <StarOutline key={"empty" + i} className="w-4 h-4 text-gray-300" />
          ))}
      </span>
    );
  };

  // Rating, đánh giá, đã bán
  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  const sold = product.sold ?? 0;

  return (
    <div className="flex-1 flex flex-col items-start max-w-[370px] mx-auto space-y-4 h-full relative">
      {/* Tố cáo góc phải */}
      <div className="absolute right-0 top-0">
        <button className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
          <Flag className="w-4 h-4" />
          Tố cáo
        </button>
      </div>

      {/* Tên sản phẩm */}
      <h1 className="text-xl font-semibold leading-6 pr-16">{product.name}</h1>

      {/* Dòng rating, đánh giá, đã bán */}
      <div className="flex w-full text-sm text-muted-foreground">
        <div className="flex-1 flex flex-col items-center min-w-0">
          <span className="font-semibold text-black flex items-center">
            {rating.toFixed(1)}
            {renderStars(rating)}
          </span>
          <span className="text-xs text-muted-foreground">Đánh giá</span>
        </div>
        <div className="h-8 w-px bg-gray-300 mx-2" />
        <div className="flex-1 flex flex-col items-center min-w-0">
          <span className="font-semibold text-black">{reviewCount}</span>
          <span className="text-xs text-muted-foreground">Lượt đánh giá</span>
        </div>
        <div className="h-8 w-px bg-gray-300 mx-2" />
        <div className="flex-1 flex flex-col items-center min-w-0">
          <span className="font-semibold text-black">
            {sold.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">Đã bán</span>
        </div>
      </div>

      {/* Flash sale hoặc giá sản phẩm */}
      {isFlashSale ? (
        <div className="flex items-center gap-2">
          <Badge className="bg-red-600 text-white">FLASH SALE</Badge>
          <span className="text-red-600 text-xl font-bold">
            ₫{flashSalePrice.toLocaleString("vi-VN")}
          </span>
          <span className="line-through text-muted-foreground text-sm">
            ₫{product.virtualPrice.toLocaleString("vi-VN")}
          </span>
          {flashSaleEnd && (
            <span className="text-xs text-orange-500 ml-2">
              Kết thúc: {flashSaleEnd.toLocaleTimeString("vi-VN")}
            </span>
          )}
        </div>
      ) : (
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
      )}

      {/* Voucher Shopee */}
      {vouchers.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <TicketPercent className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-orange-500">
              Voucher của Shop
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {vouchers.map((v) => (
              <Badge
                key={v.code}
                className="bg-orange-100 text-orange-600 border border-orange-400 px-3 py-1"
              >
                <span className="font-semibold">{v.code}</span>
                <span className="ml-2 text-xs">{v.desc}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Thông tin chung: Danh mục, Thương hiệu, Xuất xứ, Chất liệu */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full text-sm text-muted-foreground">
        {category && (
          <div>
            <span className="font-medium">Danh mục:</span> {category.name}
          </div>
        )}
        {brand && (
          <div>
            <span className="font-medium">Thương hiệu:</span> {brand}
          </div>
        )}
        <div>
          <span className="font-medium">Xuất xứ:</span> {origin}
        </div>
        <div>
          <span className="font-medium">Chất liệu:</span> {material}
        </div>
      </div>

      {/* Kích thước */}
      {sizes.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap w-full">
          <span className="min-w-[80px] text-muted-foreground">
            Kích thước:
          </span>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedSize(selectedSize === size ? null : size)
                }
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Màu sắc */}
      {colors.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap w-full">
          <span className="min-w-[80px] text-muted-foreground">Màu sắc:</span>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <Button
                key={color}
                variant={selectedColor === color ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedColor(selectedColor === color ? null : color)
                }
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Số lượng và tồn kho */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <span className="min-w-[80px] text-muted-foreground">Số lượng:</span>
          <div className="flex items-center border rounded">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={!isVariantSelected || quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <input
              type="number"
              min={1}
              max={totalStock}
              value={quantity}
              onChange={handleQuantityInput}
              disabled={!isVariantSelected}
              className="w-14 text-center outline-none border-x [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ MozAppearance: "textfield" }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setQuantity((q) => Math.min(totalStock, q + 1))}
              disabled={!isVariantSelected || quantity >= totalStock}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Tồn kho:{" "}
          <span className="font-semibold">{totalStock.toLocaleString()}</span>
        </span>
      </div>

      {/* Nút thao tác */}
      <div className="flex gap-2 pt-2 w-full">
        <Button
          className="bg-red-600 text-white hover:bg-red-700 flex-1"
          disabled={!isVariantSelected}
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          Thêm vào giỏ
        </Button>
        <Button
          className="bg-yellow-400 text-black hover:bg-yellow-500 flex-1 font-semibold"
          disabled={!isVariantSelected}
        >
          Mua ngay&nbsp;
          <span>
            ₫
            {isFlashSale
              ? flashSalePrice.toLocaleString("vi-VN")
              : product.virtualPrice.toLocaleString("vi-VN")}
          </span>
        </Button>
      </div>
    </div>
  );
}
