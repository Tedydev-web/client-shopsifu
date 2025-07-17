// app/(client)/products/[slug]/page.tsx
//Nextjs 15 lỗi không đồng bộ params nên phải dùng $ npx @next/codemod@canary next-async-request-api .

import ProductPageClientWrapper from "@/components/client/products/ProductPageClientWrapper";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ✅ unwrap async params
  return <ProductPageClientWrapper slug={slug} />;
}
