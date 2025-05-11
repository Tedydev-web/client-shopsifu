import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { resetPasswordSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { ResetPasswordRequest } from '@/types/auth.interface'
import { ErrorResponse } from '@/types/base.interface'
import { ROUTES } from '@/constants/route'
import { AxiosError } from 'axios'

const RESET_PASSWORD_TOKEN_KEY = 'reset_password_token'

export function useReset() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      // Lấy token từ sessionStorage
      const token = sessionStorage.getItem(RESET_PASSWORD_TOKEN_KEY)
      
      if (!token) {
        toast.error('Phiên làm việc đã hết hạn')
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
      sessionStorage.removeItem(RESET_PASSWORD_TOKEN_KEY)
      
      toast.success('Đổi mật khẩu thành công!')
      router.replace(ROUTES.BUYER.SIGNIN)
    } catch (error) {
      if (error instanceof AxiosError) {
        const err: ErrorResponse = error.response?.data
        const firstMessage = err?.message?.[0]?.message

        switch (firstMessage) {
          case 'Error.InvalidToken':
            toast.error('Token không hợp lệ hoặc đã hết hạn')
            router.replace(ROUTES.BUYER.FORGOT_PASSWORD)
            break
          case 'Error.InvalidPassword':
            toast.error('Mật khẩu không hợp lệ')
            break
          case 'Error.PasswordMismatch':
            toast.error('Mật khẩu không khớp')
            break
          default:
            toast.error(firstMessage || 'Có lỗi xảy ra. Vui lòng thử lại sau.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return { loading, handleResetPassword }
}
