// 'use client';

// import SearchProductGrid from './search-ProductGrid';
// import ShopSuggestion from './search-ShopSuggestions';
// import SearchSidebar from './search-Sidebar';
// import SearchSortBar from './search-SortBar';
// import SearchBrand from './search-Brand';
// import { Pagination } from '@/components/ui/pagination';

// export default function SearchDesktopIndex() {
//   return (
//     <div className="flex flex-col gap-6 p-6">
//       {/* Brands carousel section at the top */}
//       <SearchBrand />
      
//       {/* Main content with sidebar and products */}
//       <div className="flex gap-6">
//         <SearchSidebar />
//         <div className="flex-1 space-y-4">
//           <ShopSuggestion />
//           <div className="text-sm text-gray-500">
//             Kết quả tìm kiếm cho từ khoá{' '}
//             <span className="text-red-500 font-semibold">"hoa"</span>
//           </div>
//           <SearchSortBar />
//           <SearchProductGrid />
//           <Pagination />
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import ShopSuggestion from './search-ShopSuggestions';
import SearchSidebar from './search-Sidebar';
import SearchSortBar from './search-SortBar';
import SearchBrand from './search-Brand';
import SearchProductGrid from './search-ProductGrid';
// import Pagination from './pagination';
import { useSearchParams } from 'next/navigation';

interface SearchDesktopIndexProps {
  categoryId?: string | null;
}

export default function SearchDesktopIndex({ categoryId }: SearchDesktopIndexProps) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') || '';
  
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Brands carousel section at the top */}
      <SearchBrand />
      
      {/* Main content with sidebar and products */}
      <div className="flex gap-6">
        <SearchSidebar categoryId={categoryId} />
        <div className="flex-1 space-y-4">
          <ShopSuggestion />
          {keyword && (
            <div className="text-sm text-gray-500">
              Kết quả tìm kiếm cho từ khoá '{keyword}'
            </div>
          )}
          <SearchSortBar />
          <SearchProductGrid categoryId={categoryId} />
          {/* <Pagination /> */}
        </div>
      </div>
    </div>
  );
}