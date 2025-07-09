"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import ProductGallery from "./products-Gallery";
import ProductInfo from "./products-Info";
import ProductSpecs from "./products-Spec";
import ProductReviews from "./products-Reviews";
import ProductSuggestions from "./products-Suggestion";
import { productMock } from "./mockData";
import { slugify } from "@/utils/slugify";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";

interface Props {
  slug: string;
}

export default function ProductDetail({ slug }: Props) {
  const isMatch = slugify(productMock.name) === slug;

  if (!isMatch) {
    return (
      <div className="text-center text-red-500 py-10">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  const sizes =
    productMock?.variants?.find((v) => v.value === "Kích thước")?.options || [];

  const colors =
    productMock?.variants?.find((v) => v.value === "Màu sắc")?.options || [];

  const product = {
    ...productMock,
    sizes,
    colors,
    media: productMock.media as { type: "image" | "video"; src: string }[],
  };

  return (
    <div className="bg-[#f5f5f5] py-4">
      {/* ✅ Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-4 mb-3">
        <Breadcrumb className="mb-3 flex flex-wrap items-center text-sm text-muted-foreground">
          <BreadcrumbItem className="flex items-center gap-1">
            <BreadcrumbLink asChild>
              <Link href="/" className="text-black hover:underline">
                Trang chủ
              </Link>
            </BreadcrumbLink>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </BreadcrumbItem>

          <BreadcrumbItem className="flex items-center gap-1">
            <BreadcrumbLink asChild>
              <Link href="/products" className="text-black hover:underline">
                Sản phẩm
              </Link>
            </BreadcrumbLink>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </BreadcrumbItem>

          <BreadcrumbItem>
            <span className="text-foreground font-medium line-clamp-1">
              {product.name}
            </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* ✅ Chi tiết sản phẩm */}
      <div className="max-w-[1200px] mx-auto bg-white p-4 rounded">
        <div className="flex flex-col md:flex-row gap-6">
          <ProductGallery media={product.media} />
          <ProductInfo product={product} />
        </div>

        {/* ✅ Thông số kỹ thuật */}
        <div className="mt-6">
          <ProductSpecs product={product} />
        </div>

        {/* ✅ Đánh giá (dữ liệu giả nếu chưa có) */}
        <div className="mt-6">
          <ProductReviews reviews={[]} />
        </div>

        {/* ✅ Gợi ý sản phẩm (dữ liệu giả nếu chưa có) */}
        <div className="mt-6">
          <ProductSuggestions products={[]} />
        </div>
      </div>
    </div>
  );
}
