import { showToast } from '@/components/ui/toastify';
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';// đã có
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken';
import { addHours, differenceInMinutes } from 'date-fns';
import { API_ENDPOINTS } from '@/constants/api';
import { useLogout } from '@/hooks/useLogout';
import { ROUTES } from '@/constants/route';
import { getStore } from '@/store/store';
import { cookies } from 'next/headers';
import { clearProfile } from '@/store/features/auth/profileSlide';
// import { useClearGlobalState } from '@/hooks/useClearGlobalState';
import { clearClientState } from '@/utils/stateManager';



// const { clearState } = useClearGlobalState();
// Constants
const TOKEN_CHECK_INTERVAL = 300000; // 5 minutes
const TOKEN_REFRESH_THRESHOLD = 10; // minutes
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

// const processQueue = (error: any = null, token: string | null = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// const refreshTokenWithRetry = async (retries = MAX_REFRESH_RETRIES) => {
//   for (let i = 0; i < retries; i++) {
//     try {
//       await authService.refreshToken();
//       return true;
//     } catch (error) {
//       if (i === retries - 1) throw error;
//       await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
//     }
//   }
//   return false;
// };

// const refreshToken = async (): Promise<void> => {
//   if (refreshPromise) {
//     return refreshPromise;
//   }
  
//   refreshPromise = refreshTokenWithRetry()
//     .then(() => {}) // Convert Promise<boolean> to Promise<void>
//     .finally(() => {
//       refreshPromise = null;
//     });
    
//   return refreshPromise;
// };

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

// Helper function to clear all cookies for the current domain
const clearAllCookies = () => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    // To delete a cookie, we must set its expiration date to the past and specify the same path and domain attributes if they were used when the cookie was set.
    // Setting path=/ should cover most cases for site-wide cookies.
    document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
};

// Response Interceptor → Xử lý lỗi 401
privateAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error('❌ Lỗi 401 - Unauthorized. Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất...');
      const { store, persistor } = getStore();

      // 1. Clear all site cookies
      clearAllCookies();

      // 2. Purge persisted state from storage
      await persistor.purge();

      // 3. Dispatch action to clear profile from the current redux state
      store.dispatch(clearProfile());

      showToast('Bạn đã hết phiên đăng nhập, vui lòng đăng nhập lại', 'info');

      // 4. Redirect to sign-in page after a short delay to allow state changes to process
      setTimeout(() => {
        window.location.href = ROUTES.BUYER.SIGNIN;
      }, 100);
    }
    return Promise.reject(error);
  }
);

// Token check function
const checkToken = async () => {
  const accessToken = Cookies.get('access_token');
  const refreshToken = Cookies.get('refresh_token');

  // Case 1: Không có access token, nhưng có refresh token. Try to recover the session.
  if (!accessToken && refreshToken) {
    console.log('Không có access token, đang thử làm mới từ refresh token...');
    try {
      await refreshAxios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
      console.log('✅ Token đã được làm mới thành công khi khởi tạo.');
    } catch (error) {
      console.error('❌ Không thể làm mới token. Đăng xuất người dùng.', error);
      await clearClientState();
      if (window.location.pathname !== ROUTES.BUYER.SIGNIN) {
        window.location.href = ROUTES.BUYER.SIGNIN;
      }
    }
    return; // End this check cycle. The next one will have the new access token.
  }

  // Case 2: Không có token. Người dùng chưa đăng nhập. Bỏ qua kiểm tra.
  if (!accessToken && !refreshToken) {
    console.log('Không có token, người dùng chưa đăng nhập. Bỏ qua kiểm tra.');
    await clearClientState();
    return;
  }

  // Case 3: Access token tồn tại. Tiếp tục kiểm tra.
  try {
    const decodedToken = jwt.decode(accessToken!) as DecodedToken;
    if (!decodedToken?.exp) {
      throw new Error('Token không hợp lệ hoặc thiếu trường exp');
    }

    const timeLeftInMinutes = getTokenTimeLeft(decodedToken.exp);

    // If token is already expired, try to refresh it.
    if (timeLeftInMinutes < 0) {
      console.warn('Token đã hết hạn. Thử làm mới...');
      try {
        await refreshAxios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
        console.log('✅ Token đã được làm mới do đã hết hạn.');
      } catch (error) {
        console.error('❌ Không thể làm mới token đã hết hạn. Đăng xuất...', error);
        await clearClientState();
        window.location.href = ROUTES.BUYER.SIGNIN;
      }
      return;
    }

    // If token is nearing expiry, refresh it proactively.
    if (timeLeftInMinutes <= TOKEN_REFRESH_THRESHOLD) {
      try {
        console.log(`Token sắp hết hạn (còn ${timeLeftInMinutes.toFixed(2)} phút), đang làm mới...`);
        await refreshAxios.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
        console.log('✅ Token refreshed thành công');
      } catch (error) {
        console.error('❌ Không thể làm mới token chủ động:', error);
      }
    } else {
      // console.log(`Token còn ${timeLeftInMinutes.toFixed(2)} phút`);
    }
  } catch (error) {
    console.error('Lỗi khi giải mã hoặc kiểm tra token. Token có thể bị lỗi:', error);
    await clearClientState();
    window.location.href = ROUTES.BUYER.SIGNIN;
  }
};

// Interval management
let tokenCheckInterval: NodeJS.Timeout;

export const startTokenCheck = () => {
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

export const stopTokenCheck = () => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
  }
};

// Initialize token check
// if (typeof window !== 'undefined') {
//   startTokenCheck();
//   window.addEventListener('beforeunload', stopTokenCheck);
// }
