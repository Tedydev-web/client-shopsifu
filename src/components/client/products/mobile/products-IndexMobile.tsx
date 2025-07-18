'use client';

import ProductGalleryMobile from './products-GalleryMobile';
import ProductInfoMobile from './products-InfoMobile';
import ProductSpecsMobile from './products-SpecMobile';
import ProductReviewsMobile from './products-ReviewsMobile';
import ProductSuggestionsMobile from './products-SuggestionMobile';
import ProductsFooter from './products-Footer';
import { productMock } from './mockData';
import { slugify } from '@/utils/slugify';
import { ClientProductDetail } from "@/types/client.products.interface";

interface Props {
  readonly slug: string;
  product?: ClientProductDetail | null;
  isLoading?: boolean;
}

export default function ProductDetailMobile({ slug, product: productData, isLoading = false }: Props) {
  // Fallback to mock data if product is not loaded yet
  const productToUse = productData || productMock;
  
  // Show loading state if needed
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  const sizes =
    productToUse?.variants?.find((v: any) => v.value === "Kích thước")?.options || [];

  const colors =
    productMock?.variants?.find((v) => v.value === "Màu sắc")?.options || [];

  // Bổ sung origin, material mặc định nếu thiếu
  const product = {
    ...productMock,
    sizes,
    colors,
    media: productMock.media as { type: "image" | "video"; src: string }[],
  };

  return (
    <div className="bg-[#f5f5f5] pb-20">
      <ProductGalleryMobile media={product.media} />
      <ProductInfoMobile product={product} />
      <ProductSpecsMobile product={product} />
      <ProductReviewsMobile reviews={[]} />
      <ProductSuggestionsMobile products={[]} />
      <ProductsFooter />
    </div>
  );
}