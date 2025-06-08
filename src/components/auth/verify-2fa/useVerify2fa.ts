import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { otpSchema, recoveryCodeSchema } from '../schema/index'
import { authService } from '@/services/auth/authService'
import { ROUTES } from '@/constants/route'
import { parseApiError } from '@/utils/error'
import { Verify2faResponse, VerifyOTPResponse } from '@/types/auth/auth.interface'
import { useTranslation } from 'react-i18next'

const TRUST_DEVICE_KEY = 'askToTrustDevice'

type TwoFactorType = 'TOTP' | 'OTP' | 'RECOVERY'

export function useVerify2FA() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = (searchParams.get('type') as TwoFactorType) || 'TOTP'

  const {t} = useTranslation()
  
  // Khóa lưu trữ trạng thái thiết bị trong session storage
  // Được cập nhật từ kết quả API sau khi xác thực thành công
  const recovery = recoveryCodeSchema(t)
  const otp = otpSchema(t)
  // Xử lý xác minh 2FA (cho cả TOTP và RECOVERY)
  const verify2FA = async (code: string, method: 'TOTP' | 'RECOVERY') => {
    try {
      setLoading(true);
      const response = await authService.verify2fa({
        code,
        method // Truyền method tương ứng (TOTP hoặc RECOVERY)
      }) as Verify2faResponse;
  
      // Kiểm tra response theo cấu trúc API mới
      if (response.success && response.data?.user) {
        // Đảm bảo lưu giá trị vào sessionStorage trước khi reload
        const isDeviceTrusted = response.data.user.isDeviceTrustedInSession;
        sessionStorage.setItem(TRUST_DEVICE_KEY, String(isDeviceTrusted));
        
        // Hiển thị thông báo thành công
        showToast(response.message || t('auth.2faVerify.verificationSuccess'), 'success');
        
        // Reload trang sau khi đã lưu giá trị
        window.location.href = ROUTES.ADMIN.DASHBOARD;
      } else {
        throw new Error(response.message || t('auth.2faVerify.verificationFailed'));
      }
    } catch (error) {
      showToast(parseApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };
  // Xử lý xác minh OTP (dành riêng cho loại OTP)
  const verifyOTP = async (code: string) => {
    try {
      setLoading(true);
      const response = await authService.verifyOTP({
        code
      }) as VerifyOTPResponse;
      
      // Kiểm tra response theo cấu trúc API mới
      if (response.success && response.data?.user) {
        // Lưu trạng thái isDeviceTrustedInSession vào sessionStorage trước khi điều hướng
        const isDeviceTrusted = response.data.user.isDeviceTrustedInSession;
        sessionStorage.setItem(TRUST_DEVICE_KEY, String(isDeviceTrusted));
        
        // Hiển thị thông báo thành công từ response
        showToast(response.message || t('auth.2faVerify.otpVerificationSuccess'), 'success');
        
        // Điều hướng sau khi xác thực OTP thành công
        window.location.href = ROUTES.ADMIN.DASHBOARD;
      } else {
        throw new Error(response.message || t('auth.2faVerify.otpVerificationFailed'));
      }
    } catch (error) {
      showToast(parseApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };
  // Gửi OTP qua email - sử dụng trong phương thức OTP
  const handleResendOTP = async () => {
    try {
      setLoading(true)
      await authService.sendOTP({
        type: 'LOGIN'
      })
      showToast(t('auth.2faVerify.otpSent'), 'success')
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }
  // Xử lý cho TOTP và RECOVERY
  const handleVerify2FA = async (data: { otp: string }) => {
    try {
      if (type === 'RECOVERY') {
        const result = recovery.safeParse(data);
        if (!result.success) {
          throw result.error;
        }
        await verify2FA(data.otp, 'RECOVERY');
      } else if (type === 'TOTP') {
        otp.parse(data);
        await verify2FA(data.otp, 'TOTP');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('Zod error:', error.errors);
        showToast(error.errors[0].message, 'error');
      } else {
        showToast(parseApiError(error), 'error');
      }
    }
  }
  
  // Xử lý riêng cho OTP
  const handleVerifyOTP = async (data: { otp: string }) => {
    try {
      otp.parse(data);
      await verifyOTP(data.otp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('Zod error:', error.errors);
        showToast(error.errors[0].message, 'error');
      } else {
        showToast(parseApiError(error), 'error');
      }
    }
  }
  // Chỉ cho phép chuyển đổi giữa TOTP và RECOVERY
  const switchToRecovery = () => {
    router.replace(`?type=RECOVERY`)
  }
  
  const switchToTOTP = () => {
    router.replace(`?type=TOTP`)
  }
  
  // OTP là phương thức xác thực tách biệt hoàn toàn
  // Không có chức năng chuyển đổi giữa OTP và TOTP/RECOVERY  // Chọn handler phù hợp dựa trên type hiện tại
  const handleVerifyCode = (data: { otp: string }) => {
    if (type === 'OTP') {
      return handleVerifyOTP(data);
    } else {
      return handleVerify2FA(data);
    }
  };

  return { 
    loading, 
    handleVerifyCode, 
    handleVerifyOTP,
    handleVerify2FA,
    handleResendOTP,
    type, 
    switchToRecovery,
    switchToTOTP,
    schema: type === 'RECOVERY' ? recovery : otp 
  }
}
