'use client';

import ProductGalleryMobile from './products-GalleryMobile';
import ProductInfoMobile from './products-InfoMobile';
import ProductSpecsMobile from './products-SpecMobile';
import ProductReviewsMobile from './products-ReviewsMobile';
import ProductSuggestionsMobile from './products-SuggestionMobile';
import { productMock } from './mockData';

interface Props {
  slug: string;
}

export default function ProductDetailMobile({ slug }: Props) {
  const product = productMock;

  return (
    <div className="bg-[#f5f5f5] pb-16">
      <ProductGalleryMobile images={product.images} />
      <ProductInfoMobile product={product} />
      <ProductSpecsMobile product={product} />
      <ProductReviewsMobile reviews={product.reviews} />
      <ProductSuggestionsMobile products={product.suggestions} />
    </div>
  );
}
