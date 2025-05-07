import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { RegisterSchema } from '../schema/index'
import { authService } from '@/services/authService'
import { showToast } from '@/components/ui/toastify'
import { ErrorResponse } from '@/types/base.interface'

export function useSignup() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

//   const handleSendOTP = async (email: string) => {
//     try {
//         setLoading(true)
//         await authService.sendOTP({
//             email,
//             type: 'REGISTER'
//         })
//         showToast('Mã xác thực đã được gửi đến email của bạn', 'success')
//         // Thay vì push, chúng ta sẽ cập nhật URL params
//       const params = new URLSearchParams(searchParams.toString())
//       params.set('email', email)
//       router.replace(`/buyer/sign-up?${params.toString()}`)
//     } catch (error) {
//         const err = error as ErrorResponse
//         const firstMessage = err?.message?.[0]?.message
//         showToast(firstMessage || 'Có lỗi xảy ra khi gửi mã xác thực', 'error')
//         console.error('Send OTP error:', error)
//     } finally {
//         setLoading(false)
//     }
// }


  const handleSendOTP = async (email: string): Promise<boolean> => {
    try {
        setLoading(true)
        await authService.sendOTP({
            email,
            type: 'REGISTER'
        })
        showToast('Mã xác thực đã được gửi đến email của bạn', 'success')
        // router.replace(...) không cần nữa vì giờ mình quản ở page
        return true // ✅ success
    } catch (error) {
        const err = error as ErrorResponse
        const firstMessage = err?.message?.[0]?.message
        showToast(firstMessage || 'Có lỗi xảy ra khi gửi mã xác thực', 'error')
        console.error('Send OTP error:', error)
        return false // ❌ fail
    } finally {
        setLoading(false)
    }
  }


  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      setLoading(true)
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phoneNumber,
        code: data.code
      })
      showToast('Đăng ký tài khoản thành công', 'success')
      router.push('/buyer/sign-in')
    } catch (error) {
      const err = error as ErrorResponse
      const firstMessage = err?.message?.[0]?.message
      showToast(firstMessage || 'Có lỗi xảy ra khi đăng ký', 'error')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { loading, onSubmit, handleSendOTP }
}
