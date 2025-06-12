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
  const userData = useUserData();

  const role = userData?.role;
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

        await fetchProfile();
        showToast(response.message || t('admin.showToast.auth.success'), 'success');
        if(role === 'Admin'){
          window.location.href = ROUTES.ADMIN.DASHBOARD;
        }else{
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