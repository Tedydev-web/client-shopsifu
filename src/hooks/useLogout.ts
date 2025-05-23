import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { removeToken } from '@/lib/auth';
import { showToast } from '@/components/ui/toastify';
import { ROUTES } from '@/constants/route';
import { logOut } from '@/store/features/auth/authSlide';
import { AppDispatch } from '@/store/store';
import { authService } from '@/services/authService';

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      setLoading(true);

      // Gọi API logout
      await authService.logout({
      });

      // Xoá token local
      removeToken();

      // Cập nhật Redux
      dispatch(logOut());

      // Lấy CSRF token mới
      await authService.getCsrfToken();

      // Hiển thị thông báo
      showToast('Đăng xuất thành công!', 'success');

      // Điều hướng
      router.push(ROUTES.BUYER.SIGNIN);
    } catch (error) {
      console.error('Logout failed:', error);
      showToast('Đăng xuất thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout, loading };
}
