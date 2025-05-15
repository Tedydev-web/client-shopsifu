import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { otpSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { VerifyOTPRequest } from '@/types/auth.interface'
import { ROUTES } from '@/constants/route'
import { parseApiError } from '@/utils/error'


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
      
      if (response.otpToken) {
        localStorage.setItem(TOKEN_KEY, response.otpToken)
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
      showToast(parseApiError(error), 'error')
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
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (data: z.infer<typeof otpSchema>) => {
    await verifyOTP(data.otp)
  }

  return { loading, handleVerifyCode, resendOTP, action }
}
