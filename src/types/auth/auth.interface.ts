// LOGIN
export interface LoginRequest {
  emailOrUsername: string
  password: string
  rememberMe: boolean
}

export interface LoginResponse {
  statusCode: string
    message: string
    data:{
      statusCode: string
      data:{
        requiresDeviceVerification: string
        verificationType: string
        verificationRedirectUrl: string
      }
        
    }
}

export interface oAuthLoginResponse {
  url: string
}
//LOGOUT
export interface LogoutRequest {
  refreshToken?: string
}
// REGISTER
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


// VERIFY + SEND
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

// RESET PASSWORD
export interface ResetPasswordRequest {
  email: string
  otpToken: string
  newPassword: string
  confirmNewPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

// 2FA
export interface Setup2faResponse {
  uri: string
  setupToken: string
}

export interface Confirm2faRequest {
  setupToken: string
  totpCode: string
}

export interface Confirm2faResponse {
  message: string
  recoveryCodes:[]
}
export interface Verify2faRequest {
  code: string
}

export interface Verify2faResponse {
  userId: string
  email: string
  name: string
  role: string
  isDeviceTrustedInSession: boolean
  currentDeviceId: string
}

export interface Disable2faRequest {
  code: string
  type: string
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
