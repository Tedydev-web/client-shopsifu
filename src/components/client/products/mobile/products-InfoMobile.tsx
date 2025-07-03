'use client';

interface Product {
  name: string;
  discountPrice: number;
  discountPercent: number;
  price: number;
  rating: number;
}

export default function ProductInfoMobile({ product }: { product: Product }) {
  return (
    <div className="bg-white p-4 space-y-2">
      <h1 className="text-base font-medium leading-snug">{product.name}</h1>

      <div className="text-red-600 text-xl font-bold">
        ₫{product.discountPrice.toLocaleString("vi-VN")}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="line-through">₫{product.price.toLocaleString("vi-VN")}</span>
        <span className="text-yellow-500 font-medium">{product.discountPercent}% GIẢM</span>
      </div>

      <div className="text-sm text-yellow-500">⭐ {product.rating} / 5</div>
    </div>
  );
}
