import { BaseResponse } from "../base.interface";

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
