"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import ProductGallery from "./products-Gallery";
import ProductInfo from "./products-Info";
import ProductSpecs from "./products-Spec";
import ProductReviews from "./products-Reviews";
import ProductSuggestions from "./products-Suggestion";
import { productMock } from "./mockData";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  slug: string;
}

export default function ProductDetail({ slug }: Props) {
  const product = productMock;

  return (
    <div className="bg-[#f5f5f5] py-4">
      {/* ✅ Breadcrumb nằm ngoài khối trắng, có margin và padding chuẩn */}
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

      {/* ✅ Khối sản phẩm trắng */}
      <div className="max-w-[1200px] mx-auto bg-white p-4 rounded">
        <div className="flex flex-col md:flex-row gap-6">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>

        <div className="mt-6">
          <ProductSpecs product={product} />
        </div>

        <div className="mt-6">
          <ProductReviews reviews={product.reviews} />
        </div>

        <div className="mt-6">
          <ProductSuggestions products={product.suggestions} />
        </div>
      </div>
    </div>
  );
}
