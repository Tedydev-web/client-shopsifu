import { privateAxios, publicAxios } from '@/lib/api';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  SendOTPRequest,
  SendOTPResponse 
} from '@/types/auth.interface';
import { API_ENDPOINTS } from '@/constants/api';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await publicAxios.post<LoginResponse>(API_ENDPOINTS.AUTH.SIGNIN, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await publicAxios.post<RegisterResponse>(API_ENDPOINTS.AUTH.SIGNUP, data);
    return response.data;
  },

  sendOTP: async (data: SendOTPRequest): Promise<SendOTPResponse> => {
    const response = await publicAxios.post<SendOTPResponse>(
        API_ENDPOINTS.AUTH.SEND_OTP,
        data
    )
    return response.data
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await publicAxios.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    return response.data;
  },

  // logout: async (): Promise<void> => {
  //   await privateAxios.post(API_ENDPOINTS.AUTH.LOGOUT);
  // },
  logout: async (accessToken: string, refreshToken: string): Promise<void> => {
    // Gửi yêu cầu POST với Bearer token trong header và refresh token trong body
    await privateAxios.post(
      API_ENDPOINTS.AUTH.LOGOUT,
      { refreshToken }, // refresh token gửi trong body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // access token gửi trong header
        },
      }
    );
  },

  getProfile: async () => {
    const response = await privateAxios.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }
};
