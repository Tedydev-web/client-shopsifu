'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';

interface MobileCategoriesProps {
  children: React.ReactNode;
}

export function MobileCategories({ children }: MobileCategoriesProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Danh mục sản phẩm</SheetTitle>
          <SheetDescription>
            Khám phá các sản phẩm theo danh mục.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Link
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Thời trang Nam
          </Link>
          <Link
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Thời trang Nữ
          </Link>
          <Link
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Thiết bị điện tử
          </Link>
          <Link
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Sách & Văn phòng phẩm
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
