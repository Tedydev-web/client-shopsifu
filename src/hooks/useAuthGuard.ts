import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { ROUTES } from '@/constants/route';
import { showToast } from '@/components/ui/toastify';
import { useUserData } from './useGetData-UserLogin'; // Import hook lấy data từ Redux

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

  // 1. Gọi hook useUserData ở cấp cao nhất
  const userData = useUserData();

  // 2. Định nghĩa lại hàm checkAuth để sử dụng cả cookie và data từ Redux
  const checkAuth = useCallback(() => {
    try {
      const accessToken = Cookies.get('access_token');
      const hasToken = !!accessToken;
      const hasReduxData = !!userData; // userData sẽ là null nếu không có dữ liệu

      // Điều kiện: có token HOẶC có dữ liệu trong Redux
      const isAuthed = hasToken || hasReduxData;

      setIsAuthenticated(isAuthed);
      setIsLoading(false);
      return isAuthed;
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  }, [userData]); // Phụ thuộc vào userData, sẽ chạy lại khi user đăng nhập/đăng xuất

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Hàm wrapper để bảo vệ API calls
  const withAuth = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: { showError?: boolean } = {}
  ): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
    return async (...args: Parameters<T>) => {
      // Gọi lại checkAuth để có được trạng thái mới nhất
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
          // TODO: Cần dispatch action để clear Redux state tại đây
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
      // Có thể thêm logic redirect ở đây nếu cần
    }
    return isAuthed;
  };

  return { isAuthenticated, isLoading, withAuth, requireAuth, checkAuth };
};