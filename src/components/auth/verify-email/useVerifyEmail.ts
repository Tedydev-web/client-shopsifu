import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/services/authService'
import { showToast } from '@/components/ui/toastify'
import { ErrorResponse } from '@/types/base.interface'

type ActionType = 'signup' | 'forgot'

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = (searchParams.get('action') as ActionType) || 'signup'

  const handleSendOTP = async (email: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Xác định type dựa vào action
      const type = action === 'signup' ? 'REGISTER' : 'FORGOT_PASSWORD'
      
      await authService.sendOTP({
        email,
        type
      })

      showToast('Mã xác thực đã được gửi đến email của bạn', 'success')
      
      // Chuyển hướng đến trang nhập mã xác thực với email và action
      router.push(`/buyer/verify-code?email=${encodeURIComponent(email)}&action=${action}`)
      return true
    } catch (error) {
      const err = error as ErrorResponse
      const firstMessage = err?.message?.[0]?.message
      showToast(firstMessage || 'Có lỗi xảy ra khi gửi mã xác thực', 'error')
      console.error('Send OTP error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    handleSendOTP,
    action
  }
}
