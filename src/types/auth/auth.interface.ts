export interface oAuthLoginResponse {
  url: string
}
// ĐĂNG XUẤT TÀI KHOẢN - LOGOUT
export interface LogoutRequest {
  refreshToken?: string
}

// ĐĂNG NHẬP TÀI KHOẢN - SIGN-IN
export interface LoginRequest {
  emailOrUsername: string
  password: string
  rememberMe: boolean
}

export interface LoginResponse {
    statusCode: number
    success: string
    message: string
    data:{
      verificationType: string
    }
}

export interface RequestDeviceResponse{
    statusCode: string
    message: string
    data:{
        requiresDeviceVerification: string
        verificationType: string
        verificationRedirectUrl: string
    }
}



// ĐĂNG KÝ TÀI KHOẢN - SIGN-UP
export interface RegisterRequest {
  firstName: string
  lastName: string
  username: string
  password: string
  confirmPassword: string
  phoneNumber: string
}

export interface RegisterResponse {
  id: string
  email: string
  name: string
  phoneNumber: string
  roleId: number
  status: string
  createdAt: string
  updatedAt: string
  message: string
}

export interface RegisterSendRequest{
  email: string;
}


// ĐỔI MẬT KHẨU TÀI KHOẢN - RESET PASSWORD

export interface ResetPasswordSendRequest{
  email: string
}
export interface ResetPasswordRequest {
  email?: string
  otpToken?: string
  newPassword: string
  confirmPassword: string
  revokeAllSessions: string
}

export interface ResetPasswordResponse {
  message: string
}


// XÁC THỰC & GỬI CODE - VERIFY + SEND CODE
export interface VerifyOTPRequest {
  code: string
}

export interface VerifyOTPResponse {
  message: string
  statusCode?: number
  data?: {
    otpToken?: string
    token?: string
    email?: string
    type?: string
    verified?: boolean
  }
}

export interface Verify2faRequest {
  code: string
  method: string
}

export interface Verify2faResponse {
  userId: string
  email: string
  name: string
  role: string
  isDeviceTrustedInSession: boolean
  currentDeviceId: string
}

export interface ResendOTPRequest{
  code: string
}

export interface SendOTPRequest {
  code?: string
  email?: string
  type?: string
}
export interface SendOTPResponse {
  email: string
  type: string
  expiresAt: string
  createdAt: string
  message: string
}




// THIẾT LẬP 2FA - SETUP 2FA
export interface Setup2faResponse {
  success: string
  statusCode: number
  data:{
    secret: string
    qrCode: string
  }
}

export interface Confirm2faRequest {
  code: string
}

export interface Confirm2faResponse {
  message: string
  recoveryCodes:[]
}


export interface Disable2faRequest {
  code: string
  method: string
}

export interface Disable2faResponse {
  message: string
}

// REFRESH TOKEN
export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}
