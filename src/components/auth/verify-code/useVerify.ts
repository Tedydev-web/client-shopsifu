import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { otpSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { VerifyOTPRequest } from '@/types/auth.interface'
import { ROUTES } from '@/constants/route'
import { parseApiError } from '@/utils/error'
import { useTranslation } from 'react-i18next'

const TOKEN_KEY = 'token_verify_code'

type ActionType = 'signup' | 'forgot'

export function useVerify() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const action = (searchParams.get('action') as ActionType) || 'signup'

  const {t} = useTranslation()
  const otp = otpSchema(t)

  const verifyOTP = async (otp: string) => {
    if (!email) {
      showToast(t('admin.showToast.auth.emailNotFound'), 'error')
      router.replace(action === 'signup' ? ROUTES.BUYER.SIGNUP : ROUTES.BUYER.RESET_PASSWORD)
      return
    }

    try {
      setLoading(true)
      const request: VerifyOTPRequest = {
        email,
        code: otp,
        type: action === 'signup' ? 'REGISTER' : 'RESET_PASSWORD'
      }

      const response = await authService.verifyOTP(request)
      
      if (response.otpToken) {
        localStorage.setItem(TOKEN_KEY, response.otpToken)
        showToast(t('admin.showToast.auth.authSuccessful'), 'success')
        
        if (action === 'forgot') {
          router.replace(`${ROUTES.BUYER.RESET_PASSWORD}?email=${encodeURIComponent(email)}`)
        } else {
          router.replace(`${ROUTES.BUYER.SIGNUP}?email=${encodeURIComponent(email)}`)
        }
      } else {
        throw new Error(t('admin.showToast.auth.invalidToken'))
      }
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    if (!email) {
      showToast(t('admin.showToast.auth.emailNotFound'), 'error')
      router.replace(action === 'signup' ? ROUTES.BUYER.SIGNUP : ROUTES.BUYER.RESET_PASSWORD)
      return
    }

    try {
      setLoading(true)
      await authService.sendOTP({
        email,
        type: action === 'signup' ? 'REGISTER' : 'RESET_PASSWORD'
      })
      showToast(t('admin.showToast.auth.sentNewOtp'), 'success')
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (data: z.infer<typeof otp>) => {
    await verifyOTP(data.otp)
  }

  return { loading, handleVerifyCode, resendOTP, action }
}
