
// LOGIN
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
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



