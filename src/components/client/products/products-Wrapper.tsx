'use client';
import dynamic from "next/dynamic";

const ProductPageDynamic = dynamic(
  () => import("./products-Index").then(mod => mod.ProductPage),
  { ssr: false }
);

interface ProductWrapperProps {
  slug: string;
  initialData?: any;
  error?: any;
}

export default function ProductPageWrapper({ slug, initialData, error }: ProductWrapperProps) {
  return <ProductPageDynamic slug={slug} initialData={initialData} error={error} />;
}
