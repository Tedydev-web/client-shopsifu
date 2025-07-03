'use client';

import Image from 'next/image';

export default function ProductGalleryMobile({ images }: { images: string[] }) {
  return (
    <div className="w-full aspect-square bg-white">
      <Image
        src={images[0]}
        alt="Main product image"
        width={500}
        height={500}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
