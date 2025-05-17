// LOGIN
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  loginSessionToken: string;
}

export interface oAuthLoginResponse{
  url: string;
} 

// REGISTER
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  token: string;
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

// VERIFY + SEND
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
  otpToken: string;
  token: string;
  email: string;
  type: string;
  verified: boolean;
}

// RESET PASSWORD
export interface ResetPasswordRequest {
  email: string;
  otpToken: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// 2FA
export interface Setup2faResponse {
  uri: string;
}

export interface Verify2faRequest {
  loginSessionToken: string;
  type: string;
  code: string;
}

export interface Verify2faResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Disable2faRequest {
  code: string;
  type: string;
}

export interface Disable2faResponse {
  message: string;
}


// REFRESH TOKEN
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
export interface Confirm2faRequest {
  setupToken: string;
  totpCode: string;
}

export interface Confirm2faResponse {
  message: string;
}


