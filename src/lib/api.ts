import { showToast } from '@/components/ui/toastify';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';// đã có
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken';
import { addHours, differenceInMinutes } from 'date-fns';
import { authService } from '@/services/authService';
import { useLogout } from '@/hooks/useLogout';
import { ROUTES } from '@/constants/route';
import { getStore } from '@/store/store';

// Constants
const TOKEN_CHECK_INTERVAL = 300000; // 5 minutes
const TOKEN_REFRESH_THRESHOLD = 7; // minutes
const MAX_REFRESH_RETRIES = 3;

// Types
interface DecodedToken {
  exp?: number;
  iat?: number;
  sub?: string;
}

// Token refresh state
let isRefreshing = false;
let failedQueue: any[] = [];
let refreshPromise: Promise<void> | null = null;

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshTokenWithRetry = async (retries = MAX_REFRESH_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      await authService.refreshToken();
      return true;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return false;
};

const refreshToken = async (): Promise<void> => {
  if (refreshPromise) {
    return refreshPromise;
  }
  
  refreshPromise = refreshTokenWithRetry()
    .then(() => {}) // Convert Promise<boolean> to Promise<void>
    .finally(() => {
      refreshPromise = null;
    });
    
  return refreshPromise;
};

// ==================== PUBLIC AXIOS (Truyền csrf-token vào header) ====================

export const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 🔒 Rất quan trọng để cookie đi theo request
})

// Request Interceptor → Gắn x-csrf-token
publicAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('xsrf-token');
      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken;
      }
      // Inject Accept-Language from Redux
      const store = getStore();
      const lang = store.store.getState().langShopsifu?.language || 'vi';
      if (config.headers) {
        config.headers['Accept-Language'] = lang;
      }
    }
    return config;
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
// ==================== REFRESH AXIOS (Thêm access token và xử lý lỗi 401) ====================
export const refreshAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json",
   },
});

refreshAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('xsrf-token');
      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken;
      }
      // Inject Accept-Language from Redux
      const store = getStore();
      const lang = store.store.getState().langShopsifu?.language || 'vi';
      if (config.headers) {
        config.headers['Accept-Language'] = lang;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
)


// ==================== PRIVATE AXIOS (Thêm access token và xử lý lỗi 401) ====================

// export const privateAxios = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   withCredentials: true,
// })

// // Request Interceptor → Gắn access token và csrf token
// privateAxios.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     if (typeof window !== 'undefined') {
//       const csrfToken = Cookies.get('xsrf-token')

//       if (csrfToken && config.headers) {
//         config.headers['x-csrf-token'] = csrfToken
//       }
//     }

//     return config
//   },
//   (error) => Promise.reject(error)
// )

// // Response Interceptor → Xử lý lỗi 401
// privateAxios.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response
//   },
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       showToast('Vui lòng đăng nhập tài khoản', 'info')
//       window.location.href = '/buyer/sign-in' 
//     }
//     return Promise.reject(error)
//   }
// )


// Hàm kiểm tra thời gian còn lại của token
const getTokenTimeLeft = (expTimestamp: number): number => {
  try {
    // Chuyển timestamp (giây) thành Date object (UTC)
    const expirationDate = new Date(expTimestamp * 1000);
    const utcPlus7 = addHours(expirationDate, 7); // Chuyển sang UTC+7

    // Lấy thời gian hiện tại và chuyển sang UTC+7
    const now = new Date();
    const nowUtcPlus7 = addHours(now, 7);

    // Tính chênh lệch thời gian theo phút
    const timeDiffInMinutes = differenceInMinutes(utcPlus7, nowUtcPlus7);

    console.log(`Thời gian hết hạn (UTC+7): ${utcPlus7.toISOString()}`);
    console.log(`Thời gian hiện tại (UTC+7): ${nowUtcPlus7.toISOString()}`);
    console.log(`Chênh lệch thời gian còn lại: ${timeDiffInMinutes} phút`);

    return timeDiffInMinutes;
  } catch (error) {
    console.error('Lỗi khi kiểm tra thời gian hết hạn token:', error);
    return -1; // Trả về -1 nếu có lỗi
  }
};


// Tạo instance privateAxios
export const privateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor → Chỉ gắn x-csrf-token
privateAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const csrfToken = Cookies.get('xsrf-token');
      const sltToken = Cookies.get('slt_token');
      console.log("sessionToken: ", sltToken)
      if (csrfToken && config.headers) {
        config.headers['x-csrf-token'] = csrfToken;
      }
      // Inject Accept-Language from Redux
      const store = getStore();
      const lang = store.store.getState().langShopsifu?.language || 'vi';
      if (config.headers) {
        config.headers['Accept-Language'] = lang;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response Interceptor → Xử lý lỗi 401
privateAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('Token bị vô hiệu hóa hoặc không hợp lệ:', error.response?.data);
      showToast('Bạn đã hết phiên đăng nhập, vui lòng đăng nhập lại', 'info');
      window.location.href = ROUTES.BUYER.SIGNIN;
    }
    return Promise.reject(error);
  }
);

// Token check function
const checkToken = async () => {
  const accessToken = Cookies.get('access_token');
  if (!accessToken) {
    console.warn('Không tìm thấy access token');
    return;
  }

  try {
    const decodedToken = jwt.decode(accessToken) as DecodedToken;
    if (!decodedToken?.exp) {
      console.warn('Token không hợp lệ hoặc thiếu trường exp');
      return;
    }

    const timeLeftInMinutes = getTokenTimeLeft(decodedToken.exp);
    
    if (timeLeftInMinutes < 0) {
      console.warn('Token đã hết hạn');
      window.location.href = ROUTES.BUYER.SIGNIN;
      return;
    }

    if (timeLeftInMinutes <= TOKEN_REFRESH_THRESHOLD) {
      try {
        await refreshToken();
        console.log('✅ Token refreshed successfully');
      } catch (error) {
        console.error('❌ Failed to refresh token:', error);
        window.location.href = ROUTES.BUYER.SIGNIN;
      }
    } else {
      console.log(`Token còn ${timeLeftInMinutes} phút`);
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra token:', error);
  }
};

// Interval management
let tokenCheckInterval: NodeJS.Timeout;

const startTokenCheck = () => {
  console.log('Bắt đầu kiểm tra access_token');
  if (typeof window !== 'undefined') {
    if (tokenCheckInterval) {
      clearInterval(tokenCheckInterval);
    }
    
    // Check immediately on start
    checkToken();
    
    tokenCheckInterval = setInterval(checkToken, TOKEN_CHECK_INTERVAL);
  }
};

const stopTokenCheck = () => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
  }
};

// Initialize token check
if (typeof window !== 'undefined') {
  startTokenCheck();
  window.addEventListener('beforeunload', stopTokenCheck);
}