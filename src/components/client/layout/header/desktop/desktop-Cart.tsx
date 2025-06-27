'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cartItems as mockCartItems } from './desktop-Mockdata';

// Define the structure for a cart item, now with a 'selected' state
interface CartItem {
  id: number;
  name: string;
  price: string; // Keep as string from mock
  image: string;
  quantity: number;
  selected: boolean;
}

// Utility to parse price string (e.g., "395.000") into a number
const parsePrice = (price: string): number => {
  return parseInt(price.replace(/\./g, ''), 10);
};

export function CartDropdown() {
  // Initialize state from mock data, adding quantity and selected status
  const [cart, setCart] = useState<CartItem[]>(
    mockCartItems.map(item => ({ ...item, quantity: 1, selected: true }))
  );

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  };

  const handleToggleSelect = (id: number) => {
    setCart(currentCart =>
      currentCart.map(item => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleToggleSelectAll = (checked: boolean | 'indeterminate') => {
    const isSelected = checked === true;
    setCart(currentCart => currentCart.map(item => ({ ...item, selected: isSelected })));
  };

  const calculateTotal = () => {
    return cart
      .filter(item => item.selected)
      .reduce((total, item) => {
        const price = parsePrice(item.price);
        return total + price * item.quantity;
      }, 0);
  };

  const allItemsSelected = cart.length > 0 && cart.every(item => item.selected);
  const isIndeterminate = cart.some(item => item.selected) && !allItemsSelected;
  const noItemsSelected = cart.every(item => !item.selected);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="rounded-full cursor-pointer relative whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-3">
          <ShoppingCart className="h-6 w-6 text-white" strokeWidth={1}/>
          {cart.length > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-red-600">
              {cart.reduce((count, item) => count + item.quantity, 0)}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md p-0 flex flex-col rounded-md">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <SheetTitle className="text-lg font-semibold text-gray-900 mb-1">Giỏ hàng của bạn</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 pl-4 border-b border-gray-200 bg-gray-50">
                <label htmlFor="select-all" className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                        id="select-all"
                        checked={isIndeterminate ? 'indeterminate' : allItemsSelected}
                        onCheckedChange={handleToggleSelectAll}
                    />
                    <span className="text-sm font-medium">Chọn tất cả ({cart.length} sản phẩm)</span>
                </label>
            </div>
            <div className="divide-y divide-gray-200">
              {cart.map(item => (
                <div key={item.id} className="flex items-center p-4">
                  <Checkbox
                    id={`select-item-${item.id}`}
                    checked={item.selected}
                    onCheckedChange={() => handleToggleSelect(item.id)}
                  />
                  <label htmlFor={`select-item-${item.id}`} className="flex items-center ml-4 cursor-pointer">
                    <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md object-cover" />
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-red-600 font-semibold mt-1">{item.price}₫</p>
                      <div className="flex items-center mt-2">
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </label>
                  {/* <Button variant="ghost" size="icon" className="ml-4 text-gray-400 hover:text-red-500" onClick={() => handleRemoveItem(item.id)}>
                    <Trash2 className="h-5 w-5" />
                  </Button> */}
                </div>
              ))}
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <SheetFooter className="p-6 border-t border-gray-200">
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-md font-semibold text-gray-800">Tổng cộng</span>
                <span className="text-xl font-bold text-red-600">{calculateTotal().toLocaleString('vi-VN')}₫</span>
              </div>
              <Button size="lg" className="w-full bg-red-600 hover:bg-red-700" disabled={noItemsSelected}>
                Thanh toán
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                <Link href="/cart" className="flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Xem giỏ hàng</span>
                </Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}