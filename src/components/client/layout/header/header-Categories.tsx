'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  relatedProducts: {
    id: string;
    name: string;
    image: string;
  }[];
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Điện thoại',
    relatedProducts: [
      { id: 'p1', name: 'iPhone 15 Pro', image: '/images/products/iphone.jpg' },
      { id: 'p2', name: 'Samsung S24', image: '/images/products/samsung.jpg' },
    ],
  },
  {
    id: '2',
    name: 'Laptop',
    relatedProducts: [
      { id: 'p3', name: 'MacBook Pro', image: '/images/products/macbook.jpg' },
      { id: 'p4', name: 'Dell XPS', image: '/images/products/dell.jpg' },
    ],
  },
  {
    id: '3',
    name: 'Phụ kiện',
    relatedProducts: [
      { id: 'p5', name: 'Tai nghe AirPods', image: '/images/products/airpods.jpg' },
      { id: 'p6', name: 'Sạc dự phòng', image: '/images/products/powerbank.jpg' },
    ],
  },
];

export function Categories() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  return (
    <div className="relative group">
      <button className="px-4 py-2 text-white hover:text-gray-200 transition-colors">
        Danh mục
      </button>
      
      <div className="absolute top-full left-0 w-[800px] bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="flex">
          {/* Left column - Categories */}
          <div className="w-1/3 bg-gray-50 p-4 rounded-l-lg">
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  onMouseEnter={() => setActiveCategory(category)}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  <span>{category.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </li>
              ))}
            </ul>
          </div>

          {/* Right column - Related Products */}
          <div className="w-2/3 p-4">
            {activeCategory ? (
              <div className="grid grid-cols-2 gap-4">
                {activeCategory.relatedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group"
                  >
                    <div className="p-2 hover:bg-gray-50 rounded-md">
                      <div className="aspect-square bg-gray-100 rounded-md mb-2">
                        {/* Add product image here */}
                      </div>
                      <p className="text-sm text-gray-700 group-hover:text-blue-600">
                        {product.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Di chuột vào danh mục để xem sản phẩm
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
