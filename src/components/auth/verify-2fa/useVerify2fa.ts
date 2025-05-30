import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { otpSchema, recoveryCodeSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { ROUTES } from '@/constants/route'
import { parseApiError } from '@/utils/error'
import { Verify2faResponse } from '@/types/auth.interface'

const SESSION_TOKEN_KEY = 'loginSessionToken'
const USER_EMAIL_KEY = 'userEmail'
const TRUST_DEVICE_KEY = 'askToTrustDevice'

type TwoFactorType = 'TOTP' | 'OTP' | 'RECOVERY'

export function useVerify2FA() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = (searchParams.get('type') as TwoFactorType) || 'TOTP'
  
  const verify2FA = async (code: string) => {
    try {
      setLoading(true)
      const response = await authService.verify2fa({
        code,
      }) as Verify2faResponse
      
      if (response.isDeviceTrustedInSession) {
        sessionStorage.setItem(TRUST_DEVICE_KEY, response.isDeviceTrustedInSession)
      }
      
      showToast('Xác minh 2FA thành công', 'success')
      window.location.href = ROUTES.ADMIN.DASHBOARD
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  // const sendOTP = async () => {
  //   const userEmail = sessionStorage.getItem(USER_EMAIL_KEY)
  

  //   try {
  //     setLoading(true)
  //     await authService.sendOTP({
  //       email: userEmail,
  //       type: 'LOGIN'
  //     })
  //     showToast('Đã gửi mã OTP đến email của bạn', 'success')
  //   } catch (error) {
  //     showToast(parseApiError(error), 'error')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleVerifyCode = async (data: { otp: string }) => {

    try {
      // Validate based on type
      if (type === 'RECOVERY') {
        const result = recoveryCodeSchema.safeParse(data);
        if (!result.success) {
          throw result.error;
        }
      } else {
        otpSchema.parse(data);
      }
      await verify2FA(data.otp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('Zod error:', error.errors);
        showToast(error.errors[0].message, 'error');
      } else {
        showToast(parseApiError(error), 'error');
      }
    }
  }

  const switchToRecovery = () => {
    router.replace(`?type=RECOVERY`)
  }

  return { 
    loading, 
    handleVerifyCode, 
    // sendOTP, 
    type, 
    switchToRecovery,
    schema: type === 'RECOVERY' ? recoveryCodeSchema : otpSchema 
  }
}
