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

interface FlashSaleSectionProps {
  className?: string;
}

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 2);
    targetTime.setMinutes(0);
    targetTime.setSeconds(0);

    const now = new Date().getTime();
    const difference = targetTime.getTime() - now;

    let timeLeft: { hours: number; minutes: number; seconds: number } = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (time: number) => String(time).padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5">
      <span className="bg-gray-800 text-white text-sm font-bold w-7 h-7 flex items-center justify-center rounded-sm">{formatTime(timeLeft.hours)}</span>
      <span className="text-gray-800 font-bold">:</span>
      <span className="bg-gray-800 text-white text-sm font-bold w-7 h-7 flex items-center justify-center rounded-sm">{formatTime(timeLeft.minutes)}</span>
      <span className="text-gray-800 font-bold">:</span>
      <span className="bg-gray-800 text-white text-sm font-bold w-7 h-7 flex items-center justify-center rounded-sm">{formatTime(timeLeft.seconds)}</span>
    </div>
  );
};

export function FlashSaleSection({ className }: FlashSaleSectionProps) {
  return (
    <section className={cn("w-full bg-white mt-4 py-4 rounded-sm", className)}>
       <div className="max-w-[1250px] w-full mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-red-500 uppercase tracking-wider">Flash Sale</h2>
            <CountdownTimer />
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
            slidesToScroll: 6,
          }}
          className="relative"
        >
          <CarouselContent className="-ml-2.5">
            {mockProducts.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 md:basis-1/6 pl-2.5">
                <a href="#" className="block border border-transparent rounded-xs overflow-hidden transition-all duration-300 group">
                  <div className="relative w-full bg-gray-100 pt-[100%]">
                    <Image 
                      src={product.image} 
                      alt={`Product ${product.id}`} 
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16.6vw"
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
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md border border-gray-200" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md border border-gray-200" />
        </Carousel>
      </div>
    </section>
  );
}
