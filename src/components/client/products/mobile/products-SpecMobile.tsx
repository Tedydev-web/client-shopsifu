'use client';

interface Product {
  brand: string;
  origin: string;
  material: string;
}

export default function ProductSpecsMobile({ product }: { product: Product }) {
  return (
    <div className="bg-white p-4 mt-2">
      <h2 className="text-sm font-semibold mb-2">Chi tiết sản phẩm</h2>
      <div className="text-sm space-y-1">
        <div><span className="text-muted-foreground">Thương hiệu:</span> {product.brand}</div>
        <div><span className="text-muted-foreground">Chất liệu:</span> {product.material}</div>
        <div><span className="text-muted-foreground">Xuất xứ:</span> {product.origin}</div>
      </div>
    </div>
  );
}
