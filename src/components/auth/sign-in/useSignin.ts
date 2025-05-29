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
      sessionStorage.setItem('userEmail', data.email); // Lưu email

      if (response.twoFactorMethod) {
        router.push(`${ROUTES.BUYER.VERIFY_2FA}?type=${response.twoFactorMethod}`);
        showToast(response.message, 'info')
        return;
      }
      
      showToast(t('admin.showToast.auth.loginSuccessful'), 'success')
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