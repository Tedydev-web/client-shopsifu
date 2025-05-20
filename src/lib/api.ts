import { showToast } from '@/components/ui/toastify';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';// đã có
import Cookies from 'js-cookie'

// ==================== PUBLIC AXIOS (Truyền csrf-token vào header) ====================

export const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 🔒 Rất quan trọng để cookie đi theo request
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

// ==================== PRIVATE AXIOS (Thêm access token và xử lý lỗi 401) ====================

export const privateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
})

// Request Interceptor → Gắn access token và csrf token
privateAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('xsrf-token')

      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor → Xử lý lỗi 401
privateAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      showToast('Vui lòng đăng nhập tài khoản', 'error')
      window.location.href = '/buyer/sign-in'
    }
    return Promise.reject(error)
  }
)
