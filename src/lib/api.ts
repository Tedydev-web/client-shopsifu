import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from 'axios';
import { getToken, setToken, removeToken } from './auth';
import { ErrorResponse } from '@/types/base.interface'

  
  // Định nghĩa URL gốc cho API, lấy từ biến môi trường
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  
  // Biến để theo dõi xem có đang trong quá trình refresh token không
  let isRefreshing = false;
  
  // Promise dùng để giữ quá trình refresh hiện tại
  let refreshPromise: Promise<any> | null = null;
  
  // Thêm interface mở rộng cho config
  interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }
  
  //
  // ==================== PUBLIC AXIOS (Không cần token) ====================
  //
  // export const publicAxios = axios.create({
  //   baseURL: BASE_URL,
  //   withCredentials: false, // Gửi kèm cookie nếu có
  // });



export const publicAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: false // Giữ nếu cần cookie, hoặc false nếu không cần
})

// ✅ Interceptors: handle SUCCESS + ERROR
publicAxios.interceptors.response.use(
    (response: AxiosResponse) => {
        // 🟢 Handle thành công
        console.log('✅ API success:', response)
        return response
    },
    (error) => {
        // 🔴 Handle lỗi
        if (axios.isAxiosError(error)) {
            const errorResponse = error.response?.data as ErrorResponse

            console.error('❌ API error:', errorResponse)

            // NÉM RA lỗi chuẩn
            return Promise.reject(errorResponse)
        }

        // Trường hợp không phải lỗi Axios (ví dụ mạng bị mất)
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
  privateAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Chỉ chạy ở client-side
      if (typeof window !== 'undefined') {
        const token = getToken(); // Lấy token từ Redux store
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
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
    const newToken = getToken(); // Lấy token mới từ Redux store
  
    // Nếu không có token mới, redirect về login
    if (!newToken) {
      window.location.href = '/login';
      return new Promise(() => {});
    }
  
    // Gắn lại token mới vào request cũ
    originalConfig.headers = {
      ...originalConfig.headers,
      Authorization: `Bearer ${newToken}`,
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
            window.location.href = '/login'; // Nếu refresh thất bại
            return new Promise(() => {});
          }
        }
  
        // Nếu chưa refresh → bắt đầu refresh
        try {
          isRefreshing = true;
  
          // Gọi API refresh token
          refreshPromise = refreshAxios.post('/auth/refresh-token');
          const response = await refreshPromise;
  
          const newToken = response.data?.token;
          if (newToken) {
            setToken(newToken); // Lưu token mới vào Redux store
          }
  
          return retryRequest(originalConfig); // Retry lại request cũ
        } catch (refreshErr) {
          console.warn('Refresh token failed', refreshErr);
          removeToken(); // Xoá token cũ từ Redux store
          window.location.href = '/login'; // Chuyển về trang đăng nhập
          return new Promise(() => {});
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
  