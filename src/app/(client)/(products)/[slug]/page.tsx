import { SearchContent } from "@/components/client/search/search-Main";
import { extractCategoryId, isCategorySlug } from "@/utils/slugify";
import { Metadata } from "next";

// Định nghĩa interface cho params
interface PageProps {
  params: Promise<{
    slug: string;
  }>
}

// Hàm để decode URL và clean text
function cleanCategoryName(slug: string): string {
  try {

    const decoded = decodeURIComponent(slug);
    const cleanName = decoded.split('-cat.')[0];
    const formatted = cleanName
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return formatted;
  } catch (error) {
    console.error('Error decoding category name:', error);
    // Fallback: chỉ thay thế dấu gạch ngang
    return slug.split('-cat.')[0].replace(/-/g, ' ');
  }
}

// Hàm để tạo metadata động (cho SEO)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // *** FIX: Await params trước khi sử dụng (Next.js 15) ***
  const { slug } = await params;
  
  // Xử lý tiêu đề dựa trên slug
  let title = "Tìm kiếm sản phẩm | ShopSifu";
  let description = "Tìm kiếm và mua sắm các sản phẩm chất lượng cao với giá tốt nhất tại ShopSifu";
  
  if (isCategorySlug(slug)) {
    const categoryName = cleanCategoryName(slug);
    title = `Mua sắm online sản phẩm ${categoryName} | ShopSifu Việt Nam`;
    description = `Khám phá các sản phẩm ${categoryName.toLowerCase()} chất lượng cao với giá tốt nhất tại ShopSifu. Giao hàng nhanh, đảm bảo chính hãng.`;
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${slug}`,
    },
  };
}

// Component chính của trang
export default async function ProductPage({ params }: PageProps) {
  // *** FIX: Await params trước khi sử dụng (Next.js 15) ***
  const { slug } = await params;
  let categoryId: string | null = null;
  
  // Kiểm tra nếu slug có hậu tố "-cat."
  if (isCategorySlug(slug)) {
    categoryId = extractCategoryId(slug);
  }
  

  console.log('ProductPage:', { 
    slug: decodeURIComponent(slug), 
    categoryId 
  });

  return <SearchContent categoryId={categoryId} />;
}