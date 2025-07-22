'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useCart as useCartHook } from '@/components/client/cart/hooks/use-Cart';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const cartHook = useCartHook({ autoFetch: true });
  
  // Lấy các function từ cartHook
  const { 
    addToCart: originalAddToCart, 
    fetchCart: originalFetchCart,
    updateCartItem: originalUpdateCartItem,
    removeItems: originalRemoveItems,
    selectAllItems: originalSelectAllItems,
    ...rest 
  } = cartHook;
  
  // Override addToCart để cập nhật lastUpdated
  const addToCart = useCallback(async (data: any, showNotification: boolean = true) => {
    const result = await originalAddToCart(data, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalAddToCart]);
  
  // Override fetchCart để có thể refresh khi cần
  const fetchCart = useCallback(async (params?: string) => {
    const result = await originalFetchCart(params);
    setLastUpdated(Date.now());
    return result;
  }, [originalFetchCart]);
  
  // Override updateCartItem để cập nhật lastUpdated
  const updateCartItem = useCallback(async (itemId: string, data: any, showNotification: boolean = false) => {
    const result = await originalUpdateCartItem(itemId, data, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalUpdateCartItem]);
  
  // Override removeItems để cập nhật lastUpdated
  const removeItems = useCallback(async (cartItemIds: string[], showNotification: boolean = true) => {
    const result = await originalRemoveItems(cartItemIds, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalRemoveItems]);
  
  // Override selectAllItems để cập nhật lastUpdated
  const selectAllItems = useCallback(async (isSelected: boolean, showNotification: boolean = false) => {
    const result = await originalSelectAllItems(isSelected, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalSelectAllItems]);
  
  // Hàm force refresh cart
  const forceRefresh = useCallback(async () => {
    await originalFetchCart();
    setLastUpdated(Date.now());
  }, [originalFetchCart]);
  
  return (
    <CartContext.Provider value={{
      ...rest,
      addToCart,
      fetchCart,
      updateCartItem,
      removeItems,
      selectAllItems,
      lastUpdated,
      forceRefresh
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};