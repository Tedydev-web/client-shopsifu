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
    VERIFY_OTP: `${API_BASE}/auth/verify-otp`
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
