// Base URL cho API
const API_BASE = '/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: `${API_BASE}/auth/login`,
    SIGNUP: `${API_BASE}/auth/complete-registration`,
    SIGNUP_SEND: `${API_BASE}/auth/initiate-registration`,
    REFRESH_TOKEN: `${API_BASE}/auth/refresh-token`,
    LOGOUT: `${API_BASE}/auth/logout`,
    PROFILE: `${API_BASE}/auth/profile`,
    SEND_OTP: `${API_BASE}/auth/send-otp`,
    GOOGLE_LOGIN: `${API_BASE}/auth/google-link`,
    VERIFY_OTP: `${API_BASE}/auth/otp/verify`,
    RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
    VERIFY_2FA: `${API_BASE}/auth/login/verify`,
    SETUP_2FA: `${API_BASE}/auth/2fa/setup`,
    DISABLE_2FA: `${API_BASE}/auth/2fa/disable`,
    GET_CSRF_TOKEN: `${API_BASE}/get-cookies`,
    CONFIRM_2FA: `${API_BASE}/auth/2fa/confirm-setup`,
    TRUST_DEVICE: `${API_BASE}/auth/sessions/current-device/trust`,
    UNTRUST_DEVICE: `${API_BASE}/auth/devices/:deviceId/untrust`
  },
  ROLES:{
    GETALL: `${API_BASE}/roles`,
    GETBYID: `${API_BASE}/roles/:id`,
    UPDATE: `${API_BASE}/roles/:id`,
    POST: `${API_BASE}/roles`,
    POST_ROLE_PERMISSIONS: `${API_BASE}/roles/:id/assign-permissions`,
    DELETE_BY_ID: `${API_BASE}/roles/:id`,
  },
  PERMISSION:{
    GETALL: `${API_BASE}/permissions`,
    GETBYID: `${API_BASE}/permissions/:id`,
    UPDATE: `${API_BASE}/permissions/:id`,
    POST: `${API_BASE}/permissions`,
    DELETE_BY_ID: `${API_BASE}/permissions/:id`,
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
  },
  AUDIT_LOGS: {
    GETALL: `${API_BASE}/audit-logs`,
    GET_STATS: `${API_BASE}/audit-logs/stats`,
    GET_BY_ID: `${API_BASE}/audit-logs/:id`,
    GET_ACTIONS: `${API_BASE}/audit-logs/actions`,
    GET_ENTITIES: `${API_BASE}/audit-logs/entities`,
  },
  SESSIONS: {
    GETALL: `${API_BASE}/auth/sessions`,
    REVOKE: `${API_BASE}/auth/sessions`,
  },
  // ... các endpoints khác
}