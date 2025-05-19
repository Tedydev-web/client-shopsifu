// Base URL cho API
const API_BASE = '/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: `${API_BASE}/auth/login`,
    SIGNUP: `${API_BASE}/auth/register`,
    REFRESH_TOKEN: `${API_BASE}/auth/refresh-token`,
    LOGOUT: `${API_BASE}/auth/logout`,
    PROFILE: `${API_BASE}/auth/profile`,
    SEND_OTP: `${API_BASE}/auth/send-otp`,
    GOOGLE_LOGIN: `${API_BASE}/auth/google-link`,
    VERIFY_OTP: `${API_BASE}/auth/verify-code`,
    RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
    VERIFY_2FA: `${API_BASE}/auth/2fa/verify`,
    SETUP_2FA: `${API_BASE}/auth/2fa/setup`,
    DISABLE_2FA: `${API_BASE}/auth/2fa/disable`,
    GET_CSRF_TOKEN: `${API_BASE}/get-cookies`,
  },
  ROLE:{
    GETALL: `${API_BASE}/role/create`,
    GET: `${API_BASE}/role/create`,
    UPDATE: `${API_BASE}/role/create`,
    POST: `${API_BASE}/role/create`,
    DELETE_ALL: `${API_BASE}/role/create`,
  },
  PERMISSION:{
    GETALL: `${API_BASE}/permission/create`,
    GET: `${API_BASE}/permission/create`,
    UPDATE: `${API_BASE}/permission/create`,
    POST: `${API_BASE}/permission/create`,
    DELETE_ALL: `${API_BASE}/permission/create`,
  },
  LANGUAGES:{
    GETALL: `${API_BASE}/languages`,
    GETBYID: `${API_BASE}/languages/:id`,
    UPDATE: `${API_BASE}/languages/:id`,
    POST: `${API_BASE}/languages`,
    DELETE_BY_ID: `${API_BASE}/languages/:id`,
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
