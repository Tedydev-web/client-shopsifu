"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  images: string[];
}

export default function ProductGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const modalThumbRef = useRef<HTMLDivElement>(null);

  const currentImageIndex = hoveredIndex ?? 0;

  const scrollThumbnails = (direction: "left" | "right") => {
    if (!thumbRef.current) return;
    const scrollAmount = (80 + 12) * 4;
    thumbRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollModalThumbIntoView = (index: number) => {
    const container = modalThumbRef.current;
    if (!container) return;
    const item = container.children[index] as HTMLElement;
    if (item) {
      item.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  };

  const showPrev = () => {
    if (selectedIndex !== null) {
      const newIndex =
        selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
      setSelectedIndex(newIndex);
    }
  };

  const showNext = () => {
    if (selectedIndex !== null) {
      const newIndex =
        selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
      setSelectedIndex(newIndex);
    }
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
      scrollModalThumbIntoView(selectedIndex);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <div className="w-full md:w-[450px] space-y-3">
      {/* Main image */}
      <Image
        src={images[currentImageIndex]}
        alt="Main product image"
        width={450}
        height={450}
        className="w-full aspect-square object-cover rounded-lg border cursor-pointer"
        onClick={() => setSelectedIndex(currentImageIndex)}
      />

      {/* Thumbnails */}
      <div className="w-full flex items-center gap-1">
        <Button
          variant="ghost"
          className="w-10 h-10 bg-white border shadow-sm rounded-full"
          onClick={() => scrollThumbnails("left")}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div
          ref={thumbRef}
          className="flex gap-3 overflow-x-auto scroll-smooth px-1 w-full
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Thumbnail ${index}`}
              width={80}
              height={80}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(index)}
              className={`w-20 h-20 min-w-[80px] min-h-[80px] object-cover rounded-lg border cursor-pointer transition shrink-0 ${
                hoveredIndex === index
                  ? "ring-2 ring-primary border-red-500"
                  : ""
              }`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-10 h-10 bg-white border shadow-sm rounded-full"
          onClick={() => scrollThumbnails("right")}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-hidden">
          <div className="relative z-50 w-full h-full flex items-center justify-center px-4">
            {/* ✅ Nền đen click để đóng modal */}
            <div
              className="absolute inset-0 pointer-events-auto"
              onClick={() => setSelectedIndex(null)}
              style={{ zIndex: 0 }}
            />

            {/* Nút đóng */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white shadow rounded-full z-20"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Nút mũi tên trái */}
            <Button
              size="icon"
              variant="ghost"
              onClick={showPrev}
              className="absolute left-[max(1rem,calc(50%-350px))] top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow rounded-full z-20"
            >
              <ChevronLeft className="w-7 h-7" />
            </Button>

            {/* Nút mũi tên phải */}
            <Button
              size="icon"
              variant="ghost"
              onClick={showNext}
              className="absolute right-[max(1rem,calc(50%-350px))] top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow rounded-full z-20"
            >
              <ChevronRight className="w-7 h-7" />
            </Button>

            {/* Nội dung modal */}
            <div className="flex w-full max-w-6xl h-[90vh] rounded-xl overflow-hidden relative items-center justify-center z-10">
              <div className="flex-1 flex items-center justify-center p-4">
                <Image
                  src={images[selectedIndex]}
                  alt="Preview"
                  width={600}
                  height={600}
                  className="object-contain rounded-xl max-w-full max-h-[80vh]"
                />
              </div>

              {/* Thumbnail modal */}
              <div
                ref={modalThumbRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto max-w-[90%] px-2
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden z-10"
              >
                {images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`Modal thumb ${index}`}
                    width={80}
                    height={80}
                    onClick={() => setSelectedIndex(index)}
                    className={`w-20 h-20 min-w-[80px] min-h-[80px] object-cover cursor-pointer rounded border transition ${
                      index === selectedIndex ? "ring-2 ring-primary" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
