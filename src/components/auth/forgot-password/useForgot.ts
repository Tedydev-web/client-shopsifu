import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { ForgotPasswordSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { toast } from 'react-hot-toast'
import { SendOTPRequest } from '@/types/auth.interface'

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
      await authService.sendOTP(request)
      toast.success('Mã xác thực đã được gửi đến email của bạn')
      
      // Chuyển hướng với email trong query params
      router.replace(`/buyer/verify-code?email=${encodeURIComponent(email)}`)
    } catch (error) {
      const err = error as ErrorResponse
      const firstMessage = err?.message?.[0]?.message
      
      // Hiển thị thông báo lỗi dễ hiểu cho người dùng
      switch (firstMessage) {
        case 'Error.EmailNotFound':
          toast.error('Email này chưa được đăng ký trong hệ thống')
          break
        case 'Error.EmailInvalid':
          toast.error('Email không hợp lệ, vui lòng kiểm tra lại')
          break
        case 'Error.TooManyRequests':
          toast.error('Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau ít phút')
          break
        case 'Error.ServerError':
          toast.error('Hệ thống đang gặp sự cố, vui lòng thử lại sau')
          break
        default:
          toast.error('Không thể gửi mã xác thực. Vui lòng thử lại sau')
      }

      // Log lỗi chi tiết để debug
      console.error('Chi tiết lỗi:', {
        errorCode: firstMessage,
        fullError: error
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    await handleSendOTP(data.email)
  }

  return { loading, onSubmit }
}