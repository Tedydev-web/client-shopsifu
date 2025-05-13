import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { resetPasswordSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { ResetPasswordRequest } from '@/types/auth.interface'
import { ErrorResponse } from '@/types/base.interface'
import { ROUTES } from '@/constants/route'
import { AxiosError } from 'axios'

const RESET_PASSWORD_TOKEN_KEY = 'token_verify_code'

export function useReset() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleResetPassword = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      // Lấy token từ sessionStorage
      const token = localStorage.getItem(RESET_PASSWORD_TOKEN_KEY)
      
      if (!token) {
        showToast('Phiên làm việc đã hết hạn', 'info')
        router.replace(ROUTES.BUYER.FORGOT_PASSWORD)
        return
      }

      setLoading(true)
      const resetData: ResetPasswordRequest = {
        token,
        newPassword: data.password,
        confirmNewPassword: data.confirmPassword
      }

      await authService.resetPassword(resetData)

      // Xóa token sau khi đổi mật khẩu thành công
      localStorage.removeItem(RESET_PASSWORD_TOKEN_KEY)
      
      showToast('Đổi mật khẩu thành công!', 'success')
      router.replace(ROUTES.BUYER.SIGNIN)
    } catch (error) {
      if (error instanceof AxiosError) {
        const err: ErrorResponse = error.response?.data
        const firstMessage = err?.message?.[0]?.message

        switch (firstMessage) {
          case 'Error.InvalidToken':
            showToast('Token không hợp lệ hoặc đã hết hạn', 'error')
            router.replace(ROUTES.BUYER.FORGOT_PASSWORD)
            break
          case 'Error.InvalidPassword':
            showToast('Mật khẩu không hợp lệ', 'error')
            break
          case 'Error.PasswordMismatch':
            showToast('Mật khẩu không khớp', 'error')
            break
          default:
            showToast(firstMessage || 'Có lỗi xảy ra. Vui lòng thử lại sau.', 'error')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return { loading, handleResetPassword }
}
