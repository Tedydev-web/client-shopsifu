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

  // Lấy category cha đầu tiên (nếu có)
  const category =
    product.categories && product.categories.length > 0
      ? product.categories[0]
      : null;

  // Lấy brand (nếu có)
  const brand = product.brand?.name || "";

  return (
    <div className="bg-[#f5f5f5] py-4">
      {/* ✅ Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-4 mb-3">
        <Breadcrumb className="mb-3 flex flex-wrap items-center text-sm text-muted-foreground">
          {/* Shopsifu cố định */}
          <BreadcrumbItem className="flex items-center gap-1">
            <BreadcrumbLink asChild>
              <Link href="/" className="text-black hover:underline">
                Shopsifu
              </Link>
            </BreadcrumbLink>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </BreadcrumbItem>

          {/* Category */}
          {category && (
            <BreadcrumbItem className="flex items-center gap-1">
              <BreadcrumbLink asChild>
                <Link
                  href={`/category/${slugify(category.name)}`}
                  className="text-black hover:underline"
                >
                  {category.name}
                </Link>
              </BreadcrumbLink>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </BreadcrumbItem>
          )}

          {/* Brand */}
          {brand && (
            <BreadcrumbItem className="flex items-center gap-1">
              <BreadcrumbLink asChild>
                <Link
                  href={`/brand/${slugify(brand)}`}
                  className="text-black hover:underline"
                >
                  {brand}
                </Link>
              </BreadcrumbLink>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </BreadcrumbItem>
          )}

          {/* Product name */}
          <BreadcrumbItem>
            <span className="text-foreground font-medium line-clamp-1">
              {product.name}
            </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* ✅ Chi tiết sản phẩm */}
      <div className="max-w-[1200px] mx-auto bg-white p-4 rounded">
        <div className="flex flex-col md:flex-row gap-6 md:items-stretch">
          <div className="flex-1">
            <ProductGallery media={product.media} />
          </div>
          <div className="flex-1 flex flex-col justify-between min-h-[400px]">
            <ProductInfo product={product} />
          </div>
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
