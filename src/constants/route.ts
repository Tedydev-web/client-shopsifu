export const ROUTES = {
  HOME: '/',
  BUYER: {
    SIGNIN: '/sign-in',
    SIGNUP: '/sign-up',
    VERIFY_CODE: '/verify-code',
    RESET_PASSWORD: '/reset-password',
    VERIFY_2FA: '/verify-2fa',
    MY_ACCOUNT: '/user/dashboard',
    MY_ORDERS: '/my-account/orders',
    CART: '/cart'
  },
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    SETTINGS_SECURITY: '/admin/settings/security'
  },
  PRODUCT: {
    DETAIL: '/products/:slug',
    LIST: '/products'
  }
} as const;

// Định nghĩa các route cần bảo vệ
export const PROTECTED_ROUTES = [
  ROUTES.BUYER.MY_ACCOUNT,
  ROUTES.BUYER.MY_ORDERS,
  ROUTES.BUYER.CART,
  '/user/',           // Protect tất cả routes bắt đầu với /user/
  '/my-account/',     // Protect tất cả routes bắt đầu với /my-account/
  ...Object.values(ROUTES.ADMIN) // Protect tất cả admin routes
] as const;

// Định nghĩa các route public (không cần auth)
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.BUYER.SIGNIN,
  ROUTES.BUYER.SIGNUP,
  ROUTES.BUYER.VERIFY_CODE,
  ROUTES.BUYER.RESET_PASSWORD,
  ROUTES.BUYER.VERIFY_2FA,
  ROUTES.PRODUCT.LIST,
  ROUTES.PRODUCT.DETAIL
] as const;
