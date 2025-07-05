"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  images: string[];
}

export default function ProductGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const mainImageIndex = hoveredIndex ?? 0;

  const showPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
    }
  };

  const showNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
    }
  };

  return (
    <div className="w-full md:w-[450px] space-y-2">
      {/* Ảnh lớn chính */}
      <Image
        src={images[mainImageIndex]}
        alt="Product"
        width={450}
        height={450}
        className="rounded border object-cover cursor-pointer"
        onClick={() => setSelectedIndex(mainImageIndex)}
      />

      {/* Ảnh nhỏ bên dưới */}
      <div className="flex gap-2">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            width={75}
            height={75}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setSelectedIndex(index)}
            className={`border rounded object-cover cursor-pointer transition ${
              hoveredIndex === index ? "ring-2 ring-primary border-red-600" : ""
            }`}
          />
        ))}
      </div>

      {/* Modal custom */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedIndex(null)}
          />

          {/* Modal content */}
          <div className="relative z-50 bg-black/60 w-[65vw] max-w-[900px] max-h-[90vh] rounded-lg p-6 flex flex-col items-center justify-center overflow-hidden">
            {/* Nút Đóng */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 "
            >
              <X className="w-6 h-6 text-gray-600 hover:text-white" />
              <span className="sr-only">Đóng</span>
            </Button>

            {/* Nút trái */}
            <Button
              variant="ghost"
              size="icon"
              onClick={showPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow ring-1 ring-black/10 hover:scale-105"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            {/* Ảnh lớn */}
            <Image
              src={images[selectedIndex]}
              alt="Preview"
              width={500}
              height={500}
              className="object-contain rounded mb-4 max-w-full max-h-[60vh]"
            />

            {/* Nút phải */}
            <Button
              variant="ghost"
              size="icon"
              onClick={showNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow ring-1 ring-black/10 hover:scale-105"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto max-w-full px-2 scroll-px-2">
              {images.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Thumbnail modal ${index}`}
                  width={90}
                  height={90}
                  onClick={() => setSelectedIndex(index)}
                  className={`border rounded object-cover cursor-pointer transition ${
                    index === selectedIndex ? "ring-2 ring-primary" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
