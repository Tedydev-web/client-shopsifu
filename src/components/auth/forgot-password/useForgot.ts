import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { ForgotPasswordSchema } from '../schema/index'

export function useForgotPassword() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    setLoading(true)
    console.log(data)
    // Giả lập gửi email đặt lại mật khẩu
    setTimeout(() => {
      setLoading(false)
      alert('If the email exists, you will receive instructions to reset your password.')
      router.push('/admin/verify') // Chuyển hướng sau khi gửi email
    }, 2000)
  }

  return { loading, onSubmit }
}
