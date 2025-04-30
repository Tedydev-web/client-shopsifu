// Key dùng để lưu token và user
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

import { getStore } from '@/store/store';

// ✅ Lấy token từ localStorage
export const getToken = (): string | null => {
  const { store } = getStore();
  return store.getState()?.auth?.token || null;
};

// ✅ Lưu token vào localStorage
export const setToken = (token: string) => {
  const { store } = getStore();
  store.dispatch({ type: 'auth/setCredentials', payload: { token, user: null } });
};

// ✅ Xóa token khi logout
export const removeToken = () => {
  const { store } = getStore();
  store.dispatch({ type: 'auth/logout' });
};

// ✅ Lưu thông tin người dùng (object → JSON)
export const setUser = (user: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// ✅ Lấy thông tin người dùng
export const getUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// ✅ Xoá thông tin người dùng
export const removeUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
};

// ✅ Check đã đăng nhập hay chưa
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// ✅ Xoá toàn bộ auth
export const clearAuth = () => {
  removeToken();
  removeUser();
};



