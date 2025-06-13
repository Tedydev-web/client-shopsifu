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
        userProfile: {
            firstName: string;
            lastName: string;
            username: string;
            phoneNumber: string | null;
            avatar: string | null
        }
    },
}
