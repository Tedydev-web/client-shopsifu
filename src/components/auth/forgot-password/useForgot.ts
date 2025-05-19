import { showToast } from '@/components/ui/toastify';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { ForgotPasswordSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { SendOTPRequest } from '@/types/auth.interface'
import { parseApiError } from '@/utils/error'

interface ErrorResponse {
  message?: Array<{ message: string }>
}

export function useForgotPassword() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

    const handleSendOTP = async (email: string) => {
    try {
      setLoading(true)
      const request: SendOTPRequest = {
        email,
        type: 'FORGOT_PASSWORD'
      }
      await authService.sendOTP(request)
      showToast('Mã xác thực đã được gửi đến email của bạn', 'success')
      router.replace(`/buyer/verify-code?email=${encodeURIComponent(email)}`)
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Chi tiết lỗi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    await handleSendOTP(data.email)
  }

  return { loading, handleForgotPassword }
}
