interface Product {
  brand: {
    name: string;
  };
  origin?: string;
  material?: string;
}

export default function ProductSpecs({ product }: { product: Product }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Chi tiết sản phẩm</h2>
      <div className="grid grid-cols-2 text-sm gap-y-2">
        <div className="text-muted-foreground">Thương hiệu</div>
        <div>{product.brand?.name ?? "Đang cập nhật"}</div>
        <div className="text-muted-foreground">Chất liệu</div>
        <div>{product.material ?? "Đang cập nhật"}</div>
        <div className="text-muted-foreground">Xuất xứ</div>
        <div>{product.origin ?? "Đang cập nhật"}</div>
      </div>
    </div>
  );
}
