'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CheckoutHeader() {
  
  return (
    <div className="flex justify-center items-center py-4 border-b">
      <Link href="/" className="items-center hidden lg:flex">
        <Image 
          src="/images/logo/png-jpeg/Logo-Full-Red.png" 
          alt="Shopsifu Logo" 
          width={180} 
          height={66} 
          className="mr-2"
        />
      </Link>
    </div>
  );
}
