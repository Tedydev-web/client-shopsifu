import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { profileService } from '@/services/auth/profileService';
import { setProfile } from '@/store/features/auth/profileSlide';
import { UserProfile, UserProfileResponse } from '@/types/auth/profile.interface';
import { toast } from 'react-toastify';

export const useGetProfile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    setLoading(true);
    setError(null);
    try {
      const response: UserProfileResponse = await profileService.getProfile();

      // Làm phẳng dữ liệu từ API response
      const flattenedProfile: UserProfile = {
        id: response.data.id,
        email: response.data.email,
        role: response.data.role,
        status: response.data.status,
        twoFactorEnabled: response.data.twoFactorEnabled,
        googleId: response.data.googleId,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        firstName: response.data.userProfile.firstName,
        lastName: response.data.userProfile.lastName,
        username: response.data.userProfile.username,
        phoneNumber: response.data.userProfile.phoneNumber,
        avatar: response.data.userProfile.avatar,
      };

      dispatch(setProfile(flattenedProfile));
      return flattenedProfile; // Trả về dữ liệu profile đã được làm phẳng
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
      setError(errorMessage);
      toast.error(errorMessage);
      return null; // Trả về null khi có lỗi
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { fetchProfile, loading, error };
};
