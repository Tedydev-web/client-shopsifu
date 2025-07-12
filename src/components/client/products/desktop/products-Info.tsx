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
  Truck,
  RefreshCcw,
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
    endTime: string;
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

  const category = product.categories[0]?.name ?? "";
  const brand = product.brand?.name ?? "";
  const origin = product.origin ?? "Không rõ";
  const material = product.material ?? "Không rõ";

  const isFlashSale = !!product.flashSale;
  const flashSalePrice = product.flashSale?.price ?? 0;
  const flashSaleEnd = product.flashSale?.endTime
    ? new Date(product.flashSale.endTime)
    : null;

  const vouchers = product.vouchers ?? [];

  const isVariantSelected =
    (sizes.length === 0 || !!selectedSize) &&
    (colors.length === 0 || !!selectedColor);

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value.replace(/\D/g, ""), 10);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > totalStock) val = totalStock;
    setQuantity(val);
  };

  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  const sold = product.sold ?? 0;

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

  return (
    <div className="w-full max-w-[650px] flex flex-col gap-7 text-[15px] leading-relaxed">
      {/* Tên sản phẩm */}
      <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>

      {/* Mô tả ngắn */}
      <p className="text-muted-foreground text-sm">
        Áo thun thời trang nam chất liệu cotton cao cấp, thoáng mát phù hợp mọi
        hoạt động.
      </p>

      {/* Dịch vụ hỗ trợ */}
      <div className="flex items-center gap-4 text-sm mt-1">
        <span className="flex items-center gap-1">
          <Truck className="w-4 h-4 text-green-600" />
          <span className="text-black">Miễn phí vận chuyển</span>
        </span>
        <span className="flex items-center gap-1">
          <RefreshCcw className="w-4 h-4 text-blue-600" />
          <span className="text-black">Đổi trả 7 ngày</span>
        </span>
      </div>

      {/* Đánh giá, bán, tố cáo */}
      <div className="flex items-center w-full text-sm text-muted-foreground mb-1">
        <div className="flex items-center gap-1">
          <span className="font-medium text-black">{rating.toFixed(1)}</span>
          {renderStars(rating)}
        </div>
        <span className="mx-2">|</span>
        <span>{reviewCount} lượt đánh giá</span>
        <span className="mx-2">|</span>
        <span>Đã bán {sold.toLocaleString()}</span>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-500 hover:underline px-2 py-1 h-auto"
        >
          <Flag className="w-4 h-4 mr-1" />
          Tố cáo
        </Button>
      </div>

      {/* Giá */}
      {isFlashSale ? (
        <div className="flex items-center gap-3 text-xl font-bold text-red-600">
          <Badge className="bg-red-600 text-white">FLASH SALE</Badge>₫
          {flashSalePrice.toLocaleString("vi-VN")}
          <span className="text-sm line-through text-muted-foreground font-normal">
            ₫{product.virtualPrice.toLocaleString("vi-VN")}
          </span>
          {flashSaleEnd && (
            <span className="text-xs text-orange-500 ml-2">
              Kết thúc: {flashSaleEnd.toLocaleTimeString("vi-VN")}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 text-xl font-bold text-red-600">
          ₫{product.virtualPrice.toLocaleString("vi-VN")}
          <span className="text-sm line-through text-muted-foreground font-normal">
            ₫{product.basePrice.toLocaleString("vi-VN")}
          </span>
          <Badge className="bg-yellow-400 text-black">
            {discountPercent}% OFF
          </Badge>
        </div>
      )}

      {/* Vouchers */}
      {vouchers.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-500 font-medium text-sm">
            <TicketPercent className="w-5 h-5" />
            Voucher của Shop
          </div>
          <div className="flex gap-2 flex-wrap">
            {vouchers.map((v) => (
              <Badge
                key={v.code}
                className="bg-orange-100 text-orange-600 border border-orange-400 px-3 py-1 text-sm"
              >
                <span className="font-semibold">{v.code}</span>
                <span className="ml-2 text-xs">{v.desc}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Thông tin chung */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <div>
          <span className="font-medium text-black">Danh mục:</span> {category}
        </div>
        <div>
          <span className="font-medium text-black">Thương hiệu:</span> {brand}
        </div>
        <div>
          <span className="font-medium text-black">Xuất xứ:</span> {origin}
        </div>
        <div>
          <span className="font-medium text-black">Chất liệu:</span> {material}
        </div>
      </div>

      {/* Variants */}
      {sizes.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-24 text-muted-foreground">Kích thước:</span>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedSize(size === selectedSize ? null : size)
                }
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}
      {colors.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-24 text-muted-foreground">Màu sắc:</span>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <Button
                key={color}
                variant={selectedColor === color ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedColor(color === selectedColor ? null : color)
                }
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Số lượng */}
      <div className="flex items-center gap-4">
        <span className="min-w-[90px] text-muted-foreground">Số lượng:</span>
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
            className="w-12 h-8 text-center outline-none border-x [appearance:textfield]
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none"
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
        {isVariantSelected && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Tồn kho:{" "}
            <span className="font-semibold">{totalStock.toLocaleString()}</span>
          </span>
        )}
      </div>

      {/* Nút thao tác */}
      <div className="flex gap-3 pt-2 w-full">
        <Button
          className="w-full h-10 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-md text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          disabled={!isVariantSelected}
        >
          <ShoppingCart className="w-4 h-4" />
          Thêm vào giỏ
        </Button>
        <Button
          className="w-full h-10 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-lg text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          disabled={!isVariantSelected}
        >
          Mua ngay
          <span>
            ₫
            {(isFlashSale
              ? flashSalePrice
              : product.virtualPrice
            ).toLocaleString("vi-VN")}
          </span>
        </Button>
      </div>
    </div>
  );
}
