import { publicAxios, privateAxios, refreshAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { UserProfileResponse, UpdateProfileRequest, ChangePasswordRequest, ChangePasswordResponse } from '@/types/auth/profile.interface';


export const profileService = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await privateAxios.get<UserProfileResponse>(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    const response = await privateAxios.patch<UserProfileResponse>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
    return response.data;
  },
  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
      const response = await privateAxios.post<ChangePasswordResponse>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        data
      )
      return response.data
    },
};


