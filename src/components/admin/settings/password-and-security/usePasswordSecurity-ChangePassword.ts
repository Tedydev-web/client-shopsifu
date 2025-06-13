import { useState } from 'react';
import { authService } from '@/services/auth/authService';
import { ChangePasswordRequest } from '@/types/auth/auth.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';

export const usePasswordSecurityChangePassword = () => {
  const [loading, setLoading] = useState(false);
  

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    setLoading(true);
    try {
      const response = await authService.changePassword(data);
      showToast(response.message, 'success');
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
