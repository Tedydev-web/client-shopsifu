'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function MobileSearchInput() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-1 max-w-xl">
      <div className="flex items-center gap-2 bg-white rounded-full shadow-sm hover:shadow transition-all">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-4 pr-2 text-gray-700 placeholder-gray-400 bg-transparent rounded-l-full focus:outline-none"
            placeholder="Tìm kiếm sản phẩm..."
          />
        </div>

        {/* Search Button */}
        <Link
          href={searchTerm ? `/search?q=${encodeURIComponent(searchTerm)}` : '#'}
          onClick={(e) => !searchTerm && e.preventDefault()}
          className="flex items-center justify-center h-8 w-8 hover:bg-gray-100 text-gray-600 rounded-full transition-colors mr-1"
        >
          <Search className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}