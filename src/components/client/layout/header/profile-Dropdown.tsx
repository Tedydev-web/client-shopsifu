'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, LogOut, ChevronDown, ShoppingCart  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useLogout } from '@/hooks/useLogout';
import { useRouter } from 'next/navigation';

export function ProfileDropdown() {
  const name = "Nguyen Phat";
  const email = "nguyendangphat1312@gmail.com";
  const { handleLogout, loading: logoutLoading } = useLogout();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto px-2 py-1 flex items-center gap-1 text-white opacity-80 g-none hover:bg-none hover:underline transition-opacity text-[11px]">
           <User className="h-3.5 w-3.5" />
           <span>{name}</span>
           <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-700 text-[11px] [&>button]:hover:bg-none [&>button]:hover:underline">
        <div className="flex items-center justify-center pt-4 pb-2 w-full">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold mr-3 flex-shrink-0">
              {name[0]}
          </div>
          <div className="flex flex-col max-w-[120px]">
              <div className="font-medium text-[11px] text-gray-900 truncate">{name}</div>
              <div className="text-[10px] text-gray-500 truncate">{email}</div>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-gray-200" />
        {/* Link to Profile Settings */}
        <DropdownMenuItem 
          className="hover:bg-none px-4 py-2 cursor-pointer"
          onClick={() => { router.push('/admin/settings/profile') }}
        >
          <User className="w-3.5 h-3.5 mr-2 text-gray-600" />
          Tài khoản của tôi
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-none px-4 py-2 cursor-pointer"
          onClick={() => { router.push('/admin/settings/profile') }}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-2 text-gray-600" />
          Đơn hàng mua
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem 
          className="hover:bg-none px-4 py-2 cursor-pointer"
          onClick={handleLogout} 
          disabled={logoutLoading}
        >
          <LogOut className="w-3.5 h-3.5 mr-2 text-gray-600" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
