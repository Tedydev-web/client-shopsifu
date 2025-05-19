import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { otpSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { ROUTES } from '@/constants/route'
import { parseApiError } from '@/utils/error'

const SESSION_TOKEN_KEY = 'loginSessionToken'
const USER_EMAIL_KEY = 'userEmail'

export function useVerify2FA() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') as 'TOTP' | 'OTP' || 'TOTP'
  
  const verify2FA = async (code: string) => {
    const loginSessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY)
    if (!loginSessionToken) {
      showToast('Không tìm thấy phiên đăng nhập, vui lòng thử lại', 'error')
      router.replace(ROUTES.BUYER.SIGNIN)
      return
    }

    try {
      setLoading(true)
      await authService.verify2fa({
        loginSessionToken,
        type,
        code
      })
      
      sessionStorage.removeItem(SESSION_TOKEN_KEY)
      sessionStorage.removeItem(USER_EMAIL_KEY)
      
      showToast('Xác minh 2FA thành công', 'success')
      router.replace(ROUTES.ADMIN.DASHBOARD)
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  const sendOTP = async () => {
    const loginSessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY)
    const userEmail = sessionStorage.getItem(USER_EMAIL_KEY)
    
    if (!loginSessionToken || !userEmail) {
      showToast('Không tìm thấy phiên đăng nhập, vui lòng thử lại', 'error')
      router.replace(ROUTES.BUYER.SIGNIN)
      return
    }

    try {
      setLoading(true)
      await authService.sendOTP({
        email: userEmail,
        type: 'LOGIN'
      })
      showToast('Đã gửi mã OTP đến email của bạn', 'success')
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (data: z.infer<typeof otpSchema>) => {
    await verify2FA(data.otp)
  }

  return { loading, handleVerifyCode, sendOTP }
}
