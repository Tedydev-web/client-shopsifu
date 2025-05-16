import { privateAxios, publicAxios } from '@/lib/api';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  SendOTPRequest,
  SendOTPResponse,
  oAuthLoginResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  Verify2faRequest,
  Verify2faResponse,
  Disable2faRequest,
  Disable2faResponse,
  Setup2faResponse,
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

  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    const response = await publicAxios.post<VerifyOTPResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data
    )
    return response.data
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await publicAxios.post<ResetPasswordResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    )
    return response.data
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await publicAxios.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await privateAxios.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },
  

  getProfile: async () => {
    const response = await privateAxios.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  getGoogleLoginUrl: async (): Promise<oAuthLoginResponse> => {
    const response = await publicAxios.get<oAuthLoginResponse>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN);
    return response.data;
  },

  verify2fa: async (data: Verify2faRequest): Promise<Verify2faResponse> => {
    const response = await publicAxios.post<Verify2faResponse>(
      API_ENDPOINTS.AUTH.VERIFY_2FA,
      data
    );
    return response.data;
  },

  // setup2fa: async (): Promise<Setup2faResponse> => {
  //   const response = await privateAxios.post<Setup2faResponse>(API_ENDPOINTS.AUTH.SETUP_2FA);
  //   return response.data;
  // },
  setup2fa: async (): Promise<Setup2faResponse> => {
    const response = await privateAxios.post<Setup2faResponse>(API_ENDPOINTS.AUTH.SETUP_2FA, {})
    return response.data
  },
  

  disable2fa: async (data: Disable2faRequest): Promise<Disable2faResponse> => {
    const response = await privateAxios.post<Disable2faResponse>(
      API_ENDPOINTS.AUTH.DISABLE_2FA,
      data
    );
    return response.data;
  },
};
