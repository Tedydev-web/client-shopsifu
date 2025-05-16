import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { otpSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { ROUTES } from '@/constants/route'
import { parseApiError } from '@/utils/error'
import { AppDispatch } from '@/store/store'
import { setCredentials } from '@/store/features/auth/authSlide'
import { useDispatch } from 'react-redux'

const SESSION_TOKEN_KEY = 'loginSessionToken'

export function useVerify2FA() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') as 'TOTP' | 'OTP' || 'TOTP'
  const dispatch = useDispatch<AppDispatch>()
  
  const verify2FA = async (code: string) => {
    const loginSessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY)
    if (!loginSessionToken) {
      showToast('Không tìm thấy phiên đăng nhập, vui lòng thử lại', 'error')
      router.replace(ROUTES.BUYER.SIGNIN)
      return
    }

    try {
      setLoading(true)
      const response = await authService.verify2fa({
        loginSessionToken,
        type,
        code
      })
      if (response.accessToken && response.refreshToken) {
        dispatch(setCredentials({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        }))

        showToast('Xác minh 2FA thành công', 'success')
        router.replace(ROUTES.ADMIN.DASHBOARD)
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
    const loginSessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY)
    if (!loginSessionToken) {
      showToast('Không tìm thấy phiên đăng nhập, vui lòng thử lại', 'error')
      router.replace(ROUTES.BUYER.SIGNIN)
      return
    }

    try {
      setLoading(true)
      await authService.sendOTP({
        email: loginSessionToken, // Giả sử loginSessionToken chứa email
        type: '2FA'
      })
      showToast('Đã gửi lại mã OTP mới', 'success')
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (data: z.infer<typeof otpSchema>) => {
    await verify2FA(data.otp)
  }

  return { loading, handleVerifyCode, resendOTP }
}
