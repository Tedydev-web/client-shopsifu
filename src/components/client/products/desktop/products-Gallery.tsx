'use client';

import Image from 'next/image';

interface Props {
  images: string[];
}

export default function ProductGallery({ images }: Props) {
  return (
    <div className="w-full md:w-[500px] space-y-2">
      <Image
        src={images[0]}
        alt="Product"
        width={500}
        height={500}
        className="rounded border object-cover"
      />
      <div className="flex gap-2">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            width={60}
            height={60}
            className="border rounded object-cover"
          />
        ))}
      </div>
    </div>
  );
}
