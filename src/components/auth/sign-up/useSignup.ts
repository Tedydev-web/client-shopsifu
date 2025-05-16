import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { RegisterSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'

const TOKEN_KEY = 'token_verify_code'

export function useSignup() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const handleSignup = async (data: z.infer<typeof RegisterSchema>) => {
    if (!email) {
      showToast('Không tìm thấy email, vui lòng thử lại', 'error')
      return
    }

    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      showToast('Phiên xác thực đã hết hạn, vui lòng thử lại', 'error')
      return
    }

    try {
      setLoading(true)
      await authService.register({
        name: data.name,
        email: email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phoneNumber,
        token: token
      })
      
      // Clear token after successful registration
      localStorage.removeItem(TOKEN_KEY)
      
      showToast('Đăng ký tài khoản thành công', 'success')
      router.push('/buyer/sign-in')
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { loading, handleSignup }
}
