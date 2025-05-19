import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getAccessToken, setToken, removeToken, getRefreshToken } from './auth';
import { ErrorResponse } from '@/types/base.interface'
import { getStore } from '@/store/store'; // đã có
import Cookies from 'js-cookie'

// Định nghĩa URL gốc cho API, lấy từ biến môi trường
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
const { store } = getStore();
const refreshToken = store.getState()?.authShopsifu?.refreshToken;
// Biến để theo dõi xem có đang trong quá trình refresh token không
let isRefreshing = false;

// Promise dùng để giữ quá trình refresh hiện tại
let refreshPromise: Promise<any> | null = null;

// Thêm interface mở rộng cho config
interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ==================== PUBLIC AXIOS (Không cần token) ====================

export const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: false, // 🔒 Rất quan trọng để cookie đi theo request
})

// Request Interceptor → Gắn x-csrf-token
publicAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('xsrf-token') // 🔍 Đọc cookie

      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken // ✅ Gắn header
        console.log('➡️ CSRF Token attached:', csrfToken)
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor (optional)
publicAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    console.error('❌ publicAxios error:', error)
    return Promise.reject(error)
  }
)

//
// ==================== REFRESH AXIOS (Dùng riêng để refresh token) ====================
// Không dùng interceptor, tránh vòng lặp vô hạn khi bị lỗi
//
const refreshAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

//
// ==================== PRIVATE AXIOS (Dùng cho API cần xác thực) ====================
// Có interceptor để tự động gắn token vào header
//
export const privateAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

//
// === Interceptor request: tự động gắn Bearer token vào header ===
//
// privateAxios.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     if (typeof window !== 'undefined') {
//       const store = getStore().store;
//       const accessToken = store.getState().authShopsifu?.accessToken;

//       if (accessToken && config.headers) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


privateAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const store = getStore().store;
      const accessToken = store.getState().authShopsifu?.accessToken;

      // ✅ Đọc xsrf-token từ cookie
      const csrfToken = Cookies.get('xsrf-token');

      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken; // ✅ Thêm CSRF token vào header
      }
    }

    config.withCredentials = true; // ✅ Luôn đính kèm cookies trong request
    return config;
  },
  (error) => Promise.reject(error)
)


refreshAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const store = getStore().store;
      const accessToken = store.getState().authShopsifu?.accessToken;

      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//
// === Hàm retry request sau khi đã refresh token thành công ===
//
const retryRequest = (originalConfig: AxiosRequestConfig): Promise<any> => {
  const store = getStore().store;
  const newAccessToken = store.getState().authShopsifu!.accessToken;
  const refreshToken = store.getState().authShopsifu!.refreshToken; // Lấy token mới từ Redux store

  // Nếu không có token mới, redirect về login
  if (!newAccessToken) {
    window.location.href = '/buyer/sign-in';
    return new Promise(() => { });
  }

  // Gắn lại token mới vào request cũ
  originalConfig.headers = {
    ...originalConfig.headers,
    Authorization: `Bearer ${newAccessToken}`,
  };

  return privateAxios(originalConfig);
};

//
// === Interceptor response: xử lý lỗi và refresh token khi bị 401 / 403 ===
//
privateAxios.interceptors.response.use(
  // Nếu response thành công → trả về như bình thường
  (response: AxiosResponse) => response,

  // Nếu response lỗi
  async (error: AxiosError) => {
    const originalConfig = error.config as ExtendedInternalAxiosRequestConfig;

    // Nếu không có phản hồi từ server (lỗi mạng...)
    if (!error.response) {
      console.error('Server not responding:', error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Kiểm tra originalConfig tồn tại
    if (originalConfig && (status === 401 || status === 403) && !originalConfig._retry) {
      originalConfig._retry = true;

      // Nếu đang trong quá trình refresh → chờ promise đó
      if (isRefreshing) {
        try {
          await refreshPromise;
          return retryRequest(originalConfig); // Sau khi refresh xong thì retry
        } catch (e) {
          // window.location.href = '/buyer/sign-in'; // Nếu refresh thất bại
          return new Promise(() => { });
        }
      }

      // Nếu chưa refresh → bắt đầu refresh
      try {
        isRefreshing = true;

        // Gọi API refresh token
        refreshPromise = refreshAxios.post('/api/v1/auth/refresh-token', {
          refreshToken,
        });
        const response = await refreshPromise;

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        if (newAccessToken && newRefreshToken) {
          setToken(newAccessToken, newRefreshToken);
        }

        return retryRequest(originalConfig); // Retry lại request cũ
      } catch (refreshErr) {
        console.warn('Refresh token failed', refreshErr);
        removeToken(); // Xoá token cũ từ Redux store
        // window.location.href = '/buyer/sign-in'; // Chuyển về trang đăng nhập
        return new Promise(() => { });
      } finally {
        // Reset trạng thái refresh
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Các lỗi khác không phải 401/403 thì reject như bình thường
    return Promise.reject(error);
  }
);
