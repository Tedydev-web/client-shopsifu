import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { otpSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { toast } from 'react-hot-toast'
import { VerifyOTPRequest } from '@/types/auth.interface'

interface ErrorResponse {
  message?: Array<{ message: string }>
}

export function useVerify() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const verifyOTP = async (otp: string) => {
    if (!email) {
      toast.error('Không tìm thấy email, vui lòng thử lại')
      router.replace('/buyer/forgot-password')
      return
    }

    try {
      setLoading(true)
      const request: VerifyOTPRequest = {
        email,
        code: otp,
        type: 'FORGOT_PASSWORD'
      }
      console.log('Sending verify request:', request) // Debug log
      await authService.verifyOTP(request)
      toast.success('Xác thực thành công')
      router.replace(`/buyer/reset-password?email=${encodeURIComponent(email)}`)
    } catch (error) {
      const err = error as ErrorResponse
      const firstMessage = err?.message?.[0]?.message
      console.error('Full error response:', error) // Debug log
      
      // Hiển thị thông báo lỗi dễ hiểu cho người dùng
      switch (firstMessage) {
        case 'Error.InvalidOTP':
          toast.error('Mã OTP không chính xác')
          break
        case 'Error.OTPExpired':
          toast.error('Mã OTP đã hết hạn')
          break
        case 'Error.TooManyAttempts':
          toast.error('Bạn đã thử quá nhiều lần. Vui lòng thử lại sau')
          break
        default:
          toast.error('Có lỗi xảy ra khi xác thực OTP')
      }
      console.error('Verify OTP error:', error)
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    if (!email) {
      toast.error('Không tìm thấy email, vui lòng thử lại')
      router.replace('/buyer/forgot-password')
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
