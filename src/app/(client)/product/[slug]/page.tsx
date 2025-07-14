// ✅ Sửa file: app/(client)/products/[slug]/page.tsx

import ProductPageClientWrapper from "@/components/client/products/ProductPageClientWrapper";

export default function Page({ params }: { params: { slug: string } }) {
  return <ProductPageClientWrapper slug={params.slug} />;
}
