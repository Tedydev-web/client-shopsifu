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
  // Gửi OTP qua email - sử dụng trong phương thức OTP
  const handleResendOTP = async () => {
    try {
      setLoading(true)
      const response = await authService.sendOTP({
        type: 'LOGIN'
      })
      showToast(response.message || t('auth.2faVerify.otpSent'), 'success')
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  // Hợp nhất logic xác thực và gọi API cho 2FA (TOTP/RECOVERY)
  const handleVerify2FA = async (data: { otp: string }) => {
    try {
      setLoading(true);
      let method: 'TOTP' | 'RECOVERY';

      if (type === 'RECOVERY') {
        const result = recovery.safeParse(data);
        if (!result.success) {
          throw result.error;
        }
        method = 'RECOVERY';
      } else if (type === 'TOTP') {
        otp.parse(data);
        method = 'TOTP';
      } else {
        // Trường hợp không mong muốn, nhưng để an toàn
        throw new Error('Invalid 2FA method type.');
      }

      const response = await authService.verify2fa({
        code: data.otp,
        method
      }) as Verify2faResponse;

      if (response.status === 201 && response.data?.user) {
        const isDeviceTrusted = response.data.user.isDeviceTrustedInSession;
        sessionStorage.setItem(TRUST_DEVICE_KEY, String(isDeviceTrusted));
        showToast(response.message || t('auth.2faVerify.verificationSuccess'), 'success');
        window.location.href = ROUTES.ADMIN.DASHBOARD;
      } else {
        throw new Error(response.message || t('auth.2faVerify.verificationFailed'));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast(error.errors[0].message, 'error');
      } else {
        showToast(parseApiError(error), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Hợp nhất logic xác thực và gọi API cho OTP
  const handleVerifyOTP = async (data: { otp:string }) => {
    try {
      setLoading(true);
      otp.parse(data);
      
      const response = await authService.verifyOTP({
        code: data.otp
      }) as VerifyOTPResponse;

      if (response.status === 201 && response.data?.user) {
        const isDeviceTrusted = response.data.user.isDeviceTrustedInSession;
        sessionStorage.setItem(TRUST_DEVICE_KEY, String(isDeviceTrusted));
        showToast(response.message || t('auth.2faVerify.otpVerificationSuccess'), 'success');
        window.location.href = ROUTES.ADMIN.DASHBOARD;
      } else {
        throw new Error(response.message || t('auth.2faVerify.otpVerificationFailed'));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast(error.errors[0].message, 'error');
      } else {
        showToast(parseApiError(error), 'error');
      }
    } finally {
      setLoading(false);
    }
  };
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
