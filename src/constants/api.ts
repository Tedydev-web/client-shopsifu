// Base URL cho API
const API_BASE = '';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: `${API_BASE}/auth/login`,
    REFRESH_TOKEN: `${API_BASE}/auth/refresh-token`,
    LOGOUT: `${API_BASE}/auth/logout`,
    SEND_OTP: `${API_BASE}/auth/send-otp`,
    GOOGLE_LOGIN: `${API_BASE}/auth/google-link`,
    GET_CSRF_TOKEN: `${API_BASE}/cookies/csrf-token`,
    //PROFILE
    PROFILE: `${API_BASE}/profile`,
    UPDATE_PROFILE: `${API_BASE}/profile`,
    // SIGN-UP 
    SIGNUP: `${API_BASE}/auth/complete-registration`,
    SIGNUP_SEND: `${API_BASE}/auth/initiate-registration`,
    // CHANGE PASSWORD 
    CHANGE_PASSWORD: `${API_BASE}/auth/password/change`,
    // RESET PASSWORD 
    RESET_PASSWORD: `${API_BASE}/auth/password/set-new`,
    RESET_PASSWORD_SEND: `${API_BASE}/auth/password/initiate-reset`,
    //VERIFY & RESEND
    VERIFY_OTP: `${API_BASE}/auth/otp/verify`,
    VERIFY_2FA: `${API_BASE}/auth/2fa/verify`, //TOTP hoặc RECOVERY
    RESEND_OTP: `${API_BASE}/auth/otp/resend`,
    //SETUP 2FA 
    SETUP_2FA: `${API_BASE}/auth/2fa/setup`,
    CONFIRM_2FA: `${API_BASE}/auth/2fa/confirm-setup`,
    DISABLE_2FA: `${API_BASE}/auth/2fa/disable`,
    //RECOVERY CODE
    REGENERATE_RECOVERY_CODES: `${API_BASE}/auth/2fa/regenerate-recovery-codes`,
    // DEVICE
    TRUST_DEVICE: `${API_BASE}/sessions/devices/trust-current`,
    UNTRUST_DEVICE: `${API_BASE}/auth/devices/:deviceId/untrust`,
    //GET ABILITY BY ROLE (PERMISSION)
    GET_ABILITY: `${API_BASE}/auth/ui-capabilities`,
  },
  BASE:{
    UPLOAD_MEDIA: `${API_BASE}/media/images/upload`,
  },
  // QUẢN LÝ NGƯỜI DÙNG - USERS
  USERS:{
    GETALL: `${API_BASE}/users`,
    GETBYID: `${API_BASE}/users/:id`,
    UPDATE: `${API_BASE}/users/:id`,
    POST: `${API_BASE}/users`,
    DELETE_BY_ID: `${API_BASE}/users/:id`,
  },
  // QUẢN LÝ VAI TRÒ - ROLES
  ROLES:{
    GETALL: `${API_BASE}/roles`,
    GETBYID: `${API_BASE}/roles/:id`,
    UPDATE: `${API_BASE}/roles/:id`,
    POST: `${API_BASE}/roles`,
    POST_ROLE_PERMISSIONS: `${API_BASE}/roles/:id/assign-permissions`,
    DELETE_BY_ID: `${API_BASE}/roles/:id`,
  },
  // QUẢN LÝ QUYỀN - PERMISSIONS
  PERMISSION:{
    GETALL: `${API_BASE}/permissions`,
    GETBYID: `${API_BASE}/permissions/:id`,
    UPDATE: `${API_BASE}/permissions/:id`,
    POST: `${API_BASE}/permissions`,
    DELETE_BY_ID: `${API_BASE}/permissions/:id`,
  },
  // QUẢN LÝ NGÔN NGỮ - LANGUAGES
  LANGUAGES:{
    GETALL: `${API_BASE}/languages`,
    GETBYID: `${API_BASE}/languages/:id`,
    UPDATE: `${API_BASE}/languages/:id`,
    POST: `${API_BASE}/languages`,
    DELETE_BY_ID: `${API_BASE}/languages/:id`,
  },
  // QUẢN LÝ SẢN PHẨM - PRODUCTS
  PRODUCTS: {
    LIST: `${API_BASE}/products`,
    DETAIL: `${API_BASE}/products/:id`,
    CREATE: `${API_BASE}/products`,
    UPDATE: `${API_BASE}/products/:id`,
    DELETE: `${API_BASE}/products/:id`
  },
  // THỐNG KÊ LOGS - AUDIT LOGS
  AUDIT_LOGS: {
    GETALL: `${API_BASE}/audit-logs`,
    GET_STATS: `${API_BASE}/audit-logs/stats`,
    GET_BY_ID: `${API_BASE}/audit-logs/:id`,
    GET_ACTIONS: `${API_BASE}/audit-logs/actions`,
    GET_ENTITIES: `${API_BASE}/audit-logs/entities`,
  },
  // QUẢN LÝ SESSION - SESSIONS
  SESSIONS: {
    GETALL: `${API_BASE}/sessions`,
    REVOKE: `${API_BASE}/sessions/revoke`,
    REVOKE_ALL: `${API_BASE}/sessions/revoke-all`
  },
  //QUẢN LÝ THƯƠNG HIỆU - BRAND
  BRANDS:{
    GETALL: `${API_BASE}/brands`,
    GET_BY_ID: `${API_BASE}/brands/:brandsId`,
    CREATE: `${API_BASE}/brands`,
    UPDATE: `${API_BASE}/brands/:brandsId`,
    DELETE: `${API_BASE}/brands/:brandsId`
  },
  BRANDS_TRANSLATIONS:{
    GETALL: `${API_BASE}/brands`,
    GET_BY_ID: `${API_BASE}/brands/:brandsId`,
    CREATE: `${API_BASE}/brands`,
    UPDATE: `${API_BASE}/brands/:brandsId`,
    DELETE: `${API_BASE}/brands/:brandsId`
  }
  // ... các endpoints khác
}