import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/services/authService'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import {t} from "i18next"

type ActionType = 'signup' | 'forgot'

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = (searchParams.get('action') as ActionType) || 'signup'

  const handleSendOTP = async (email: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Sử dụng API khác nhau dựa trên action
      if (action === 'signup') {
        // Sử dụng register_send cho đăng ký
        await authService.register_send({ email })
      } else {
        // Action là 'forgot' - phần này sẽ được thêm khi có API
        // Hiện tại làm sẵn cấu trúc cho future implementation
        // TODO: Uncomment khi có API forgot password
        // await authService.forgotPassword({ email })
        
        // Tạm thời sử dụng sendOTP với type RESET_PASSWORD
        await authService.sendOTP({
          email,
          type: 'RESET_PASSWORD'
        })
      }
      
      showToast(t('admin.showToast.auth.sentCode'), 'success')
      
      // Chuyển hướng đến trang nhập mã xác thực và truyền action để giữ nguyên luồng xử lý
      router.push(`/verify-code?action=${action}`)
      return true
    } catch (error) {
      showToast(parseApiError(error), 'error')
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
