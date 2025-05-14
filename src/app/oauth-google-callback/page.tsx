"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/features/auth/authSlide";

export default function OauthCallbackPage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      try {
        dispatch(
          setCredentials({
            accessToken,
            refreshToken,
          })
        );
        toast.success("Đăng nhập thành công!");

        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      } catch (error) {
        console.error("Error saving tokens:", error);
        setError("Có lỗi xảy ra khi lưu thông tin đăng nhập");
        toast.error("Có lỗi xảy ra khi lưu thông tin đăng nhập");
        setLoading(false);
      }
    } else {
      const errorMessage = searchParams.get("errorMessage");
      setError(errorMessage ?? "Có lỗi xảy ra khi đăng nhập bằng Google");
      toast.error(errorMessage ?? "Có lỗi xảy ra khi đăng nhập bằng Google");
      setLoading(false);

      setTimeout(() => {
        window.location.replace("/buyer/sign-in");
      }, 2000);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error && (
        <div className="mb-4 p-3 bg-destructive/15 text-destructive text-sm rounded-md">
          {error}
        </div>
      )}
      {loading && !error && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Đang xử lý đăng nhập...</p>
        </div>
      )}
    </div>
  );
}
