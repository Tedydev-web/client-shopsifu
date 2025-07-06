"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShoppingCart, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  images: string[];
}

export default function ProductGalleryMobile({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);

  const router = useRouter();

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    if (wrapperRef.current) {
      wrapperRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!wrapperRef.current || dragStartX.current === null) return;

    const deltaX = e.touches[0].clientX - dragStartX.current;
    wrapperRef.current.style.transform = `translateX(calc(${
      -currentIndex * 100
    }% + ${deltaX}px))`;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!wrapperRef.current || dragStartX.current === null) return;

    const deltaX = e.changedTouches[0].clientX - dragStartX.current;

    wrapperRef.current.style.transition = "transform 0.3s ease-in-out";

    if (deltaX < -40 && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (deltaX > 40 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Vuốt không đủ xa hoặc đang ở đầu/cuối → reset về vị trí ban đầu
      wrapperRef.current.style.transform = `translateX(-${
        currentIndex * 100
      }%)`;
    }

    dragStartX.current = null;
  };

  return (
    <div className="w-full aspect-square bg-white relative overflow-hidden">
      {/* ✅ Slide wrapper */}
      <div
        className="flex h-full w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={wrapperRef}
      >
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Image ${index + 1}`}
            width={500}
            height={500}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* ✅ Đếm ảnh */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full z-10">
          {currentIndex + 1}/{images.length}
        </div>
      )}

      {/* ✅ 3 nút đầu trang */}
      <div className="absolute top-6 left-0 right-0 px-4 flex justify-between items-center z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 text-white hover:bg-black/70 w-9 h-9 p-0 rounded-full"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 text-white hover:bg-black/70 w-9 h-9 p-0 rounded-full"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 text-white hover:bg-black/70 w-9 h-9 p-0 rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
