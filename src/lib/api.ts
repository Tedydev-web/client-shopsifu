import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios' // đã có
import Cookies from 'js-cookie'

// ==================== PUBLIC AXIOS (Truyền csrf-token vào header) ====================

export const publicAxios = axios.create({
  baseURL: '', // Sử dụng URL tương đối - sẽ gửi yêu cầu đến server đang chạy
  withCredentials: true // 🔒 Rất quan trọng để cookie đi theo request
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
