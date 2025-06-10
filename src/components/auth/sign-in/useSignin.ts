import { useState } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { LoginSchema } from '../schema/index'
import { authService } from '@/services/auth/authService'
import { ROUTES } from '@/constants/route'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import { useTranslation } from 'react-i18next'

export function useSignin() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {t} = useTranslation()
  const Schema = LoginSchema(t)  
  const handleSignin = async (data: z.infer<typeof Schema>) => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      // Check verificationType in the response
      if (response.status === 200) {
        if (response.data?.verificationType === 'OTP') {
          router.push(`${ROUTES.BUYER.VERIFY_2FA}?type=OTP`);
          showToast(response.data.message || t('auth.device.verification.required'), 'info');
          return;
        } else if (response.data?.verificationType === '2FA') {
          router.push(`${ROUTES.BUYER.VERIFY_2FA}?type=TOTP`);
          showToast(response.data.message || t('auth.device.verification.required'), 'info');
          return;
        }

        showToast(response.data.message || t('admin.showToast.auth.success'), 'success');
        router.push(ROUTES.ADMIN.DASHBOARD);
      } else {
        showToast(response.data.message || t('admin.showToast.auth.loginFailed'), 'error');
      }
    } catch (error: any) {
      console.error('Login error:', error)
      showToast(parseApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return { handleSignin, loading }
}