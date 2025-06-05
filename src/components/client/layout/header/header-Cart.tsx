'use client';

import { ShoppingCart } from 'lucide-react';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { cartItems } from './header-MockData';
import { useDropdown } from './dropdown-context';

export function CartDropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openDropdown, setOpenDropdown } = useDropdown();
  
  const isOpen = openDropdown === 'cart';
  
  return (
    <div 
      className="relative group cart-container" 
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <div 
        className="cursor-pointer relative whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-3"
        onClick={() => setOpenDropdown(isOpen ? 'none' : 'cart')}
        onMouseEnter={() => setOpenDropdown('cart')}
      >
        {/* Backdrop blur effect */}
        <motion.div
          className="absolute inset-0 rounded-full backdrop-blur-sm"
          initial={{ 
            backgroundColor: "rgba(233, 233, 233, 0)", 
            scaleX: 0.5,
            scaleY: 0.8
          }}
          animate={{
            backgroundColor: isOpen ? "rgba(233, 233, 233, 0.4)" : "rgba(233, 233, 233, 0)", 
            boxShadow: isOpen
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              : "none",
            scaleX: isOpen ? 1 : 0.5,
            scaleY: isOpen ? 1 : 0.8
          }}
          whileHover={{
            backgroundColor: "rgba(233, 233, 233, 0.4)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            scaleX: [0.8, 1.1, 1], 
            scaleY: [0.9, 1.05, 1],
          }}
          transition={{
            type: "spring",
            stiffness: 350, 
            damping: 12, 
            backgroundColor: { duration: 0.15 }, 
            boxShadow: { duration: 0.15 }, 
            scaleX: { duration: 0.35, ease: "easeOut" }, 
            scaleY: { duration: 0.25, ease: "easeOut" },
          }}
        />
        
        {/* Content layer */}       
        <div className="relative z-10">
          <ShoppingCart className="w-6 h-6 text-white" />
          {/* Item count badge */}
          <span className="absolute -top-1 -right-4 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold">
            {cartItems.length}
          </span>
        </div>
      </div>
      
      {/* Invisible gap to prevent dropdown from closing when moving cursor to dropdown */}
      <div className="absolute h-3 w-full top-full"></div>
      
      {/* Dropdown Menu */}
      <motion.div
        className={cn(
          "absolute top-[calc(100%+3px)] right-0 w-[300px] sm:w-[400px] md:w-[500px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onMouseEnter={() => setOpenDropdown('cart')}
        onMouseLeave={() => setOpenDropdown('none')}
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : -10,
          transition: {
            duration: 0.2,
            ease: "easeOut"
          }
        }}
      >
        {/* Bubble arrow pointing to the cart icon */}
        <div className="absolute right-4 top-[-7px] w-3 h-3 bg-white transform rotate-45 border-t border-l border-gray-200 z-1"></div>
        
        {/* Cart Header */}
        <div className="px-4 py-6">
          <h3 className="text-[16px] font-medium text-gray-800">Sản Phẩm Mới Thêm ({cartItems.length})</h3>
        </div>
        
        {/* Cart Items */}
        <div className="max-h-[350px] overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <motion.div 
                key={item.id} 
                className="relative cursor-pointer"
                whileHover={{ backgroundColor: "rgba(240, 240, 240, 0.8)" }}
              >
                <div className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative overflow-hidden rounded border border-gray-100">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        layout="fill" 
                        objectFit="cover" 
                        className="transition-transform duration-300" 
                      />
                    </div>
                    <div className="flex-1 text-sm overflow-hidden">
                      <p className="text-gray-800 font-medium truncate">{item.name}</p>
                      {/* <p className="text-xs text-gray-500 mt-0.5">Loại: {item.category}</p> */}
                    </div>
                    <div className="text-sm font-semibold text-red-600">
                      ₫{item.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-8 px-4 text-center">
              <div className="w-16 h-16 mx-auto mb-3 opacity-30">
                <ShoppingCart className="w-full h-full text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">Giỏ hàng của bạn đang trống</p>
            </div>
          )}
        </div>
        
        {/* Cart Footer */}
        <div className="p-4 border-t border-gray-100">
          <Link 
            href="/cart" 
            className="flex items-center justify-center w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium p-3 rounded-lg transition-colors duration-200"
            onClick={() => setOpenDropdown('none')}
          >
            <span>Xem Giỏ Hàng</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
