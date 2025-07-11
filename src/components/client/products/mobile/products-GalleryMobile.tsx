"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ShoppingCart,
  MoreVertical,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaItem {
  type: "image" | "video";
  src: string;
}

interface Props {
  media: MediaItem[];
}

export default function ProductGalleryMobile({ media }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const dragStartX = useRef<number | null>(null);

  const router = useRouter();

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    if (wrapperRef.current) wrapperRef.current.style.transition = "none";
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

    if (deltaX < -40 && currentIndex < media.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (deltaX > 40 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      wrapperRef.current.style.transform = `translateX(-${
        currentIndex * 100
      }%)`;
    }

    dragStartX.current = null;
  };

  const handleVideoClick = () => {
    const video = videoRefs.current[currentIndex];
    if (!video) return;

    if (video.ended) {
      video.currentTime = 0;
      video.play();
    } else if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (!video) return;

    const handlePlay = () => {
      setIsPaused(false);
      setHasEnded(false);
    };
    const handlePause = () => setIsPaused(true);
    const handleEnded = () => {
      setIsPaused(true);
      setHasEnded(true);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (index !== currentIndex && video && !video.paused) {
        video.pause();
      }
    });

    const current = media[currentIndex];
    if (current?.type === "video") {
      setIsPaused(true);
      setHasEnded(false);
    } else {
      setIsPaused(false);
      setHasEnded(false);
    }
  }, [currentIndex]);

  return (
    <div className="w-full aspect-square bg-white relative overflow-hidden">
      <div
        className="flex h-full w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={wrapperRef}
      >
        {media.map((item, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 flex items-center justify-center bg-black relative"
          >
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={`Image ${index + 1}`}
                width={500}
                height={500}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <>
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }} // ✅ không return gì, hợp lệ với React Ref
                  src={item.src}
                  preload="metadata"
                  className="w-full h-full object-contain"
                  onClick={handleVideoClick}
                />
                {index === currentIndex && (isPaused || hasEnded) && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/60 rounded-full p-3">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {media.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full z-10">
          {currentIndex + 1}/{media.length}
        </div>
      )}

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
