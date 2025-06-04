import { publicAxios, privateAxios, refreshAxios } from '@/lib/api';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  RegisterSendRequest,
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
  LogoutRequest,
  Confirm2faRequest,
  Confirm2faResponse,
  RefreshTokenResponse,
} from '@/types/auth/auth.interface';
import { API_ENDPOINTS } from '@/constants/api';
import { AxiosError } from "axios";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await privateAxios.post<LoginResponse>(API_ENDPOINTS.AUTH.SIGNIN, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await privateAxios.post<RegisterResponse>(API_ENDPOINTS.AUTH.SIGNUP, data);
    return response.data;
  },

  register_send: async (data: RegisterSendRequest): Promise<void> =>{
    const response = await privateAxios.post(API_ENDPOINTS.AUTH.SIGNUP_SEND, data);
    return response.data;
  },

  sendOTP: async (data: SendOTPRequest): Promise<SendOTPResponse> => {
    const response = await privateAxios.post<SendOTPResponse>(
        API_ENDPOINTS.AUTH.SEND_OTP,
        data
    )
    return response.data
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    const response = await privateAxios.post<VerifyOTPResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data
    )
    return response.data
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await privateAxios.post<ResetPasswordResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    )
    return response.data
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await refreshAxios.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    return response.data;
  },

  logout: async (data?: LogoutRequest): Promise<void> => {
    await privateAxios.post(API_ENDPOINTS.AUTH.LOGOUT, data || {});
  },
  

  getProfile: async () => {
    const response = await privateAxios.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  getGoogleLoginUrl: async (): Promise<oAuthLoginResponse> => {
    const response = await privateAxios.get<oAuthLoginResponse>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN);
    return response.data;
  },

  verify2fa: async (data: Verify2faRequest): Promise<Verify2faResponse> => {
    const response = await privateAxios.post<Verify2faResponse>(
      API_ENDPOINTS.AUTH.VERIFY_2FA,
      data
    );
    return response.data;
  },

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

  confirm2fa: async (data: Confirm2faRequest): Promise<Confirm2faResponse> => {
    const response = await privateAxios.post<Confirm2faResponse>(
      API_ENDPOINTS.AUTH.CONFIRM_2FA,
      data
    );
    return response.data;
  },
  getCsrfToken: async (): Promise<void> => {
    try {
      await publicAxios.get(API_ENDPOINTS.AUTH.GET_CSRF_TOKEN);
      // CSRF token sẽ được tự động lưu vào cookies bởi browser
      // Không cần xử lý response data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        // Nếu endpoint không tồn tại, coi như đã có CSRF token
        console.warn('CSRF token endpoint not found, assuming token exists');
        return;
      }
      throw error;
    }
  },

  trustDevice: async (): Promise<void> =>{
    const response = await privateAxios.post(API_ENDPOINTS.AUTH.TRUST_DEVICE, {})
    return response.data
  }
};
