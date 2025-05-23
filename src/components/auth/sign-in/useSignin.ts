import { useState } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { LoginSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { ROUTES } from '@/constants/route'
import { showToast } from '@/components/ui/toastify'
import { setCredentials } from '@/store/features/auth/authSlide'
import { AppDispatch } from '@/store/store'
import { parseApiError } from '@/utils/error'

export function useSignin() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleSignin = async (data: z.infer<typeof LoginSchema>) => {
    try {
      setLoading(true);
      const response = await authService.login(data);

      // Kiểm tra nếu có loginSessionTokesn - đây là tài khoản 2FA
      if (response.loginSessionToken) {
        // Lưu loginSessionToken vào sessionStorage
        sessionStorage.setItem('loginSessionToken', response.loginSessionToken);
        sessionStorage.setItem('userEmail', data.email); // Lưu email
        // Chuyển hướng đến trang verify 2FA với phương thức xác thực
        router.push(`${ROUTES.BUYER.VERIFY_2FA}?type=${response.twoFactorMethod}`);
        return;
      }

      // Nếu không phải 2FA, xử lý đăng nhập bình thường
      dispatch(setCredentials({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      }))
      
      showToast('Đăng nhập thành công!', 'success')
      router.push(ROUTES.ADMIN.DASHBOARD)
    } catch (error: any) {
      console.error('Login error:', error)
      showToast(parseApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return { handleSignin, loading }
}