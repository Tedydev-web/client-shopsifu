import { publicAxios, privateAxios, refreshAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { UserProfileResponse } from '@/types/auth/profile.interface';


export const profileService = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await privateAxios.get<UserProfileResponse>(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },
};


