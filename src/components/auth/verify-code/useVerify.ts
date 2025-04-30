import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { otpSchema } from '../schema/index'

export function useVerify() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    setLoading(true)
    console.log(data)
    // Simulate OTP verification success
    setTimeout(() => {
      setLoading(false)
      router.push('/admin/reset-password') // Redirect after verification
    }, 2000)
  }

  return { loading, onSubmit }
}
