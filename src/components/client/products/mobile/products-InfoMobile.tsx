"use client";

interface Product {
  name: string;
  basePrice: number;
  virtualPrice: number;
  skus: { stock: number }[];
  variants: { value: string; options: string[] }[];
}

export default function ProductInfoMobile({ product }: { product: Product }) {
  const sizes =
    product.variants.find((v) => v.value === "Kích thước")?.options ?? [];
  const colors =
    product.variants.find((v) => v.value === "Màu sắc")?.options ?? [];

  const totalStock = product.skus.reduce((sum, sku) => sum + sku.stock, 0);
  const discountPercent = Math.round(
    ((product.basePrice - product.virtualPrice) / product.basePrice) * 100
  );

  return (
    <div className="bg-white p-4 space-y-2">
      <h1 className="text-base font-medium leading-snug">{product.name}</h1>
      <div className="text-red-600 text-xl font-bold">
        ₫{product.virtualPrice.toLocaleString("vi-VN")}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="line-through">
          ₫{product.basePrice.toLocaleString("vi-VN")}
        </span>
        <span className="text-yellow-500 font-medium">
          {discountPercent}% GIẢM
        </span>
      </div>
      <div className="text-sm text-gray-500">
        {totalStock > 0 ? `Còn ${totalStock} sản phẩm` : "Hết hàng"}
      </div>
      <div className="flex gap-2 text-sm">
        {colors.length > 0 && (
          <span>
            Màu:{" "}
            <span className="font-medium">{colors.join(", ")}</span>
          </span>
        )}
        {sizes.length > 0 && (
          <span>
            Kích thước:{" "}
            <span className="font-medium">{sizes.join(", ")}</span>
          </span>
        )}
      </div>
      {/* Rating sẽ bổ sung sau */}
    </div>
  );
}