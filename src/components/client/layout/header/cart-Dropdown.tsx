'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'; // Remove DropdownMenu import
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'; // Import useState if needed for future state

export function CartDropdown() {
  // Placeholder data for cart items
  const cartItems = [
    {
      id: 1,
      name: '[BH Trọn Đời] Dây Chuyền Bạc S9...',
      price: '395.000',
      image: '/images/demo/1.webp', // Replace with actual image path
    },
    {
      id: 2,
      name: 'Tinh Dầu Xịt Thơm White Tea & Fig ...',
      price: '49.000',
      image: '/images/demo/2.webp', // Using a different placeholder image
    },
     {
      id: 3,
      name: 'Đèn Treo Màn Hình Máy Tính Lym...',
      price: '339.000',
      image: '/images/demo/3.webp', // Using a different placeholder image
    },
     {
      id: 4,
      name: '[HÀNG IN ĐẸP] Móc khóa yêu nướ...',
      price: '19.000',
      image: '/images/demo/4.webp', // Using a different placeholder image
    },
     {
      id: 5,
      name: 'Giá đỡ Laptop chân xoay 360 độ, ...',
      price: '219.000',
      image: '/images/demo/5.webp', // Using a different placeholder image
    },
  ];

  return (
    <div className="relative group">
      {/* Cart Button - serves as the hover trigger */}
      <Button variant="ghost" size="icon" className="relative text-white hover:bg-gray-100 h-12 w-12">
        <ShoppingCart className="h-7 w-7 text-white hover:text-red-500" />
        {/* Placeholder for item count badge */}
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-white text-red-500 text-xs font-bold">
          {cartItems.length}{/* Replace with actual cart item count */}
        </span>
      </Button>

      {/* Dropdown Content */}
      <div className="absolute top-full right-0 mt-1 hidden group-hover:block w-[500px] p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-700 z-10">
        <div className="text-sm font-medium mb-3">Sản Phẩm Mới Thêm</div>
        <div className="space-y-2 max-h-[350px] overflow-y-auto mb-4 pr-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-sm transition-colors duration-150 cursor-pointer">
              <Image src={item.image} alt={item.name} width={40} height={40} className="object-cover rounded" />
              <div className="flex-1 text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                {item.name}
              </div>
              <div className="text-xs text-red-500 font-semibold flex-shrink-0">
                ₫{item.price}
              </div>
            </div>
          ))}
        </div>
          <Link href="/cart" passHref>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2">
              Xem Giỏ Hàng
            </Button>
          </Link>
        </div>
    </div>
  );
}
