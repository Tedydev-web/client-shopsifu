import { useState } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { LoginSchema } from '../schema/index'
import { authService } from '@/services/auth/authService'
import { ROUTES } from '@/constants/route'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import { useTranslation } from 'react-i18next'
import { useGetProfile } from '@/hooks/useGetProfile'
import { useUserData } from '@/hooks/useGetData-UserLogin'


export function useSignin() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { fetchProfile } = useGetProfile()
  const { t } = useTranslation()
  const Schema = LoginSchema(t)  
  const userData = useUserData();
  

  const handleSignin = async (data: z.infer<typeof Schema>) => {
    try {
      setLoading(true);
      const response = await authService.login(data);

      if (response.status === 200) {
        // Handle 2FA/OTP redirection first
        if (response.verificationType === 'OTP') {
          router.push(`${ROUTES.BUYER.VERIFY_2FA}?type=OTP`);
          showToast(response.message || t('auth.device.verification.required'), 'info');
          return;
        }	
        if (response.verificationType === '2FA') {
          router.push(`${ROUTES.BUYER.VERIFY_2FA}?type=TOTP`);
          showToast(response.message || t('auth.device.verification.required'), 'info');
          return;
        }
        await fetchProfile();
        await authService.getAbility();
        const role = userData?.role;
        showToast(response.message || t('admin.showToast.auth.success'), 'success');
        if (role === 'Admin' || role === 'Super Admin') {
          window.location.href = ROUTES.ADMIN.DASHBOARD;
        } else {
          window.location.href = ROUTES.HOME;
        }
      } else {
        showToast(response.message || t('admin.showToast.auth.loginFailed'), 'error');
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