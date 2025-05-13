// LOGIN
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// REGISTER
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  code: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  roleId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// VERIFY
export interface SendOTPRequest {
  email: string;
  type: string;
}
export interface SendOTPResponse {
  email: string;
  type: string;
  expiresAt: string;
  createdAt: string;
}

export interface VerifyOTPRequest {
  email: string;
  code: string;
  type: string;
}

export interface VerifyOTPResponse {
  token: string;
  email: string;
  type: string;
  verified: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}



