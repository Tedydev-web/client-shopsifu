import { useState } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { LoginSchema } from '../schema/index'
import { authService } from '@/services/authService'
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
        if (response.data?.data?.requiresDeviceVerification) {
        if (response.data.data.verificationType === 'OTP') {
          router.push(`${ROUTES.BUYER.VERIFY_CODE}?action=login`);
          showToast(response.message || t('auth.device.verification.required'), 'info');
          return;
        } else if (response.data.data.verificationType === 'TOTP') {
          router.push(ROUTES.BUYER.VERIFY_2FA);
          showToast(response.message || t('auth.device.verification.required'), 'info');
          return;
        }
      }
      
      showToast(t('admin.showToast.auth.loginSuccessful'), 'success');
      router.push(ROUTES.ADMIN.DASHBOARD)
    } catch (error: any) {
      console.error('Login error:', error)
      showToast(parseApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return { handleSignin, loading }
}