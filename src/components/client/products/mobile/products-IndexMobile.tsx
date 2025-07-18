'use client';

import ProductGalleryMobile from './products-GalleryMobile';
import ProductInfoMobile from './products-InfoMobile';
import ProductSpecsMobile from './products-SpecMobile';
import ProductReviewsMobile from './products-ReviewsMobile';
import ProductSuggestionsMobile from './products-SuggestionMobile';
import ProductsFooter from './products-Footer';
import { productMock } from './mockData';
import { slugify } from '@/utils/slugify';

interface Props {
  readonly slug: string;
}

export default function ProductDetailMobile({ slug }: Props) {
  // const isMatch = slugify(productMock.name) === slug;

  // if (!isMatch) {
  //   return (
  //     <div className="text-center text-red-500 py-10">
  //       Không tìm thấy sản phẩm
  //     </div>
  //   );
  // }

  const sizes =
    productMock?.variants?.find((v) => v.value === "Kích thước")?.options || [];

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