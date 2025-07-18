// 'use client';

// import { useEffect, useState } from 'react';
// import ProductItem, { ProductItemSkeleton } from '@/components/ui/product-component/product-Item';
// import { mockProductsItem } from '@/components/client/landing-page/landing-Mockdata';

// const SuggestSection = () => {
//   const [isLoading, setIsLoading] = useState(true);

//   // Mô phỏng việc tải dữ liệu từ API
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 2000); // Tải trong 2 giây

//     return () => clearTimeout(timer); // Dọn dẹp khi component unmount
//   }, []);

//   return (
//     <div className="bg-gray-100 py-4">
//       <div className="container mx-auto">
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
//           {isLoading
//             ? Array.from({ length: 12 }).map((_, index) => <ProductItemSkeleton key={index} />)
//             : mockProductsItem.map((product) => (
//                 <ProductItem key={product.id} product={product} isLoading={false} />
//               ))}
//         </div>
//         <div className="text-center mt-4">
//           <button className="px-16 py-2 border border-gray-400 text-gray-600 hover:bg-gray-200 transition-colors">
//             Xem thêm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuggestSection;



// components/client/landing-page/suggest-Section.tsx
'use client';

import { useClientSuggestedProducts } from '@/hooks/client-products/useClientSuggestedProducts';
import ProductItem, { ProductItemSkeleton } from '@/components/ui/product-component/product-Item';

interface SuggestSectionProps {
  title?: string;
  categoryId?: string;
  initialLimit?: number;
}

const SuggestSection = ({
  title = 'Gợi ý cho bạn',
  categoryId,
  initialLimit = 12
}: SuggestSectionProps) => {
  const {
    products,
    initialLoading,
    loading,
    hasMore,
    loadMore,
    error
  } = useClientSuggestedProducts({
    initialLimit,
    categoryId,
    // Các sản phẩm gợi ý thường là sản phẩm mới nhất hoặc bán chạy nhất
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  return (
    <div className="bg-gray-100 py-4">
      <div className="container mx-auto">
        <h2 className="text-xl font-medium mb-4 px-2">{title}</h2>
        
        {error && (
          <div className="text-center p-4 text-red-500">
            Không thể tải sản phẩm. Vui lòng thử lại sau.
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {initialLoading
            ? Array.from({ length: initialLimit }).map((_, index) => (
                <ProductItemSkeleton key={index} />
              ))
            : products.map((product) => (
                <ProductItem key={product.id} product={product} isLoading={false} />
              ))}
        </div>
        
        {!initialLoading && hasMore && (
          <div className="text-center mt-4">
            <button 
              className={`px-16 py-2 border border-gray-400 text-gray-600 hover:bg-gray-200 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? 'Đang tải...' : 'Xem thêm'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestSection;