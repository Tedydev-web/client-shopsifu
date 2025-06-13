import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { profileService } from '@/services/auth/profileService';
import { UpdateProfileRequest } from '@/types/auth/profile.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { setProfile } from '@/store/features/auth/profileSlide';

export const useUpdateProfile = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const updateProfile = async (data: UpdateProfileRequest) => {
    setLoading(true);
    try {
      const response = await profileService.updateProfile(data);
      showToast(response.message, 'success');
      
      const userProfilePayload = {
        ...response.data.userProfile,
        id: response.data.id,
        email: response.data.email,
        role: response.data.role,
        status: response.data.status,
        twoFactorEnabled: response.data.twoFactorEnabled,
        googleId: response.data.googleId,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
      };

      dispatch(setProfile(userProfilePayload));
      onSuccess?.();
    } catch (error) {
      const apiError = parseApiError(error);
      showToast(apiError, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
};

