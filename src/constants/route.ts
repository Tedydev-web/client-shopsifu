export const ROUTES = {
  HOME: '/',
  BUYER: {
    SIGNIN: '/sign-in',
    SIGNUP: '/sign-up',
    VERIFY_CODE: '/verify-code',
    RESET_PASSWORD: '/reset-password',
    VERIFY_2FA: '/verify-2fa',
    MY_ACCOUNT: '/user',
    MY_ORDERS: '/my-account/orders'
  },
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    SETTINGS_SECURITY: '/admin/settings/security'
  },
  PRODUCT: '/product/:id'
}
