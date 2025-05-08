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
import { ErrorResponse } from '@/types/base.interface'

export function useSignin() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      setLoading(true);
      const response = await authService.login(data);

      // Lưu token vào Redux
      dispatch(setCredentials({
        token: response.accessToken
      }));

      showToast('Đăng nhập thành công!', 'success');
      router.push(ROUTES.ADMIN.DASHBOARD); // hoặc '/buyer' tuỳ theo vai trò
    } catch (error: any) {
      let firstMessage = 'Đăng nhập thất bại'
      console.error('Login error:', error)

      // Đảm bảo error là object và có field message
      const errMsg = error?.response?.data?.message || error?.message;

      if (Array.isArray(errMsg)) {
        firstMessage = errMsg[0]?.message || firstMessage;
      } else if (typeof errMsg === 'string') {
        firstMessage = errMsg;
      }

      showToast(firstMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading }
}
