'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function SearchInput() {
  return (
    <div className="flex items-center bg-white rounded-sm overflow-hidden shadow-sm flex-grow max-w-xl">
      <Input
        type="text"
        placeholder="Tìm sản phẩm, thương hiệu, và tên shop"
        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-4"
      />
      <Button type="submit" size="sm" className="h-10 rounded-l-none px-6 bg-red-500 hover:bg-red-600">
        <Search className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
