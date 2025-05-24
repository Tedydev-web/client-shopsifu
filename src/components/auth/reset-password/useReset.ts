import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { resetPasswordSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { ResetPasswordRequest } from '@/types/auth.interface'
import { ROUTES } from '@/constants/route'
import { parseApiError } from '@/utils/error'

const RESET_PASSWORD_TOKEN_KEY = 'token_verify_code'

export function useReset() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleResetPassword = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem(RESET_PASSWORD_TOKEN_KEY)
      const email = searchParams.get('email')
      if (!token) {
        showToast('Phiên làm việc đã hết hạn', 'info')
        router.replace(ROUTES.BUYER.RESET_PASSWORD)
        return
      }

      setLoading(true)
      const resetData: ResetPasswordRequest = {
        email: email || '',
        otpToken: token,
        newPassword: data.password,
        confirmNewPassword: data.confirmPassword
      }

      await authService.resetPassword(resetData)

      // Xóa token sau khi đổi mật khẩu thành công
      localStorage.removeItem(RESET_PASSWORD_TOKEN_KEY)
      
      showToast('Đổi mật khẩu thành công!', 'success')
      router.replace(ROUTES.BUYER.SIGNIN)
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  return { loading, handleResetPassword }
}
