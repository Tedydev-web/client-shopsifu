'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function SearchInput() {
  return (
    <div className="relative w-full">
      <div className="flex items-center bg-white rounded-[2px] overflow-hidden shadow-sm flex-grow text-black">
        <Input
          type="text"
          placeholder="Tìm sản phẩm, thương hiệu, và tên shop"
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-4 text-[15px]"
        />
        <Button 
          type="submit" 
          size="sm" 
          className="h-9 rounded-none px-6 m-1 bg-red-500 hover:bg-red-600"
        >
          <Search className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* Search Suggestions */}
      <div className="absolute pb-2 capitalize top-full left-0 right-0 mt-1 flex items-center gap-4 text-[12px] text-white/90">
        <div className="flex items-center gap-3">
          <a href="#" className="hover:text-white transition-colors">áo thun</a>
          <a href="#" className="hover:text-white transition-colors">quần jean</a>
          <a href="#" className="hover:text-white transition-colors">giày thể thao</a>
          <a href="#" className="hover:text-white transition-colors">túi xách</a>
          <a href="#" className="hover:text-white transition-colors">đồng hồ</a>
          <a href="#" className="hover:text-white transition-colors">áo thun</a>
          <a href="#" className="hover:text-white transition-colors">quần jean</a>
          <a href="#" className="hover:text-white transition-colors">giày thể thao</a>
          <a href="#" className="hover:text-white transition-colors">túi xách</a>
          <a href="#" className="hover:text-white transition-colors">đồng hồ</a>
        </div>
      </div>
    </div>
  );
}
