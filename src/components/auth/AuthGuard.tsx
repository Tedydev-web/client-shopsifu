'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/route';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Spinner } from '@/components/ui/spinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    isAuthenticated, 
    isLoading, 
    userData,
    checkRouteAccess,
    getHomeRedirectByRole
  } = useAuthGuard();

  useEffect(() => {
    if (!isLoading) {
      const { 
        isProtectedRoute, 
        isAdminRoute, 
        canAccessAdminRoute 
      } = checkRouteAccess(pathname);

      // Case 1: Route cần auth nhưng chưa đăng nhập
      if (isProtectedRoute && !isAuthenticated) {
        console.log('🔒 Redirecting to sign-in: Not authenticated');
        router.push(ROUTES.AUTH.SIGNIN);
        return;
      }
      
      // Case 2: Admin route - cần kiểm tra role
      if (isAdminRoute && isAuthenticated && userData) {
        const userRole = userData.role?.name?.toUpperCase() || '';
        
        if (!canAccessAdminRoute(userRole)) {
          console.log(`🚫 Access denied: ${userRole} cannot access ${pathname}`);
          // Redirect về home theo role
          router.push(getHomeRedirectByRole(userRole));
          return;
        }
      }
      
      // Case 3: Đã đăng nhập mà vào auth pages
      if (isAuthenticated && userData && ['/sign-in', '/sign-up'].includes(pathname)) {
        const userRole = userData.role?.name?.toUpperCase() || '';
        const homeRoute = getHomeRedirectByRole(userRole);
        console.log(`🏠 Redirecting authenticated user to: ${homeRoute}`);
        router.push(homeRoute);
        return;
      }
    }
  }, [isAuthenticated, isLoading, pathname, userData, router, checkRouteAccess, getHomeRedirectByRole]);

  // Show loading khi cần thiết
  if (isLoading) {
    const { isProtectedRoute, isAdminRoute } = checkRouteAccess(pathname);
    
    if (isProtectedRoute || isAdminRoute) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
          <span className="ml-2 text-gray-600">Đang kiểm tra quyền truy cập...</span>
        </div>
      );
    }
  }

  // Block access logic
  if (!isLoading) {
    const { 
      isProtectedRoute, 
      isAdminRoute, 
      canAccessAdminRoute 
    } = checkRouteAccess(pathname);

    // Block nếu chưa auth và cần auth
    if (isProtectedRoute && !isAuthenticated) {
      return null;
    }

    // Block nếu admin route nhưng không có quyền
    if (isAdminRoute && isAuthenticated && userData) {
      const userRole = userData.role?.name?.toUpperCase() || '';
      if (!canAccessAdminRoute(userRole)) {
        return null;
      }
    }
  }

  return <>{children}</>;
} 