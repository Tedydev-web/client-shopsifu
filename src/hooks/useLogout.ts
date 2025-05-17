import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux'; // Thêm useSelector để lấy state từ Redux
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

  // Lấy token từ Redux state
  const { refreshToken } = useSelector((state: any) => state.authShopsifu); 

  const handleLogout = async () => {
    try {
      setLoading(true);

      // Gọi API logout và truyền token vào header và body
      await authService.logout(refreshToken); // Gửi token vào yêu cầu logout

      // Xoá token local
      removeToken();

      // Cập nhật Redux
      dispatch(logOut());

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
