import { BaseResponse } from "../base.interface";

/**
 * Kiểu dữ liệu người dùng đã được làm phẳng, thân thiện với client.
 * Đây là mô hình chuẩn để sử dụng trong toàn bộ ứng dụng (Redux, components, hooks).
 */
export interface UserProfile {
  id: number;
  email: string;
  role: string;
  status: string;
  twoFactorEnabled: boolean;
  googleId: string | null;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Kiểu dữ liệu gốc trả về từ API get-profile.
 * Chỉ sử dụng trong service và hook `useGetProfile` để chuyển đổi.
 */
export interface UserProfileResponse extends BaseResponse {
    data: {
        id: number;
        email: string;
        role: string;
        status: string;
        twoFactorEnabled: boolean;
        googleId: string | null;
        createdAt: string;
        updatedAt: string;
        userProfile?: {
            firstName: string;
            lastName: string;
            username: string;
            phoneNumber: string | null;
            avatar: string | null
        }
    },
    createdAt: string,
    updatedAt: string,
}


export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    username?: string;
    phoneNumber?: string | null;
    avatar?: string | null;
}

export interface UpdateProfileResponse extends BaseResponse {
    data: {
        id: number;
        email: string;
        role: string;
        status: string;
        twoFactorEnabled: boolean;
        googleId: string | null;
        createdAt: string;
        updatedAt: string;
        userProfile: {
            firstName: string;
            lastName: string;
            username: string;
            phoneNumber: string | null;
            avatar: string | null
        }
    },
}


// ĐỔI MẬT KHẨU TÀI KHOẢN ĐÃ ĐĂNG NHẬP - CHANGE PASSWORD
export interface ChangePasswordRequest {
    currentPassword: string
    newPassword: string
    confirmPassword: string
    revokeOtherSessions?: boolean
  }
  export interface ChangePasswordResponse extends BaseResponse{
    message: string
    verificationType?: string
  }