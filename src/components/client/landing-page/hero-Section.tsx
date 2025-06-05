'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={cn("w-full py-12 md:py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - 8 cols */}
          <div className="lg:col-span-8">
            <div 
              className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Placeholder for the main image */}
              <div className="absolute inset-0 bg-gray-200 animate-pulse">
                {/* This will be replaced with an actual Image when available */}
              </div>

              {/* Overlay content - optional */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/60 to-transparent">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Bộ sưu tập mới nhất</h2>
                <p className="text-white mb-4 max-w-lg">Khám phá những xu hướng thời trang mới nhất cho mùa này</p>
                <Button className="w-fit">Khám phá ngay</Button>
              </div>
            </div>
          </div>

          {/* Right column - 4 cols */}
          <div className="lg:col-span-4">
            <div 
              className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Placeholder for the secondary image */}
              <div className="absolute inset-0 bg-gray-300 animate-pulse">
                {/* This will be replaced with an actual Image when available */}
              </div>

              {/* Overlay content - optional */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent">
                <h2 className="text-2xl font-bold text-white mb-2">Phong cách đặc biệt</h2>
                <p className="text-white mb-3">Tìm kiếm phong cách riêng của bạn</p>
                <Button variant="outline" className="w-fit bg-transparent border-white text-white hover:bg-white/20">
                  Xem thêm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}