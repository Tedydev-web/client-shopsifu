"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PROTECTED_ROUTES, PUBLIC_ROUTES, ROUTES } from "@/constants/route";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Spinner } from "@/components/ui/spinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthGuard();

  // Kiểm tra xem route hiện tại có cần bảo vệ không
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // Kiểm tra xem có phải route public không
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  useEffect(() => {
    if (!isLoading) {
      // Nếu chưa đăng nhập và đang ở protected route
      if (!isAuthenticated && isProtectedRoute) {
        router.push(ROUTES.AUTH.SIGNIN);
      }

      // Nếu đã đăng nhập và đang ở signin/signup page

      if (
        isAuthenticated &&
        (pathname === ROUTES.AUTH.SIGNIN || pathname === ROUTES.AUTH.SIGNUP)
      ) {
        router.push(ROUTES.HOME);
      }
    }
  }, [isAuthenticated, isLoading, isProtectedRoute, pathname]);

  // Show loading khi đang kiểm tra auth ở protected route
  if (isLoading && isProtectedRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Không render gì nếu chưa auth và đang ở protected route
  if (!isAuthenticated && isProtectedRoute) {
    return null;
  }

  return <>{children}</>;
}