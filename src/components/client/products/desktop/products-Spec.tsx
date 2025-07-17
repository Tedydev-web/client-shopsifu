// interface Product {
//   brand: {
//     name: string;
//   };
//   origin?: string;
//   material?: string;
// }

// export default function ProductSpecs({ product }: { product: Product }) {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-3">Chi tiết sản phẩm</h2>
//       <div className="grid grid-cols-2 text-sm gap-y-2">
//         <div className="text-muted-foreground">Thương hiệu</div>
//         <div>{product.brand?.name ?? "Đang cập nhật"}</div>
//         <div className="text-muted-foreground">Chất liệu</div>
//         <div>{product.material ?? "Đang cập nhật"}</div>
//         <div className="text-muted-foreground">Xuất xứ</div>
//         <div>{product.origin ?? "Đang cập nhật"}</div>
//       </div>
//     </div>
//   );
// }

interface Product {
  brand: { name: string };
  name: string;
  series?: string;
  sku?: string;
  material?: string;
  origin?: string;
  warrantyType?: string;
  warrantyTime?: string;
  stock?: number;
  shipFrom?: string;
  weight?: string;
}

export default function ProductSpecs({ product }: { product: Product }) {
  return (
    <div className="bg-white border rounded-sm overflow-hidden">
      <h2 className="text-base font-medium px-5 py-4 border-b">Chi tiết sản phẩm</h2>
      <div className="divide-y text-sm">
        <SpecRow label="Thương hiệu" value={product.brand?.name} />
        <SpecRow label="Dòng sản phẩm" value={product.series ?? product.name} />
        <SpecRow label="SKU" value={product.sku} />
        <SpecRow label="Chất liệu" value={product.material} />
        <SpecRow label="Xuất xứ" value={product.origin} />
        <SpecRow label="Loại bảo hành" value={product.warrantyType} />
        <SpecRow label="Thời gian bảo hành" value={product.warrantyTime} />
        <SpecRow label="Kho hàng" value={product.stock?.toString()} />
        <SpecRow label="Gửi từ" value={product.shipFrom} />
        <SpecRow label="Trọng lượng sản phẩm" value={product.weight} />
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex px-5 py-3">
      <div className="w-1/3 text-muted-foreground">{label}</div>
      <div className="flex-1">{value ?? "Đang cập nhật"}</div>
    </div>
  );
}
