'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { mockProducts } from './landing-Mockdata';
import { useIsMobile } from '@/hooks/use-mobile';

interface FlashSaleSectionProps {
  className?: string;
}

const CountdownTimer = ({ isMobile }: { isMobile: boolean }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        }
        if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        }
        if (prevTime.hours > 0) {
          return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        }
        clearInterval(timer);
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn(
        "bg-gray-800 text-white font-bold flex items-center justify-center rounded-sm",
        isMobile ? "w-6 h-6 text-xs" : "w-7 h-7 text-sm"
      )}>
        {formatTime(timeLeft.hours)}
      </span>
      <span className="text-gray-800 font-bold">:</span>
      <span className={cn(
        "bg-gray-800 text-white font-bold flex items-center justify-center rounded-sm",
        isMobile ? "w-6 h-6 text-xs" : "w-7 h-7 text-sm"
      )}>
        {formatTime(timeLeft.minutes)}
      </span>
      <span className="text-gray-800 font-bold">:</span>
      <span className={cn(
        "bg-gray-800 text-white font-bold flex items-center justify-center rounded-sm",
        isMobile ? "w-6 h-6 text-xs" : "w-7 h-7 text-sm"
      )}>
        {formatTime(timeLeft.seconds)}
      </span>
    </div>
  );
};

export function FlashSaleSection({ className }: FlashSaleSectionProps) {
  const isMobile = useIsMobile();

  return (
    <section className={cn("w-full bg-white mt-4 py-4 rounded-sm", className)}>
       <div className="max-w-[1250px] w-full mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className={cn(
              "font-bold text-red-500 uppercase tracking-wider",
              isMobile ? "text-base" : "text-xl"
            )}>
              Flash Sale
            </h2>
            <CountdownTimer isMobile={isMobile} />
          </div>
          <a href="#" className="flex items-center text-sm text-red-500 hover:underline">
            Xem tất cả
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Products Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: isMobile ? 2 : 6,
          }}
          className="relative"
        >
          <CarouselContent className="-ml-2.5">
            {mockProducts.map((product) => (
              <CarouselItem key={product.id} className={cn(
                "pl-2.5",
                isMobile ? "basis-1/2" : "basis-1/6"
              )}>
                <a href="#" className="block border border-transparent rounded-xs overflow-hidden transition-all duration-300 group">
                  <div className="relative w-full bg-gray-100 pt-[100%]">
                    <Image 
                      src={product.image} 
                      alt={`Product ${product.id}`} 
                      fill
                      sizes="(max-width: 640px) 50vw, 16.6vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-lg font-semibold text-red-500">
                      đ {product.price}
                    </p>
                    <div className="mt-2 w-full bg-red-100 rounded-full h-4 overflow-hidden relative">
                        <div 
                            className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full"
                            style={{ width: `${(product.sold / product.total) * 100}%` }}
                        ></div>
                        <span className='absolute inset-0 text-white text-xs font-semibold flex items-center justify-center uppercase tracking-tighter'>
                            {product.label}
                        </span>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md border border-gray-200 hidden md:flex" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md border border-gray-200 hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
