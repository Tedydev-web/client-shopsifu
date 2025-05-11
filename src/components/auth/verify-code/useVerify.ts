import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { otpSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { VerifyOTPRequest } from '@/types/auth.interface'
import { ErrorResponse } from '@/types/base.interface'
import { ROUTES } from '@/constants/route'
import { AxiosError } from 'axios'

const TOKEN_KEY = 'token_verify_code'

type ActionType = 'signup' | 'forgot'

export function useVerify() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const action = (searchParams.get('action') as ActionType) || 'signup'

  const verifyOTP = async (otp: string) => {
    if (!email) {
      showToast('Không tìm thấy email, vui lòng thử lại', 'error')
      router.replace(action === 'signup' ? ROUTES.BUYER.SIGNUP : ROUTES.BUYER.FORGOT_PASSWORD)
      return
    }

    try {
      setLoading(true)
      const request: VerifyOTPRequest = {
        email,
        code: otp,
        type: action === 'signup' ? 'REGISTER' : 'FORGOT_PASSWORD'
      }

      const response = await authService.verifyOTP(request)
      
      if (response.token) {
        localStorage.setItem(TOKEN_KEY, response.token)
        showToast('Xác thực thành công', 'success')
        
        if (action === 'forgot') {
          router.replace(ROUTES.BUYER.RESET_PASSWORD)
        } else {
          router.replace(`${ROUTES.BUYER.SIGNUP}?email=${encodeURIComponent(email)}`)
        }
      } else {
        throw new Error('Token không hợp lệ')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const err: ErrorResponse = error.response?.data
        const firstMessage = err?.message?.[0]?.message

        switch (firstMessage) {
          case 'Error.InvalidOTP':
            showToast('Mã OTP không chính xác', 'error')
            break
          case 'Error.OTPExpired':
            showToast('Mã OTP đã hết hạn', 'error')
            break
          default:
            showToast(firstMessage || 'Có lỗi xảy ra. Vui lòng thử lại sau.', 'error')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    if (!email) {
      showToast('Không tìm thấy email, vui lòng thử lại', 'error')
      router.replace(action === 'signup' ? ROUTES.BUYER.SIGNUP : ROUTES.BUYER.FORGOT_PASSWORD)
      return
    }

    try {
      setLoading(true)
      await authService.sendOTP({
        email,
        type: action === 'signup' ? 'REGISTER' : 'FORGOT_PASSWORD'
      })
      showToast('Đã gửi lại mã OTP mới', 'success')
    } catch (error) {
      const err = error as ErrorResponse
      const firstMessage = err?.message?.[0]?.message
      showToast(firstMessage || 'Có lỗi xảy ra khi gửi lại mã OTP', 'error')
      console.error('Resend OTP error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (data: z.infer<typeof otpSchema>) => {
    await verifyOTP(data.otp)
  }

  return { loading, handleVerifyCode, resendOTP, action }
}
