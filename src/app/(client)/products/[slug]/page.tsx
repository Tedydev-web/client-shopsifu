// app/(client)/products/[slug]/page.tsx
//Nextjs 15 lỗi không đồng bộ params nên phải dùng $ npx @next/codemod@canary next-async-request-api .

// import ProductPageClientWrapper from "@/components/client/products/ProductPageClientWrapper";

// export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params; // ✅ unwrap async params
//   return <ProductPageClientWrapper slug={slug} />;
// }


// src/app/(client)/products/[slug]/page.tsx
import { clientProductsService } from '@/services/clientProductsService';
import ProductPageClientWrapper from "@/components/client/products/ProductPageClientWrapper";
import { ClientProductDetail } from '@/types/client.products.interface';

// Khai báo caching và revalidation
export const revalidate = 300; // 5 phút

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  try {
    // Fetch data cơ bản từ server
    const productData = await clientProductsService.getProductDetail(slug);
    console.log(`✅ [Server] Fetched product: ${productData.name} (ID: ${productData.id})`);
    
    // Truyền data đã fetch xuống client component
    return <ProductPageClientWrapper slug={slug} initialData={productData} />;
  } catch (error) {
    console.error('❌ [Server] Error fetching product:', error);
    // Handle error state hoặc redirect
    return <ProductPageClientWrapper slug={slug} error={error} />;
  }
}