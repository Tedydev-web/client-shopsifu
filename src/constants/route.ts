export const ROUTES = {
  HOME: '/',
  AUTH: {
    SIGNIN: '/sign-in',
    SIGNUP: '/sign-up',
    VERIFY_CODE: '/verify-code',
    RESET_PASSWORD: '/reset-password',
    VERIFY_2FA: '/verify-2fa',
    VERIFY_EMAIL: '/verify-email',
    // MY_ACCOUNT: '/user/dashboard',
    // MY_ORDERS: '/user/orders',
    // CART: '/cart'
  },
  CLIENT:{
    SEARCH: '/:slug',
    CART: '/cart',
    CHECKOUT:{
      BASE: '/checkout/:slug',
      SUCCESS: '/checkout/payment-success',
      RETRY: '/checkout/retry/:orderId',
    },
    POLICY: '/policy',
    SHOP: '/shop/:slug',
    USER:{
      BASE: '/user',
      DASHBOARD: '/user/dashboard',
      LANGUAGE: '/user/language',  
      ORDERS: '/user/orders',
      PROFILE: '/user/profile',
    },
    PRODUCT_DETAIL: '/products/:slug',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    AUDIT_LOGS: '/admin/audit-logs',
    BRAND: '/admin/brand',
    CATEGORY: '/admin/category',
    DEVICE: '/admin/device',
    LANGUAGE: '/admin/languages',
    ORDER: '/admin/order',
    PERMISSIONS: '/admin/permissions',
    PRODUCT:{
      LIST: '/admin/products',
      NEW: '/admin/products/new',
      EDIT: '/admin/products/:id',
    },
    ROLES: '/admin/roles',
    SETTINGS:{
      BASE: '/admin/settings',
      PASSWORD_SECURITY: '/admin/settings/password-and-security',
      PROFILE: '/admin/settings/profile',
      SEESION: '/admin/settings/session',
    },
    USERS: '/admin/users',
    VOUCHER:{
      LIST: '/admin/voucher',
      EDIT: '/admin/voucher/edit/:id',
      NEW: '/admin/voucher/new',
    }
  },
  PRODUCT: {
    DETAIL: '/products/:slug',
    LIST: '/products'
  }
} as const;


// ==================================================
// ROUTE CONFIGURATION

// Routes chỉ ADMIN được truy cập
export const ADMIN_ONLY_ROUTES = [
  '/admin/audit-logs',
  '/admin/device', 
  '/admin/languages',
  '/admin/permissions',
  '/admin/roles',
  '/admin/settings',
  '/admin/users'
] as const;

// Routes SELLER được truy cập (bên cạnh ADMIN)
export const SELLER_ALLOWED_ROUTES = [
  '/admin', // Dashboard
  '/admin/brand',
  '/admin/category', 
  '/admin/order',
  '/admin/products',
  '/admin/voucher'
] as const;

// Định nghĩa các route cần bảo vệ
export const PROTECTED_ROUTES = [
  '/cart',
  '/checkout',
  '/user',
  '/admin'
] as const;

// Định nghĩa các route public (không cần auth)
export const PUBLIC_ROUTES = [
  '/',
  '/sign-in',
  '/sign-up',
  '/verify-code',
  '/reset-password',
  '/verify-2fa',
  '/verify-email',
  '/oauth-google-callback',
  '/products',
  '/policy',
  '/shop',
  '/forgot-password'
] as const;
