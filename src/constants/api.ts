export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: '/auth/login',
    SIGNUP: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile'
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id'
  }
  // ... các endpoints khác
}
