'use client';

import ProductGallery from './products-Gallery';
import ProductInfo from './products-Info';
import ProductSpecs from './products-Spec';
import ProductReviews from './products-Reviews';
import ProductSuggestions from './products-Suggestion';
import { productMock } from './mockData';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Props {
  slug: string;
}

export default function ProductDetail({ slug }: Props) {
  const product = productMock;

  return (
    <div className="bg-[#f5f5f5] py-4">
      <div className="max-w-[1200px] mx-auto bg-white p-4 rounded">

        {/* ✅ Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
          <Link href="/" className="hover:underline text-black">Trang chủ</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:underline text-black">Sản phẩm</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </div>

        {/* Product layout */}
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
