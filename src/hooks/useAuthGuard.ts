import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ROUTES } from '@/constants/route';
import { showToast } from '@/components/ui/toastify';

interface UseAuthGuardOptions {
  redirectTo?: string;
  showToastMessage?: boolean;
  silentCheck?: boolean;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const {
    redirectTo = ROUTES.BUYER.SIGNIN,
    showToastMessage = true,
    silentCheck = false
  } = options;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Kiểm tra authentication
  const checkAuth = () => {
    try {
      const accessToken = Cookies.get('access_token');
      const isAuthed = !!accessToken;
      setIsAuthenticated(isAuthed);
      setIsLoading(false);
      return isAuthed;
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Hàm wrapper để bảo vệ API calls
  const withAuth = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: { showError?: boolean } = {}
  ): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
    return async (...args: Parameters<T>) => {
      const isAuthed = checkAuth();
      
      if (!isAuthed) {
        if (options.showError !== false && showToastMessage) {
          showToast('Vui lòng đăng nhập để tiếp tục', 'error');
        }
        throw new Error('UNAUTHORIZED');
      }
      
      try {
        return await fn(...args);
      } catch (error: any) {
        // Xử lý các lỗi liên quan đến authentication
        if (error?.response?.status === 401) {
          if (options.showError !== false && showToastMessage) {
            showToast('Phiên đăng nhập đã hết hạn', 'error');
          }
          throw new Error('SESSION_EXPIRED');
        }
        throw error;
      }
    };
  };

  // Hàm kiểm tra nhanh trạng thái đăng nhập
  const requireAuth = () => {
    const isAuthed = checkAuth();
    if (!isAuthed && showToastMessage) {
      showToast('Vui lòng đăng nhập để tiếp tục', 'error');
    }
    return isAuthed;
  };

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    withAuth,
    requireAuth
  };
}; 