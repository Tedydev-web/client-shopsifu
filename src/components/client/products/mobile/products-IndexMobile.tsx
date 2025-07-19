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
import { MediaItem, transformProductImagesToMedia } from '../shared/productTransformers';

interface Props {
  readonly slug: string;
  product?: ClientProductDetail | null;
  isLoading?: boolean;
}

export default function ProductDetailMobile({ slug, product: productData, isLoading = false }: Props) {
  // Show loading state if needed
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }
  
  // Sử dụng real data hoặc fallback về mock data
  let productToUse;
  let media: MediaItem[];
  
  if (productData) {
    // Case 1: Có real data từ API
    productToUse = productData;
    // Biến đổi images từ API thành media format
    media = transformProductImagesToMedia(productData);
  } else {
    // Case 2: Sử dụng mock data
    productToUse = productMock;
    // Chuyển đổi mock data media sang đúng kiểu MediaItem
    media = (productMock.media || []).map(item => ({
      type: item.type === "video" ? "video" : "image",
      src: item.src
    })) as MediaItem[];
  }

  const sizes =
    productToUse?.variants?.find((v: any) => v.value === "Kích thước")?.options || [];
  const colors =
    productToUse?.variants?.find((v: any) => v.value === "Màu sắc")?.options || [];

  // Tạo product object hoàn chỉnh cho UI
  const product = {
    ...productToUse,
    sizes,
    colors,
    media,
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