import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { ForgotPasswordSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { toast } from 'react-hot-toast'
import { SendOTPRequest, SendOTPResponse } from '@/types/auth.interface'

interface ErrorResponse {
  message?: Array<{ message: string }>
}

export function useForgotPassword() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSendOTP = async (email: string) => {
    try {
      setLoading(true)
      const request: SendOTPRequest = {
        email,
        type: 'FORGOT_PASSWORD'
      }
      const response: SendOTPResponse = await authService.sendOTP(request)
      toast.success('Mã xác thực đã được gửi đến email của bạn')
      
      const params = new URLSearchParams()
      params.set('email', response.email)
      router.replace(`/buyer/verify-code?${params.toString()}`)
    } catch (error) {
      const err = error as ErrorResponse
      const firstMessage = err?.message?.[0]?.message
      if (firstMessage === 'Error.EmailNotFound') {
        toast.error('Email không tồn tại trong hệ thống')
      } else {
        toast.error(firstMessage || 'Có lỗi xảy ra khi gửi mã xác thực')
      }
      console.error('Send OTP error:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    await handleSendOTP(data.email)
  }

  return { loading, onSubmit, handleSendOTP }
}