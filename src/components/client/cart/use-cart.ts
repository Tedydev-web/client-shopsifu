'use client';

import { useEffect, useState } from 'react';
import { showToast } from '@/components/ui/toastify';
import { cartService } from '@/services/cartService';
import { Cart, CartItem, CartItemRequest, UpdateCartItemRequest } from '@/types/cart.interface';

/**
 * Custom hook để xử lý logic giỏ hàng
 */
export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Lấy thông tin giỏ hàng khi component được mount
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin giỏ hàng. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (data: CartItemRequest) => {
    try {
      setIsUpdating(true);
      const response = await cartService.addToCart(data);
      setCart(response.data);
      toast({
        title: 'Thành công',
        description: 'Đã thêm sản phẩm vào giỏ hàng.',
      });
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartItem = async (itemId: string, data: UpdateCartItemRequest) => {
    try {
      setIsUpdating(true);
      const response = await cartService.updateCartItem(itemId, data);
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật sản phẩm. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItems = async (itemIds: string[]) => {
    try {
      setIsUpdating(true);
      const response = await cartService.deleteCartItems({ itemIds });
      setCart(response.data);
      toast({
        title: 'Thành công',
        description: 'Đã xóa sản phẩm khỏi giỏ hàng.',
      });
      return true;
    } catch (error) {
      console.error('Error removing items from cart:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa sản phẩm. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Chọn tất cả sản phẩm
  const selectAllItems = async (isSelected: boolean) => {
    try {
      setIsUpdating(true);
      const response = await cartService.selectAllItems(isSelected);
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error selecting all items:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái chọn. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Tính tổng tiền cho các sản phẩm đã chọn
  const calculateSelectedTotal = (): { items: number; price: number } => {
    if (!cart?.items?.length) {
      return { items: 0, price: 0 };
    }

    return cart.items.reduce(
      (acc, item) => {
        if (item.isSelected) {
          acc.items += item.quantity;
          acc.price += item.price * item.quantity;
        }
        return acc;
      },
      { items: 0, price: 0 }
    );
  };

  // Lấy thông tin giỏ hàng khi component được mount
  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    isLoading,
    isUpdating,
    fetchCart,
    addToCart,
    updateCartItem,
    removeItems,
    selectAllItems,
    calculateSelectedTotal,
  };
};
