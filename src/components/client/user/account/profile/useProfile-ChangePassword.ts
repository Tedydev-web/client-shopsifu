import { useState } from 'react';
import { profileService } from '@/services/auth/profileService';
import { ChangePasswordRequest } from '@/types/auth/profile.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/route';

export const usePasswordChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    setLoading(true);
    try {
      const response = await profileService.changePassword(data);
      showToast(response.message, 'success');
      if (response.verificationType === 'OTP') {
      router.push(`${ROUTES.BUYER.VERIFY_2FA}?type=OTP`);
      showToast(response.message, 'info');
      return;
    }
    if (response.verificationType === '2FA') {
      router.push(`${ROUTES.BUYER.VERIFY_2FA}?type=TOTP`);
      showToast(response.message, 'info');
      return;
    }
      return true; // Indicate success
    } catch (error: any) {
      showToast(parseApiError(error), 'error');
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleChangePassword,
  };
};
