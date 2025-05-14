// Base URL cho API
const API_BASE = '/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: `${API_BASE}/auth/login`,
    SIGNUP: `${API_BASE}/auth/register`,
    REFRESH_TOKEN: `${API_BASE}/auth/refresh-token`,
    LOGOUT: `${API_BASE}/auth/logout`,
    PROFILE: `${API_BASE}/auth/profile`,
    SEND_OTP: `${API_BASE}/auth/otp`,
    GOOGLE_LOGIN: `${API_BASE}/auth/google-link`,
    VERIFY_OTP: `${API_BASE}/auth/verify-code`,
    RESET_PASSWORD: `${API_BASE}/auth/reset-password`
  },  ROLE: {
    GETALL: `${API_BASE}/roles`,
    GET: `${API_BASE}/roles/:id`,
    CREATE: `${API_BASE}/roles`,
    UPDATE: `${API_BASE}/roles/:id`,
    DELETE: `${API_BASE}/roles/:id`,
  },
  PERMISSION: {
    GETALL: `${API_BASE}/permissions`,
    GET_ROLE_PERMISSIONS: `${API_BASE}/roles/:id/permissions`,
    UPDATE_ROLE_PERMISSIONS: `${API_BASE}/roles/:id/permissions`,
  },
  PRODUCTS: {
    LIST: `${API_BASE}/products`,
    DETAIL: `${API_BASE}/products/:id`,
    CREATE: `${API_BASE}/products`,
    UPDATE: `${API_BASE}/products/:id`,
    DELETE: `${API_BASE}/products/:id`
  }
  // ... các endpoints khác
}
