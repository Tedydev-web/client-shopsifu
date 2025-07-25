"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { slugify } from "@/utils/slugify";
import HTMLPreview from "@/components/ui/component/html-preview";

interface Product {
  weight?: string;
  description?: string; // HTML Markdown content
  categories?: {
    id: string;
    name: string;
    parentCategoryId: string | null;
  }[];
  brand?: {
    id: string;
    name: string;
  };
  series?: string;
  sku?: string;
  material?: string;
  origin?: string;
  warrantyType?: string;
  warrantyTime?: string;
  stock?: number;
  shipFrom?: string;
  name?: string;
}

export default function ProductSpecs({ product }: { product: Product }) {
  // Xử lý hiển thị danh mục sản phẩm với các liên kết
  const renderCategoryLinks = () => {
    if (!product.categories || product.categories.length === 0) return "Đang cập nhật";
    
    return (
      <div className="flex flex-wrap items-center gap-1">
        <Link href="/" className="text-[#05a]">
          Shopsifu
        </Link>
        
        {product.categories.map((category, index) => (
          <span key={category.id} className="flex items-center">
            <span className="mx-1 text-gray-400"><ChevronRight className="w-4 h-4 text-muted-foreground" /></span>
            <Link 
              href={`/category/${slugify(category.name)}`}
              className="text-[#05a]"
            >
              {category.name}
            </Link>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-sm overflow-hidden">
      <h2 className="text-base font-medium px-5 py-4 border-b">CHI TIẾT SẢN PHẨM</h2>
      <div className="divide-y text-sm">
        {/* Danh mục */}
        <div className="flex px-5 py-3">
          <div className="w-1/3 text-muted-foreground">Danh mục</div>
          <div className="flex-1">{renderCategoryLinks()}</div>
        </div>
        
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
      
      {/* Mô tả sản phẩm */}
      {product.description && (
        <div className="border-t">
          <h3 className="text-base font-medium px-5 py-4 border-b">MÔ TẢ SẢN PHẨM</h3>
          <div className="p-5">
            <HTMLPreview content={product.description} />
          </div>
        </div>
      )}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value?: string | React.ReactNode }) {
  return (
    <div className="flex px-5 py-3">
      <div className="w-1/3 text-muted-foreground">{label}</div>
      <div className="flex-1">{value ?? "Đang cập nhật"}</div>
    </div>
  );
}