'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function SearchSortBar() {
  const [sort, setSort] = useState('Liên Quan');

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
      {['Liên Quan', 'Mới Nhất', 'Bán Chạy'].map((option) => (
        <button
          key={option}
          className={`px-3 py-1 border rounded ${
            sort === option ? 'bg-primary text-white' : 'text-gray-700'
          }`}
          onClick={() => setSort(option)}
        >
          {option}
        </button>
      ))}
      <div className="relative">
        <button className="px-3 py-1 border rounded flex items-center gap-1">
          Giá <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}
