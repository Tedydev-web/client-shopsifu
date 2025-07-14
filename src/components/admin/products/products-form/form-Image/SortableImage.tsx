import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';

interface SortableImageProps {
  id: string;
  src: string;
  index: number;
  isMainImage?: boolean;
  isDragging: boolean;
  hoveredImageIndex: number | null;
  selectedImages: number[];
  setHoveredImageIndex: (index: number | null) => void;
  handleToggleSelect: (index: number) => void;
}

export const SortableImage: React.FC<SortableImageProps> = ({
  id,
  src,
  index,
  isMainImage = false,
  isDragging,
  hoveredImageIndex,
  selectedImages,
  setHoveredImageIndex,
  handleToggleSelect,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease',
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  const containerClasses = `
    relative rounded-lg overflow-hidden border aspect-square h-full w-full touch-none
    ${isMainImage ? 'col-span-2 row-span-2' : ''}
  `;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={containerClasses}
      onMouseEnter={() => setHoveredImageIndex(index)}
      onMouseLeave={() => setHoveredImageIndex(null)}
    >
      <div {...attributes} {...listeners} className="h-full w-full">
        <Image
          src={src}
          alt={`Ảnh sản phẩm ${index}`}
          className="object-contain w-full h-full"
          width={isMainImage ? 500 : 250}
          height={isMainImage ? 500 : 250}
          draggable={false}
        />
      </div>
      <div
        className={`absolute inset-0 bg-slate-900/20 transition-opacity duration-200 pointer-events-none ${hoveredImageIndex === index || selectedImages.includes(index) ? 'opacity-100' : 'opacity-0'}`}>
      </div>
      {(hoveredImageIndex === index || selectedImages.includes(index)) && (
        <Checkbox
          checked={selectedImages.includes(index)}
          onCheckedChange={() => handleToggleSelect(index)}
          className="absolute top-2 left-2 bg-white/80 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          aria-label={`Chọn ảnh ${index}`}
        />
      )}
    </div>
  );
};
