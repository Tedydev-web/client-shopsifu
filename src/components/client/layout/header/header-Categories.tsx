'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
  const [open, setOpen] = useState(false);
  
  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  return (    
    <>
      {/* Background overlay when dropdown is open - positioned below header */}
      <div 
        className={cn(
          "fixed top-[75px] left-0 right-0 bottom-0 bg-black transition-all duration-300 category-backdrop",
          open 
            ? "opacity-50 visible z-40" 
            : "opacity-0 invisible"
        )}
        onClick={handleMouseLeave}
      />
      
      <div 
        className="relative z-50 category-hover-container"
      >
        {/* Invisible extended hover area to maintain hover state */}
        {open && (
          <div 
            className="absolute top-0 left-[-20px] w-[260px] h-[calc(100%+18px)] category-hover-area"
            onMouseEnter={handleMouseEnter}
          />
        )}
        
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background animation layer - positioned absolutely */}
          <motion.div
            className="absolute inset-0 rounded-full backdrop-blur-sm"
            initial={{ backgroundColor: "rgba(255,255,255,0)" }}
            animate={{ 
              backgroundColor: open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0)",
              boxShadow: open ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" : "none" 
            }}
            whileHover={{ 
              backgroundColor: "rgba(255,255,255,0.12)",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              scale: 1.05,
              y: -2
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 20 
            }}
          />
          
          {/* Content layer - stays in place */}
          <div className="cursor-pointer relative whitespace-nowrap inline-flex items-center gap-1 px-4 py-3 text-white font-semibold text-sm z-10">
            Danh mục
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </div>
        </div>        <motion.div 
          className={cn(
            "border-1 border-gray-200 absolute top-[calc(100%+12px)] left-[-180px] min-w-[950px] bg-white rounded-xs shadow-xl z-50",
            open ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          style={{
            height: '900px',
            maxHeight: 'calc(90vh - 120px)', // 90vh để còn khoảng trống ở dưới
            marginBottom: '20px'
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: open ? 1 : 0, 
            y: open ? 0 : -10,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Bubble arrow pointing to the title */}
          <div className="absolute left-[230px] top-[-7px] w-3 h-3 bg-white transform rotate-45 border-t-1 border-l-1 border-gray-200 z-1"></div>

          <div className="flex h-full w-full relative z-10">
            {/* Left: Main categories */}
            <div className="h-full w-1/4 bg-white border-r-1 pr-2 py-4 rounded-l-md">
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onMouseEnter={() => setActiveCategory(cat)}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-[14px] text-[#333] font-medium cursor-pointer hover:bg-white transition-colors',
                      activeCategory?.id === cat.id && 'bg-gray-100 hover:bg-gray-100'
                    )}
                  >
                    {cat.name}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </li>
                ))}
              </ul>
            </div>            {/* Right: Sub categories */}
            <div className="w-3/4 p-4 bg-white rounded-r-md overflow-y-auto h-full">
              {activeCategory ? (
                <div className="space-y-6">
                  {/* Category title with arrow */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-gray-800">{activeCategory.name}</h3>
                    <Link href={`/category/${activeCategory.id}`} className="flex items-center text-sm text-red-600 hover:underline font-medium">
                      Xem tất cả
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  
                  {/* Items grid - 5 items per row */}
                  <div className="grid grid-cols-5 gap-4">
                    {activeCategory.children.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.id}`}
                        className="group block text-center p-2 rounded-lg transition-all duration-200"
                      >
                        <div className="w-full aspect-square relative mb-2 rounded-full overflow-hidden border border-gray-100">
                          <Image
                            src="/images/demo/3.webp"
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <span className="text-[13px] text-[#333] group-hover:text-[#D70018] font-normal leading-tight line-clamp-2 h-10">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Additional section for featured items */}
                  {/* <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-medium text-gray-700">Sản phẩm nổi bật</h3>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Link
                          key={`featured-${i}`}
                          href={`/product/featured-${i}`}
                          className="group block text-center hover:bg-gray-50 p-2 rounded-lg transition-all duration-200"
                        >
                          <div className="w-full aspect-square relative mb-2 rounded-full overflow-hidden bg-gray-50 border border-gray-100">
                            <Image
                              src="/images/demo/3.webp"
                              alt={`Sản phẩm nổi bật ${i}`}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <span className="text-[13px] text-[#333] group-hover:text-[#D70018] font-normal leading-tight line-clamp-2 h-10">
                            {activeCategory.name} nổi bật {i}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div> */}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  Di chuột vào danh mục để xem sản phẩm
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
