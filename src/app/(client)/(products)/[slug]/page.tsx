
// import { SearchContent } from "@/components/client/search/search-Main";
// export default function ProductDetailPage() {
//     return <SearchContent />;
// }



import { SearchContent } from "@/components/client/search/search-Main";
import { extractCategoryId, isCategorySlug } from "@/utils/slugify";
import { Metadata } from "next";

// Định nghĩa interface cho params
interface PageProps {
  params: {
    slug: string;
  }
}

// Hàm để tạo metadata động (cho SEO)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  // Xử lý tiêu đề dựa trên slug
  let title = "Tìm kiếm sản phẩm";
  
  if (isCategorySlug(slug)) {
    const cleanName = slug.split('-cat.')[0].replace(/-/g, ' ');
    title = `${cleanName} | ShopSifu`;
  }
  return {
    title,
  };
}

// Component chính của trang
export default function ProductPage({ params }: PageProps) {
  const { slug } = params;
  let categoryId: string | null = null;
  
  // Kiểm tra nếu slug có hậu tố "-cat."
  if (isCategorySlug(slug)) {
    categoryId = extractCategoryId(slug);
  }
  
  // Truyền categoryId vào SearchContent component để nó có thể fetch dữ liệu phù hợp
  return <SearchContent categoryId={categoryId} />;
}