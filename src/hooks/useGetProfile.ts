import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { profileService } from '@/services/auth/profileService';
import { setProfile } from '@/store/features/auth/profileSlide';
import { toast } from 'react-toastify';

export const useGetProfile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileService.getProfile();
      const { userProfile, ...rest } = response.data;
      
      // Transform data to match the UserProfile structure in Redux
      const profileData = {
        ...rest,
        ...userProfile
      };

      dispatch(setProfile(profileData));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  }, [dispatch]);

  return { fetchProfile, loading, error };
};
