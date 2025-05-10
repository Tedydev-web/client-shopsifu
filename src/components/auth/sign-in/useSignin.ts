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

export function useSignin() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handlesignin = async (data: z.infer<typeof LoginSchema>) => {
    try {
      setLoading(true)
      const response = await authService.login(data)
      
      // Lưu token vào Redux store
      dispatch(setCredentials({
        token: response.accessToken,
        refreshToken: response.refreshToken
      }))
      
      showToast('Đăng nhập thành công!', 'success')
      router.push(ROUTES.ADMIN.DASHBOARD)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại'
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return { handlesignin, loading }
}