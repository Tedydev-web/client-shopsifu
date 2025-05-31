'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Nếu bạn đang dùng Tailwind Merge/clsx

interface SubCategory {
  id: string;
  name: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
  children: SubCategory[];
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Điện thoại',
    children: [
      { id: 'p1', name: 'iPhone 15 Pro', image: '/images/products/iphone.jpg' },
      { id: 'p2', name: 'Samsung S24', image: '/images/products/samsung.jpg' },
    ],
  },
  {
    id: '2',
    name: 'Laptop',
    children: [
      { id: 'p3', name: 'MacBook Pro', image: '/images/products/macbook.jpg' },
      { id: 'p4', name: 'Dell XPS', image: '/images/products/dell.jpg' },
    ],
  },
  {
    id: '3',
    name: 'Phụ kiện',
    children: [
      { id: 'p5', name: 'Tai nghe AirPods', image: '/images/products/airpods.jpg' },
      { id: 'p6', name: 'Sạc dự phòng', image: '/images/products/powerbank.jpg' },
    ],
  },
];

export function Categories() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  return (
    <div className="relative group">
      <button className="px-4 py-2 text-white font-medium text-sm hover:text-gray-200 transition-colors">
        Danh mục
      </button>

      <div className="absolute top-full left-0 min-w-[950px] bg-white rounded-xs shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="flex w-full">
          {/* Left: Main categories */}
          <div className="w-1/4 bg-white border-r-1 py-4 px-2 rounded-l-md">
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  onMouseEnter={() => setActiveCategory(cat)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 text-[14px] text-[#333] font-medium cursor-pointer rounded hover:bg-white transition-colors',
                    activeCategory?.id === cat.id && 'bg-gray-100 hover:bg-gray-100'
                  )}
                >
                  {cat.name}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Sub categories */}
          <div className="w-3/4 p-4 bg-white rounded-r-md">
            {activeCategory ? (
              <div className="grid grid-cols-4 gap-4">
                {activeCategory.children.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="group block text-center hover:bg-gray-100 p-2 rounded-md"
                  >
                    <div className="w-full aspect-square relative mb-1 rounded-md overflow-hidden bg-gray-50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <span className="text-[13px] text-[#333] group-hover:text-[#D70018] font-normal leading-tight">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                Di chuột vào danh mục để xem sản phẩm
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
