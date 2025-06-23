'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { banners, categories } from './landing-Mockdata';

// Animation variants cho banner slides
const slideVariants: Variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9,
    rotateX: direction > 0 ? 15 : -15,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9,
    rotateX: direction < 0 ? 15 : -15,
  }),
};

export function CategoriesSection() {
  // State management
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [direction, setDirection] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Banner autoplay effect
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoplay]);

  // Categories scroll handler
  const scrollCategories = (direction: 'left' | 'right') => {
    const container = document.querySelector('.categories-container');
    if (!container) return;
    
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

  // Monitor scroll position
  useEffect(() => {
    const container = document.querySelector('.categories-container');
    if (!container) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    checkScroll();
    

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <section className="w-full mt-6">
      <div className="max-w-[1550px] mx-auto">            
        {/* Banner Carousel */}
        <div className="h-[100px] md:h-[150px] lg:h-[150px] overflow-hidden rounded-xl relative">
          <AnimatePresence
            initial={false}
            mode="popLayout"
            custom={direction}
            onExitComplete={() => setIsAutoplay(true)}
          >
            {banners.map((banner, index) => (
              index === currentBanner && (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{
                    perspective: "2000px",
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="absolute block w-1 h-1 bg-white/30 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [0.5, 1, 0.5],
                          opacity: [0.3, 0.8, 0.3],
                          y: [0, -30, 0],
                        }}
                        transition={{
                          duration: Math.random() * 3 + 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                  <Image
                    src={banner.image}
                    alt={`Banner ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px"
                  />
                  <motion.div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent",
                      banner.gradient,
                      "after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/20 after:via-transparent after:to-black/10"
                    )}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: [0.4, 0.5, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 20,
                      ease: "easeInOut",
                    }}                  />
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Categories Section */}
        <div className="mt-5">
          <h2 className="text-lg font-bold text-gray-800 mb-3.5 flex items-center justify-center">
            <span className="tracking-tight relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-red-500/20">
              KHÁM PHÁ DANH MỤC
            </span>
          </h2>          <div className="relative px-12">
            <div className="categories-container flex items-center gap-3 overflow-x-hidden scroll-smooth transition-transform duration-500 ease-out py-2">
              {categories.map((category) => (
                <Link
                  key={category.title}
                  href={category.link}
                  className="flex-shrink-0"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 rounded-full border-2 border-gray-200/80 hover:border-red-500/80 bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-[2px]"
                  >
                    <span className="text-[15px] font-semibold text-gray-700 whitespace-nowrap hover:text-red-500 transition-colors duration-300 tracking-wide">
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
                "absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-gray-100 hover:border-red-500/50 hover:bg-red-50/50",
                !canScrollLeft && "opacity-0 pointer-events-none",
                "transition-all duration-300"
              )}
              onClick={() => scrollCategories('left')}
            >
              <ArrowRight className="w-5 h-5 text-gray-700 rotate-180" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-gray-100 hover:border-red-500/50 hover:bg-red-50/50",
                !canScrollRight && "opacity-0 pointer-events-none",
                "transition-all duration-300"
              )}
              onClick={() => scrollCategories('right')}
            >
              <ArrowRight className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
