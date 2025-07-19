'use client';

import SearchProductGrid from './search-ProductGrid';
import ShopSuggestion from './search-ShopSuggestions';
import SearchSidebar from './search-Sidebar';
import SearchSortBar from './search-SortBar';
import { Pagination } from '@/components/ui/pagination';

export default function SearchDesktopIndex() {
  return (
    <div className="flex gap-6 p-6">
      <SearchSidebar />
      <div className="flex-1 space-y-4">
        <ShopSuggestion />
        <div className="text-sm text-gray-500">
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
