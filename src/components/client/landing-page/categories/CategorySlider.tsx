'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import { useRef, useEffect, useState } from 'react';

interface Category {
  title: string;
  link: string;
}

interface CategorySliderProps {
  categories: Category[];
}

export function CategorySlider({ categories }: CategorySliderProps) {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!categoriesRef.current) return;
    
    const container = categoriesRef.current;
    const itemWidth = container.firstElementChild?.clientWidth || 0;
    const gap = 8;
    const containerWidth = container.clientWidth;
    const scrollAmount = Math.floor(containerWidth / (itemWidth + gap)) * (itemWidth + gap);
    
    const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    const maxScroll = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(targetScroll > 0);
    setCanScrollRight(targetScroll < maxScroll);
  };

  useEffect(() => {
    const checkScroll = () => {
      if (!categoriesRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div className="relative group">
      <div 
        ref={categoriesRef}
        className="flex items-center gap-2 overflow-x-hidden scroll-smooth transition-transform duration-500 ease-out py-1 px-2 -mx-2"
      >
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.link}
            className="flex-shrink-0"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="px-4 py-2 rounded-full border border-gray-200/80 hover:border-red-500 hover:bg-white hover:shadow-md transition-all duration-300 backdrop-blur-[2px]"
            >
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap hover:text-red-500 transition-colors duration-300 tracking-wide">
                {category.title}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95",
          !canScrollLeft && "opacity-0 pointer-events-none"
        )}
        onClick={() => scrollCategories('left')}
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95",
          !canScrollRight && "opacity-0 pointer-events-none"
        )}
        onClick={() => scrollCategories('right')}
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
