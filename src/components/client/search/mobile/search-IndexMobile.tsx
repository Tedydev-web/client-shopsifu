'use client';


import { Pagination } from '@/components/ui/pagination';
import SearchSidebar from './search-Sidebar';
import ShopSuggestion from './search-ShopSuggestions';
import SearchSortBar from './search-SortBar';
import SearchProductGrid from './search-ProductGrid';
import SearchBrand from './search-Brand';
// import SearchBrandInfo from './search-Brand';

export default function SearchMobileIndex() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
      <div className="lg:block hidden">
        <SearchSidebar />
      </div>

      <div className="flex-1 space-y-4">
        {/* <SearchBrandInfo /> */}
        <SearchBrand/>
        <ShopSuggestion />
        <div className="text-sm text-gray-500 px-1 sm:px-0">
          Kết quả tìm kiếm cho từ khoá{' '}
          <span className="text-red-500 font-semibold">"hoa"</span>
        </div>
        <SearchSortBar />
        <SearchProductGrid />
        <Pagination />
      </div>
    </div>
  );
}
