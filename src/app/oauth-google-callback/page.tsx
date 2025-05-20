"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/features/auth/authSlide";
import Cookies from 'js-cookie';

export default function OauthCallbackPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    if (accessToken && refreshToken) {
      dispatch(
        setCredentials({
          accessToken,
          refreshToken,
        })
      );
    }
    
    // Luôn chuyển hướng về trang chủ, không cần check lỗi
    window.location.replace("/buyer/sign-in");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}
