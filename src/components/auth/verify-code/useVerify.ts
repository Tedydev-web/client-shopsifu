import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { otpSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { VerifyOTPRequest } from '@/types/auth.interface'
import { ErrorResponse } from '@/types/base.interface'
import { ROUTES } from '@/constants/route'
import { AxiosError } from 'axios'

const RESET_PASSWORD_TOKEN_KEY = 'reset_password_token'

export function useVerify() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const verifyOTP = async (otp: string) => {
    if (!email) {
      toast.error('Không tìm thấy email, vui lòng thử lại')
      router.replace(ROUTES.BUYER.FORGOT_PASSWORD)
      return
    }

    try {
      setLoading(true)
      const request: VerifyOTPRequest = {
        email,
        code: otp,
        type: 'FORGOT_PASSWORD'
      }

      const response = await authService.verifyOTP(request)
      
      // Lưu token vào sessionStorage
      if (response.token) {
        sessionStorage.setItem(RESET_PASSWORD_TOKEN_KEY, response.token)
        toast.success('Xác thực thành công')
        router.replace(ROUTES.BUYER.RESET_PASSWORD)
      } else {
        throw new Error('Token không hợp lệ')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const err: ErrorResponse = error.response?.data
        const firstMessage = err?.message?.[0]?.message

        switch (firstMessage) {
          case 'Error.InvalidOTP':
            toast.error('Mã OTP không chính xác')
            break
          case 'Error.OTPExpired':
            toast.error('Mã OTP đã hết hạn')
            break
          default:
            toast.error(firstMessage || 'Có lỗi xảy ra. Vui lòng thử lại sau.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    if (!email) {
      toast.error('Không tìm thấy email, vui lòng thử lại')
      router.replace(ROUTES.BUYER.FORGOT_PASSWORD)
      return
    }

    try {
      setLoading(true)
      await authService.sendOTP({
        email,
        type: 'FORGOT_PASSWORD'
      })
      toast.success('Đã gửi lại mã OTP mới')
    } catch (error) {
      const err = error as ErrorResponse
      const firstMessage = err?.message?.[0]?.message
      toast.error(firstMessage || 'Có lỗi xảy ra khi gửi lại mã OTP')
      console.error('Resend OTP error:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    await verifyOTP(data.otp)
  }

  return { loading, onSubmit, resendOTP }
}
