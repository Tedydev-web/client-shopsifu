'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { categories, Category } from './desktop-Mockdata';

export function CategoriesV2() {
  const [activeCategory, setActiveCategory] = React.useState<Category | null>(categories[0] || null);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
                                        <NavigationMenuTrigger className="text-white bg-transparent backdrop-blur-sm hover:bg-[#E9E9E9]/[0.4] focus:bg-[#E9E9E9]/[0.4] data-[state=open]:bg-[#E9E9E9]/[0.4] h-auto px-4 py-3 font-semibold text-sm rounded-full">
            <Menu className="w-5 h-5 mr-1" />
            Danh mục
          </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-0">
            <div className="flex w-[950px] bg-white rounded-lg shadow-lg">
              {/* Left: Main categories */}
              <div className="w-1/4 border-r border-gray-100 p-2">
                <div role="menu" className="space-y-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onMouseEnter={() => setActiveCategory(cat)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors text-[#333]',
                        activeCategory?.id === cat.id
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-100'
                      )}
                      role="menuitem"
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Sub categories */}
              <div className="w-3/4 p-4">
                {activeCategory ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-gray-800">
                        {activeCategory.name}
                      </h3>
                      <Link
                        href={`/category/${activeCategory.id}`}
                        className="flex items-center text-sm text-red-600 hover:underline font-medium"
                      >
                        Xem tất cả
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4">
                      {activeCategory.children.map((item) => (
                        <Link
                          key={item.id}
                          href={`/product/${item.id}`}
                          className="group block text-center p-2 rounded-lg transition-all duration-200"
                        >
                          <div className="w-full aspect-square relative mb-2 rounded-lg overflow-hidden border border-gray-100 group-hover:border-red-200">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="120px"
                              className="transition-transform duration-300 group-hover:scale-110 object-cover"
                            />
                          </div>
                          <span className="text-xs text-gray-700 group-hover:text-red-600 font-normal leading-tight line-clamp-2 h-8 block">
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Hover over a category to see details.</p>
                  </div>
                )}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
